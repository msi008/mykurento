;(function($, undefined) {
	var _login_ = $('#login'),                      //登录区域
		_kurento_room_ = $('#room'),                //内容区域
		_login_clear_ = $('#clear'),                //登录页面清除按钮
		_login_joinBtn_ = $('#joinBtn'),            //登录按钮
		_login_username = $('#name'),               //用户名的输入框
		_login_roomname = $('#roomName')            //房间名输入框
		; 
	var _serverUrl = 'https://www.kurento.me/rs/';
	var _scope = {};
	var _ServiceRoom = new ServiceRoom();
	var _ServiceParticipant = new Participants();
	function __init(){
		_showlogin();
		
		_initialization();
		_addEvents();
	}
	function _showroom(){
		//隐藏登录房间，房间模块显示
		_login_.hide();
		_kurento_room_.show();
	}
	function _showlogin(){
		//显示登录房间，房间模块隐藏
		_login_.show();
		_kurento_room_.hide();
	}
	function _initialization(){
		//首先加载服务器的信息房间列表等数据
		$.get(_serverUrl+'getAllRooms').
		    success(function (data, status, headers, config) {
		        _scope.listRooms = data;
		    }).
		    error(function (data, status, headers, config) {});
		$.get(_serverUrl+'getClientConfig').
		     success(function (data, status, headers, config) {
		    	_scope.clientConfig = data;
		     }).
		     error(function (data, status, headers, config) {});
		$.get(_serverUrl+'getUpdateSpeakerInterval').
			success(function (data, status, headers, config) {
				_scope.updateSpeakerInterval = data
			}).
			error(function (data, status, headers, config) {});
		$.get(_serverUrl+'getThresholdSpeaker').
			success(function (data, status, headers, config) {
				_scope.thresholdSpeaker = data
			}).
			error(function (data, status, headers, config) {});
	}
	function _addEvents(){
		_login_clear_.on('click',function(){
			//登录页面清除按钮
			_login_username.val('');
			_login_roomname.val('');
			_scope.room = "";
			_scope.userName = "";
			_scope.roomName = "";
		});
		_login_joinBtn_.on('click',function(){
			//登录页面加入房间按钮
			createRoom();
		});
//		window.addEventListener("hashchange",function(){
//			if(location.hash == '#call'){
//				_showroom();
//				_createcall();
//			}
//		});
		$('#buttonLeaveRoom').on('click',function(){
			_ServiceRoom.getKurento().close();

	    	_ServiceParticipant.removeParticipants();

	        //redirect to login
	        window.location.href = '#/login';
		});
	}
	//创建
	function createRoom(){
	    var _userName = $('#name').val();
	    var _roomName = $('#roomName').val();
	    var wsUri = 'wss://123.56.95.235:8443/room';
	    //show loopback stream from server
	    var displayPublished = false;
	    //also show local stream when display my remote
	    var mirrorLocal = false;
	    var kurento = KurentoRoom(wsUri, function (error, kurento) {
	        if (error)
	            return console.log(error);
	        //TODO token should be generated by the server or a 3rd-party component  
	        //kurento.setRpcParams({token : "securityToken"});
	        room = kurento.Room({
	            room: _roomName,
	            user: _userName,
	            updateSpeakerInterval: 1800,
	            thresholdSpeaker: -50 
	        });
	        var localStream = kurento.Stream(room, {
	            audio: true,
	            video: true,
	            data: false
	        });
	        //加入房间成功
	        localStream.addEventListener("access-accepted", function () {
	        	//连接房间
	            room.addEventListener("room-connected", function (roomEvent) {console.log('---1---');
	            	var streams = roomEvent.streams;
	            	if (displayPublished ) {
	            		localStream.subscribeToMyRemote();
	            	}
	            	localStream.publish();
	            	_ServiceRoom.setLocalStream(localStream.getWebRtcPeer());
	                for (var i = 0; i < streams.length; i++) {
	                	_ServiceParticipant.addParticipant(streams[i]);
	                }
	            });
	            //假如房间推送的流集合
	            room.addEventListener("stream-published", function (streamEvent) {console.log('---2---',streamEvent);
	            	_ServiceParticipant.addLocalParticipant(localStream);
	            	 if (mirrorLocal && localStream.displayMyRemote()) {
	            		 var localVideo = kurento.Stream(room, {
	                         video: true,
	                         id: "localStream"
	                     });
	            		 localVideo.mirrorLocalStream(localStream.getWrStream());
	            		 _ServiceParticipant.addLocalMirror(localVideo);
	            	 }
	            });
	            //视频流加入
	            room.addEventListener("stream-added", function (streamEvent) {console.log('---3---');
	            	_ServiceParticipant.addParticipant(streamEvent.stream);
	            });
	            //清楚流
	            room.addEventListener("stream-removed", function (streamEvent) {console.log('---4---');
	            	_ServiceParticipant.removeParticipantByStream(streamEvent.stream);
	            });
	            //新消息
	            room.addEventListener("newMessage", function (msg) {console.log('---5---');
	            	_ServiceParticipant.showMessage(msg.room, msg.user, msg.message);
	            });
	            //房间错误
	            room.addEventListener("error-room", function (error) {console.log('---6---',error);
	            	//error  code=104该用户已经在房间内了
	            	_ServiceParticipant.showError(window, LxNotificationService, error);
	            });
	            //错误的媒体
	            room.addEventListener("error-media", function (msg) {console.log('---7---');
	            	_ServiceParticipant.alertMediaError($window, LxNotificationService, msg.error, function (answer) {
	                	console.warn("Leave room because of error: " + answer);
	                	if (answer) {
	                		kurento.close(true);
	                	}
	                });
	            });
	            //房间封闭
	            room.addEventListener("room-closed", function (msg) {console.log('---8---');
	            	if (msg.room !== _roomName) {
	            		console.error("Closed room name doesn't match this room's name", 
	            				msg.room, _roomName);
	            	} else {
	            		kurento.close(true);
	            		_ServiceParticipant.forceClose($window, LxNotificationService, 'Room '
	            			+ msg.room + ' has been forcibly closed from server');
	            	}
	            });
	            //失去连接
	            room.addEventListener("lost-connection", function(msg) {console.log('---9---');
	                kurento.close(true);
	                _ServiceParticipant.forceClose($window, LxNotificationService,
	                  'Lost connection with room "' + msg.room +
	                  '". Please try reloading the webpage...');
	              });
	            //停止声音流
	            room.addEventListener("stream-stopped-speaking", function (participantId) {console.log('---10---');
	            	_ServiceParticipant.streamStoppedSpeaking(participantId);
	             });
	            //声音流
	             room.addEventListener("stream-speaking", function (participantId) {console.log('---11---');
	            	 _ServiceParticipant.streamSpeaking(participantId);
	             });
	             //跟新主要发言人
	             room.addEventListener("update-main-speaker", function (participantId) {
	            	 _ServiceParticipant.updateMainSpeaker(participantId);
	              });
	
	            room.connect();
	        });
	        //拒绝访问
	        localStream.addEventListener("access-denied", function () {console.log('---000---');
	        	_ServiceParticipant.showError($window, LxNotificationService, {
	        		error : {
	        			message : "Access not granted to camera and microphone"
	        				}
	        	});
	        });
	        localStream.init();
	    });
	
	    //save kurento & roomName & userName in service
	    _ServiceRoom.setKurento(kurento);
	    _ServiceRoom.setRoomName(_roomName);
	    _ServiceRoom.setUserName(_userName);
	    //redirect to call
	    //window.location.href = '#call';
	    _showroom();
		_createcall();
	}
	
	/*
	 * 房间
	 */
	function _createcall(){
		
		var _roomName = _ServiceRoom.getRoomName();
	    var _userName = _ServiceRoom.getUserName();
	    var _participants = _ServiceParticipant.getParticipants();
	    var _kurento = _ServiceRoom.getKurento();
		//离开房间
	    $scope.leaveRoom = function () {

	    	_ServiceRoom.getKurento().close();

	    	_ServiceParticipant.removeParticipants();

	        //redirect to login
	        window.location.href = '#/login';
	    };

	    window.onbeforeunload = function () {
	    	//not necessary if not connected
	    	if (_ServiceParticipant.isConnected()) {
	    		_ServiceRoom.getKurento().close();
	    	}
	    };

			//全拼
	    $scope.goFullscreen = function () {

	        if (Fullscreen.isEnabled())
	            Fullscreen.cancel();
	        else
	            Fullscreen.all();

	    };
	    //禁用主扬声器
	    $scope.disableMainSpeaker = function (value) {

	    	var element = document.getElementById("buttonMainSpeaker");
	        if (element.classList.contains("md-person")) { //on
	            element.classList.remove("md-person");
	            element.classList.add("md-recent-actors");
	            _ServiceParticipant.enableMainSpeaker();
	        } else { //off
	            element.classList.remove("md-recent-actors");
	            element.classList.add("md-person");
	            _ServiceParticipant.disableMainSpeaker();
	        }
	    };
			//开关音量
	    $scope.onOffVolume = function () {
	        var localStream = _ServiceRoom.getLocalStream();
	        var element = document.getElementById("buttonVolume");
	        if (element.classList.contains("md-volume-off")) { //on
	            element.classList.remove("md-volume-off");
	            element.classList.add("md-volume-up");
	            localStream.audioEnabled = true;
	        } else { //off
	            element.classList.remove("md-volume-up");
	            element.classList.add("md-volume-off");
	            localStream.audioEnabled = false;

	        }
	    };
			//打开关闭摄像头
	    $scope.onOffVideocam = function () {
	        var localStream = _ServiceRoom.getLocalStream();
	        var element = document.getElementById("buttonVideocam");
	        if (element.classList.contains("md-videocam-off")) {//on
	            element.classList.remove("md-videocam-off");
	            element.classList.add("md-videocam");
	            localStream.videoEnabled = true;
	        } else {//off
	            element.classList.remove("md-videocam");
	            element.classList.add("md-videocam-off");
	            localStream.videoEnabled = false;
	        }
	    };
			//断开流
	    $scope.disconnectStream = function() {
	    	var localStream = _ServiceRoom.getLocalStream();
	    	var participant = _ServiceParticipant.getMainParticipant();
	    	if (!localStream || !participant) {
	    		LxNotificationService.alert('Error!', "Not connected yet", 'Ok', function(answer) {
	            });
	    		return false;
	    	}
	    	_ServiceParticipant.disconnectParticipant(participant);
	    	_ServiceRoom.getKurento().disconnectParticipant(participant.getStream());
	    };
	    
	    //聊天
	    $scope.message;
			//发送消息
	    $scope.sendMessage = function () {
	        console.log("Sending message", $scope.message);
	        var kurento = _ServiceRoom.getKurento();
	        kurento.sendMessage(_roomName, _userName, $scope.message);
	        $scope.message = "";
	    };

	    //打开或关闭聊天时，点击“聊天”按钮
	    $scope.toggleChat = function () {
	        var selectedEffect = "slide";
	        // most effect types need no options passed by default
	        var options = {direction: "right"};
	        if ($("#effect").is(':visible')) {
	            $("#content").animate({width: '100%'}, 500);
	        } else {
	            $("#content").animate({width: '80%'}, 500);
	        }
	        // run the effect
	        $("#effect").toggle(selectedEffect, options, 500);
	    };
	    //显示帽子
	    $scope.showHat = function () {
	    	var targetHat = false;
	    	var offImgStyle = "md-mood";
	    	var offColorStyle = "btn--deep-purple";
	    	var onImgStyle = "md-face-unlock";
	    	var onColorStyle = "btn--purple";
	    	var element = document.getElementById("hatButton");
	        if (element.classList.contains(offImgStyle)) { //off
	            element.classList.remove(offImgStyle);
	            element.classList.remove(offColorStyle);
	            element.classList.add(onImgStyle);
	            element.classList.add(onColorStyle);
	            targetHat = true;
	        } else if (element.classList.contains(onImgStyle)) { //on
	            element.classList.remove(onImgStyle);
	            element.classList.remove(onColorStyle);
	            element.classList.add(offImgStyle);
	            element.classList.add(offColorStyle);
	            targetHat = false;
	        }
	    	
	        var hatTo = targetHat ? "on" : "off";
	    	console.log("Toggle hat to " + hatTo);
	    	_ServiceRoom.getKurento().sendCustomRequest({hat: targetHat}, function (error, response) {
	    		if (error) {
	                console.error("Unable to toggle hat " + hatTo, error);
	                LxNotificationService.alert('Error!', "Unable to toggle hat " + hatTo, 
	                		'Ok', function(answer) {});
	        		return false;
	            } else {
	            	console.debug("Response on hat toggle", response);
	            }
	    	});
	    };
	}

	__init();//执行初始化方法
})(window.jQuery);
        