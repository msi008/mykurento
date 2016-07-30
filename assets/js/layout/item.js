/**
*
*每一个视频窗口对象
*
*
*/

Array.prototype.indexOf = function(val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val) return i;
	}
	return -1;
};

Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};


(function($){
	// 'use strict';
	var Layout = function(element, options){
		this.$el = $(element);
		this.streams = options.streams;
		this.uids = options.uids;
		this.status = options.status;
		this.nums = this.uids.length;
		this.large = false;
		this.type = 'video'; //||ppt whiteboard

		console.log(this.uids);

		this._init();
	}

	Layout.prototype = {
		//初始化
		_init : function(){
			this._render();
			this._addEvents();
		},
		//事件绑定
		_addEvents:function(){
			var self = this;

			this.socket = io.connect();

			//当视频的个数改变时，触发此事件
			$('body').on('VideoItemNumChange', function(){

			}).on('VideoStatusChange', function(){//视频由大视频切换到小视频或者视频由白板切换
				self._getAllItems();
			});

			self.$el.undelegate().delegate('[node-type="_btn_enlarge_narrow"]', 'click', function(){
				var Item = $(this).closest('.video-item'),
					ID = Item.attr('id'),
					OtherItem = Item.siblings(),
					_tp = $(this).find('i').hasClass('icons-enlarge') ? 1 : 2;

				self.type = 'video';
				
				if(_tp == 1){
					self._setActiveItem(this, OtherItem, _tp, Item);
					self.large = true;
				} else {
					self._removeActiveItem(this, OtherItem, _tp);
					self.large = false;
				}
				
			});

			$("#addperson").click(function(){
				 ttttt.LY('setNum');
			})

			$("#updatestatus").click(function(){
				ttttt.LY('setStatus');
				self.socket.emit('updateLayout', 'ppt');
			});

			this.socket.on("updateLayout", function(type){
				alert(type);
			})
		},
		//初始化渲染页面
		_render : function(){
			this._layOut();
			this._addItems();
		},
		//添加items
		_addItems : function(){
			if(this.large){
				this._addLargeItem();
			} else {
				for (var i=0;i<this.nums;i++) {
					this._addItem(this.uids[i]);
				}
			}
			
		},
		//设置active
		_setActiveItem : function(current, OtherItem, _tp, Item){
			var clsName = '', tmpCls = _tp == 1 ? 'icons-narrow' : 'icons-enlarge',
				numClsName = this._getClsName();
			if(this.type=='video'){
				clsName = 'content video-part video-large clearfix';
			} else if(this.type=="ppt"){
				clsName = 'content more-part '+numClsName+' clearfix';
			}

			$(current).find('i').removeClass('icons-enlarge').removeClass('icons-narrow ').addClass(tmpCls);

			this.$el.attr('class', clsName);

			console.log(OtherItem.clone());

			if(this.large && _tp == 1){
				var smallTmpItem = this.$el.find("#participants").children().clone();
				smallTmpItem.find('.icons-narrow').removeClass('icons-narrow').addClass('icons-enlarge');
				this.$el.find("#smallvideo").append(smallTmpItem);//将大视频 移动到小视频里面

				this.$el.find("#participants").html(Item);
				//this.$el.find("#smallvideo").children().remove();
			} else if(!this.large && _tp == 1){
				this.$el.find("#smallvideo").append(OtherItem.clone());
			} else {
				this.$el.find("#smallvideo").append(OtherItem.clone());
			}
			
			OtherItem.remove();
		},
		//取消Active
		_removeActiveItem : function(current, OtherItem, _tp){
			if(this.large){//如果是放大状态，需要将右边小的视频切换到大的
				var _clone = this.$el.find("#smallvideo").children().clone();
				this.$el.find("#participants").append(_clone);
				this.$el.find("#smallvideo").children().remove();
				this.$el.removeClass('video-large').addClass(this._getClsName());
			}
			$(current).find('i').removeClass('icons-narrow').addClass('icons-enlarge');
			// var _clone = $(current).closest('.video-item').clone();

			// $(current).closest('.video-item').remove();
			// this.$el.find("#smallvideo").append(_clone);
		},

		//添加item
		_addItem : function(uid){
			if(this.type == 'ppt'){
				this.$el.find("#smallvideo").append(this._strItem(uid));
			}else if(!this.large){
				this.$el.find("#participants").append(this._strItem(uid));
			} else if(this.large && this.type == 'video'){//如果是在视频页面，则加入视频
				// this.$el.find("#participants").append(this._strItem(uid));
				this.$el.find("#smallvideo").append(this._strItem(uid));
			} else { 
				this.$el.find("#smallvideo").append(this._strItem(uid));
			}
			
		},
		//由于如果在放大状态下，小视频要把大视频排除掉，所以过滤下
		_addLargeItem : function(){
			var arr = this.streams.concat();

			var first = arr.shift();

			this.$el.find("#participants").append(this._strItem());

			for (var i=0;i<arr.length;i++) {
				this._addItem();
			}
		},
		//移除item
		_removeItem : function(){
			this.$el.children().last().remove();
		},
		_strItem : function(uid){
			return ['<div class="video-item" id="'+uid+'">',
					'	<img src="img/p-'+this.nums+'.jpg">',	
					'	<div class="video-option-box">',
					'		<span class="option-body">',
					'			<span class="option-btn"><i class="icons icons-kickout"></i></span>',	
					'			<span class="option-btn"><i class="icons icons-not-interested"></i></span>',	
					'			<span class="option-btn" node-type="_btn_enlarge_narrow"><i class="icons icons-enlarge"></i></span>',	
					'		</span>',			
					'	</div>',							
					'</div>'].join("");
		},
		//所有布局设置
		_layOut : function(){
			var scls = '';
			if(this.type == 'ppt'){
				scls = 'more-part';
			} else {
				scls = 'video-part';
			}
			//如果只有一路视频，则显示大图
			if(this.nums==1 || !!this.large){
				this.clsName = 'content ' + scls + ' video-large clearfix';
			} else if(this.nums==2 && !this.large){
				this.clsName = 'content ' + scls + ' two-person clearfix';
			} else if(this.nums==3 && !this.large){
				this.clsName = 'content ' + scls + ' three-person clearfix';
			} else if(this.nums==4 && !this.large){
				this.clsName = 'content ' + scls + ' four-person clearfix';
			} else if(this.nums==5 && !this.large){
				this.clsName = 'content ' + scls + ' five-person clearfix';
			} else if(this.nums==6 && !this.six){
				this.clsName = 'content ' + scls + ' six-person clearfix';
			}

			this.$el.attr('class', this.clsName);
		},
		_getClsName : function(){
			var cls = '';

			switch(this.nums){
				case 1:
					cls = '';
					break;
				case 2:
					cls = 'two-person';
					break;
				case 3:
					cls = 'three-person';		
					break;
				case 4:
					cls = 'four-person';
					break;
				case 5:
					cls = 'five-person';
					break;
				case 6:
					cls = 'six-person';
					break;
				default :
					cls = '';
			}

			return cls;

		},
		//获取所有的元素，供当切换到more-part状态使用
		_getAllItems : function(){
			var bigItems = this.$el.find('#participants').children().clone();//将大状态下的ITEM 移动到小的里面
			this.$el.find('#participants').html("");//清空
			this.$el.find('#smallvideo').append(bigItems);
			bigItems.find('.icons-narrow').removeClass('icons-narrow').addClass('icons-enlarge')
			this.$el.find('#smallvideo').show();
			this._layOut();
		},
		//当有新的流进来时
		_addNewUser : function(){
			this.nums++;
			//如果是在大屏幕下面
			if(this.large){
				this._getClsName();
			}
		},
		setNum : function(){
			this.nums++;
			this.nums++;
			this._addItem();
			this._layOut();

			$('body').trigger("VideoItemNumChange");
		},
		setStatus : function(){
			this.large = false;
			this.type = 'ppt';
			$('body').trigger("VideoStatusChange");
		},
		//当有新用户进来时
		addUser : function(stream){
			//如果是已经在房间的用户则直接替换src 否则新加入视频
			if($.inArray(stream.uid, this.uids) != -1){
				$("#"+stream.uid).find('img').replaceWith('<video src="'+stream.src+'"></video>');
			} else {
				this.uids.push(stream.uid);
				this.nums++;

				this._addItem(stream.uid);
				$("#"+stream.uid).find('img').replaceWith('<video src="'+stream.src+'"></video>');
				this._layOut();
			}	
			
		},
		//当有用户退出时 移除对应的元素
		removeUser : function(uid){
			$("#"+uid).remove();
			this.uids.remove(uid);
			this.nums--;
			this._layOut();
		}
	}

	$.fn.LY = function(option, str){
		return this.each(function () {
	      var $this = $(this)
	      var data  = $this.data('Layout');

	      if (!data) $this.data('Layout', (data = new Layout(this, option)));
	      if (typeof option == 'string') data[option](str);

	  	  return this;
	    });
		
	}
	

})(window.jQuery);