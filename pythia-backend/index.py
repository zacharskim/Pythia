from app import create_app, socketio

app = create_app()

@socketio.on('hello')
def handle_hello(data):
    print('Received hello message:', data)
    socketio.emit('response', {'message': 'Hello back!'})


if __name__ == '__main__':
    socketio.run(app, debug=True)