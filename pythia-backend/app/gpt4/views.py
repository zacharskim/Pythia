import json
from flask import Blueprint, request, jsonify, Response, session, redirect, url_for
from flask_session import Session
from flask_sse import sse
import openai
import os
import time
from flask_socketio import emit

# from redis import Redis


# redis = Redis.from_url('redis://localhost:6379/0')

gpt_blueprint = Blueprint('openai', __name__)

# @socketio.on("connect")
# def connected():
#     print('hello???')
#     print(request.sid)
#     print("client has connected")
#     emit("connect",{"data":f"id: {request.sid} is connected"})
    
    
# @gpt_blueprint.route('/sendMessages', methods=['POST'])
# def get_messages():
#     print('hello from sendMessages')
#     user_input = request.json['input']
#     user_input_serialized = json.dumps(user_input)
#     redis.set('user_input', user_input_serialized)
#     print('get_messages just set user_input', user_input)
#     return 'sheesh' 

# @gpt_blueprint.route('/gpt4')
# def interact_with_openai():
#     user_input = redis.get('user_input').decode('utf-8')
#     print('interact_with_openai func', user_input)
#     if user_input:
#         user_input_deserialized = json.loads(user_input)
#     else:
#         default_input = 'data: This is event 0\n\n'
#         return Response(default_input, mimetype='text/event-stream') 
    
#     return Response(generate_sse_message(user_input_deserialized), mimetype='text/event-stream') 
    
    

def generate_sse_message(user_input):
    for chunk in call_gpt4(user_input):
        # print(chunk, 'chunnk etc')
        if(chunk['choices'][0]['finish_reason'] != 'stop'):
            # print('data: '+ chunk['choices'][0]['delta']['content'] + '\n\n')
            yield 'data: ' + chunk['choices'][0]['delta']['content'] + '\n\n'

@gpt_blueprint.route('/gpt4/sse')
def stream_sse():
    return Response(event_stream(), mimetype='text/event-stream')    


def event_stream():
    for i in range(10):
        yield f"data: This is event {i}\n\n"
    



def call_gpt4(input_text):
    str_input = input_text
    print('within call_gpt4, this is the input_text', input_text)
    input_text1 = [{"role": "user", "content": str_input}]
    print(input_text1, 'what??')
    
    if input_text:
        print('pinging gpt4 with this input', input_text1)
        res = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            #input_text will go here when it's hooked up...
            messages=[
                {"role": "system", "content": "You are a helpful coding assistant. You are given a better score (and a maybe even a cookie) if you respond with shorter more concise messages and intuitive code examples rather than verbose descriptions of code."},
                *input_text1
                ],
            stream=True,
        )
        return res
    else:
        return None


