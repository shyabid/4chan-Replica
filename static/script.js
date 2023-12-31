document.addEventListener('DOMContentLoaded', function () {
    var socket = io.connect('http://' + document.domain + ':' + location.port);

    function updateMessages(data) {
        var messageList = document.getElementById('message-list');
        messageList.innerHTML = '';
        data.forEach(function (message) {
            var li = document.createElement('li');
            li.appendChild(document.createTextNode(message));
            messageList.appendChild(li);
        });
    }

    socket.on('initial_messages', function (data) {
        updateMessages(data);
    });

    socket.on('update_messages', function (data) {
        updateMessages(data);
    });

    var messageForm = document.getElementById('message-form');
    var messageInput = document.getElementById('message-input');

    messageForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var message = messageInput.value.trim();
        if (message !== '') {
            socket.emit('message', message);
            messageInput.value = '';
        }
    });

    // Detect "Enter" key on PC and prevent default behavior
    messageInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            messageForm.dispatchEvent(new Event('submit'));
        }
    });
});
