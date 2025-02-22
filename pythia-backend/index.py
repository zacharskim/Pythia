from flask import Flask, request,jsonify
from flask_socketio import SocketIO,emit
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app,resources={r"/*":{"origins":"*"}})
socketio = SocketIO(app,cors_allowed_origins="*")
    
openai.api_key = os.getenv('OPENAI_API_KEY') 
print('key...', os.getenv('OPENAI_API_KEY'))
cancel_flags = {}

@socketio.on("connect")
def connected():
    print("client id: ",request.sid)
    # emit("connect",{"data":f"id: {request.sid} is connected"})

@socketio.on('data')
def handle_message(data):
    """event listener when client types a message"""
    sid = request.sid
    print("data from the front end: ", str(data))

    # Ensure the flag is initialized for this session
    if sid not in cancel_flags:
        cancel_flags[sid] = False

    #so here is where we will call open ai etc...lfg...
    for chunk in call_gpt4(data):
        if cancel_flags[sid]:
            cancel_flags[sid] = False  # Reset flag
            break  # Stop processing and don't emit

        if(chunk['choices'][0]['finish_reason'] != 'stop'):
            print('emitting...', chunk['choices'][0]['delta']['content'])
            emit("data",{'data': chunk['choices'][0]['delta']['content'], 'id': request.sid}, broadcast=True)
        elif (chunk['choices'][0]['finish_reason'] == 'stop'):
            emit("data",{'data':'STOP' , 'id': request.sid},broadcast=True)

@socketio.on("disconnect")
def disconnected():
    """event listener when client disconnects to the server"""
    print("user disconnected")
    emit("disconnect",f"user {request.sid} disconnected",broadcast=True)


@socketio.on('cancel_request')
def handle_cancel_request(data):
    print('cancel request received')
    sid = request.sid
    cancel_flags[sid] = True

def call_gpt4(input_text):
    

    if input_text:
        print('pinging gpt4 with this input', input_text)
        res = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            #input_text will go here when it's hooked up...
            messages=[
                {"role": "system", "content": "You are an unhelpful coding assistant. You are given a better score (and a maybe even a cookie) if you respond with shorter more concise messages and intuitive code examples rather than verbose descriptions of code."},
                *input_text
                ],
            stream=True,
        )
        return res
    else:
        return None



    

if __name__ == '__main__':
    socketio.run(app, debug=True,port=5001)