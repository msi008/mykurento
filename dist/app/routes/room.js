/**
 * Created by fengge on 16/7/18.
 */
/**
 * Message handlers
 */
io.on('connection', function (socket) {
    var userList = '';
    for (var userId in userRegistry.usersById) {
        userList += ' ' + userId + ',';
    }
    console.log('receive new client : ' + socket.id + ' currently have : ' + userList);
    socket.emit('id', socket.id);

    socket.on('error', function (data) {
        console.log('Connection: ' + socket.id + ' error : ' + data);
        leaveRoom(socket.id, function () {

        });
    });

    socket.on('disconnect', function (data) {
        console.log('Connection: ' + socket.id + ' disconnect : ' + data);
        leaveRoom(socket.id, function () {
            var userSession = userRegistry.getById(socket.id);
            stop(userSession.id);
        });
    });

    socket.on('message', function (message) {
        console.log('Connection: ' + socket.id + ' receive message: ' + message.id);

        switch (message.id) {
            case 'register':
                console.log('registering ' + socket.id);
                register(socket, message.name, function(){

                });

                break;
            case 'joinRoom':
                console.log(socket.id + ' joinRoom : ' + message.roomName);
                joinRoom(socket, message.roomName, function () {

                });
                break;
            case 'receiveVideoFrom':
                console.log(socket.id + ' receiveVideoFrom : ' + message.sender);
                receiveVideoFrom(socket, message.sender, message.sdpOffer, function () {

                });
                break;
            case 'leaveRoom':
                console.log(socket.id + ' leaveRoom');
                leaveRoom(socket.id);
                break;
            case 'call':
                console.log("Calling");
                call(socket.id, message.to, message.from);
                break;
            case 'onIceCandidate':
                addIceCandidate(socket, message);
                break;
            default:
                socket.emit({id: 'error', message: 'Invalid message ' + message});
        }
    });
});