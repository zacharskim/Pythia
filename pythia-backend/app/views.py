from flask import Blueprint
from ..index.py import socketio
from flask_socketio import emit
from flask import  request



app = Blueprint('main', __name__)

@app.route('/')
def index():
    return 'Hello, yeet!'

# @socketio.on("connect")
# def connected():
#     print("client has connected")
#     emit("connect",{"data":f"id: {request.sid} is connected"})

# @socketio.on('data')
# def handle_message(data):
#     """event listener when client types a message"""
#     print("data from the front end: ",str(data))
#     emit("data",{'data':data,'id':request.sid},broadcast=True)

# @socketio.on("disconnect")
# def disconnected():
#     """event listener when client disconnects to the server"""
#     print("user disconnected")
#     emit("disconnect",f"user {request.sid} disconnected",broadcast=True)



# @socketio.on('hello')
# def handle_hello(data):
#     print('Received hello message:', data)
#     socketio.emit('response', {'message': 'Hello back!'})