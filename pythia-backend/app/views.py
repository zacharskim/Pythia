from flask import Blueprint
from . import socketio

app = Blueprint('main', __name__)

@app.route('/')
def index():
    return 'Hello, yeet!'



@socketio.on('hello')
def handle_hello(data):
    print('Received hello message:', data)
    socketio.emit('response', {'message': 'Hello back!'})