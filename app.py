from flask import Flask, render_template, request
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app)

messages = []

@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        message = request.form['message']
        if message:
            if len(messages) >= 30:
                messages.pop(0)
            messages.append(message)
            socketio.emit('update_messages', messages, namespace='/')
    return render_template('index.html', messages=messages)

@socketio.on('message', namespace='/')
def handle_message(msg):
    if msg:
        if len(messages) >= 30:
            messages.pop(0)
        messages.append(msg)
        socketio.emit('update_messages', messages, namespace='/')

@socketio.on('connect', namespace='/')
def handle_connect():
    socketio.emit('initial_messages', messages, room=request.sid)

if __name__ == '__main__':

    
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)

