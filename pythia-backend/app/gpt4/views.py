import json
from flask import Blueprint, request, jsonify, Response, session, redirect, url_for
from flask_session import Session
from flask_sse import sse
import openai
import os
import time
from redis import Redis

openai.api_key = os.environ.get('OPENAI_API_KEY') 

redis = Redis.from_url('redis://localhost:6379/0')

gpt_blueprint = Blueprint('openai', __name__)

@gpt_blueprint.route('/sendMessages', methods=['POST'])
def get_messages():
    redis.set('user_input', '')
    user_input = request.json['input']
    print(user_input, 'huh')
    user_input_serialized = json.dumps(user_input)
    print('current user_input', user_input)
    
    redis.set('user_input', user_input_serialized)
    return 'sheesh' 

@gpt_blueprint.route('/gpt4')
def interact_with_openai():
    user_input = redis.get('user_input').decode('utf-8')
    print(user_input, 'user_input what the hec')
    if user_input:
        user_input_deserialized = json.loads(user_input)
    else:
        default_input = 'data: This is event 0\n\n'
        return Response(default_input, mimetype='text/event-stream') 
    
    return Response(generate_sse_message(user_input_deserialized), mimetype='text/event-stream') 
    
    

def generate_sse_message(user_input):
    for chunk in call_gpt4(user_input):
        print('data: '+ chunk['choices'][0]['delta']['content'] + '\n\n')
        yield 'data: ' + chunk['choices'][0]['delta']['content'] + '\n\n'

@gpt_blueprint.route('/gpt4/sse')
def stream_sse():
    return Response(event_stream(), mimetype='text/event-stream')    


def event_stream():
    for i in range(10):
        yield f"data: This is event {i}\n\n"
    



def call_gpt4(input_text):

    if input_text:
        res = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            #input_text will go here when it's hooked up...
            messages=[
                {"role": "system", "content": "You are a helpful coding assistant. You are given a better score (and a maybe even a cookie) if you respond with shorter more concise messages and intuitive code examples rather than verbose descriptions of code."},
                *input_text
                ],
            stream=True,
        )
        return res
    else:
        return None


