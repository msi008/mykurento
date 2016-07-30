/**
 * Created by fengge on 16/7/25.
 */
var logger = require('../../log').logger;
module.exports = function (io) {
    var rooms ={};
    var cacheIps={};
    var controller={};
    // socket
    io.sockets.on('connection', function(socket){
        socket.on('addroom',function(room,usertype,pageindex){
            console.log('add room   room = %s,usertype=%s',room);
            socket.room = room;
            socket.usertype = usertype;

            if('t' == usertype){//控制端加入房间
                var time = new Date().getTime();
                controller[room] = time;
                socket.join(room);
                socket.indenty = time;
                rooms[room] = pageindex;
                //socket.emit('joinroomsucc',pageindex);
                socket.broadcast.to(room).emit('resetpage',pageindex);
            }
            if('s'== usertype){// 用户加入
                socket.join(room);
                var currentpage = rooms[room] == null?0:rooms[room];
                socket.emit('joinroomsucc',currentpage);
            }
        });

        socket.on("resetpage",function(page){
            rooms[socket.room] = page;
            socket.broadcast.to(socket.room).emit('resetpage',page);
        });

        socket.on("inviteUserJoined",function(data){

            socket.broadcast.to(socket.room).emit('inviteUserJoined',data);

        });

        socket.on("stopppt",function(){//停止播放

            socket.broadcast.to(socket.room).emit('stopppt');
        });

        socket.on("showqrcode",function(){
            socket.broadcast.to(socket.room).emit("showqrcode");
        });
        socket.on("hideqrcode",function(){
            socket.broadcast.to(socket.room).emit("hideqrcode");
        });


        socket.on('turnpage',function(){

            socket.broadcast.to(socket.room).emit('turnpage');
        });
        socket.on('cleancookie',function(room){
            if(socket.room != undefined && socket.room != null){
                socket.broadcast.to(socket.room).emit('cleancookie');

            }
        });
        socket.on('message', function(message){
            var obj = JSON.parse(message);
            console.log("^^^^^^^^^^^6  "+JSON.stringify(message));
            console.log("^^^^^  "+message+"  page ="+obj.page);
            var currentpage = obj.page;
            rooms[socket.room] = currentpage;
            socket.broadcast.to(socket.room).emit('message', obj.key,currentpage);
        });

        socket.on('updateLayout', function(type){
            console.log('*************+++++++++'+type);
            socket.broadcast.emit('updateLayout', type);
        });



        /*
         socket.on('key down', function(data){
         socket.broadcast.to(socket.room).emit('key down', data);
         });

         socket.on('key up', function(data){
         socket.broadcast.to(socket.room).emit('key up', data);
         });

         socket.on('flowtime minimap complete', function(data){
         socket.broadcast.to(socket.room).emit('flowtime minimap complete', data);
         });

         socket.on('navigate', function(data){
         socket.broadcast.to(socket.room).emit('navigate', data);
         });
         */

        socket.on('disconnect', function(reason){
            var cacheips =cacheIps[socket.room];
            if('qrctrlconfirm' == socket.usertype){
                console.log("disconnect ***  qrctrlconfirm &&& "+JSON.stringify(cacheips));
                //	socket.broadcast.to(socket.room).emit('controllerdisconnect');
                if(cacheips != null && cacheips[0] == socket.handshake.address.address){
                    if(cacheips.length >1  ){
                        cacheIps[socket.room].pop();
                    }else{
                        cacheIps[socket.room] = null;
                        socket.broadcast.to(socket.room).emit('cleancookie');
                    }
                }
            }
            if('controller' == socket.usertype){//控制端断开
                console.log("控制端 断开连接 *** "+(socket.indenty == controller[socket.room]));
                if(cacheips != null ){
                    cacheIps[socket.room] = null;
                    socket.broadcast.to(socket.room).emit('cleancookie');
                }
                if(socket.indenty == controller[socket.room]){
//				socket.broadcast.to(socket.room).emit('stopppt');
                }
            }

            if('user' == socket.usertype){
                if(socket.suffixid != undefined || socket.suffixid != null){
                    db.updatelevetime(socket.suffixid,new Date());
                }
            }

            socket.leave(socket.room);
            console.log(" status "+socket.usertype +"  "+reason+"************************ Connection " + socket.id + " terminated.");
        });
    });

};

