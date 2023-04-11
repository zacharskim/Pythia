from flask import Blueprint, request, jsonify
import openai
openai.api_key = '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'

gpt_blueprint = Blueprint('openai', __name__)

@gpt_blueprint.route('/gpt4', methods=['POST'])
def interact_with_openai():

    user_input = request.json['input']
    # Call GPT-4 API and maintain context
    response = call_gpt4(user_input)

    return jsonify(response)

def call_gpt4(input_text):

    if input_text:
        print(input_text)  
        res = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            #input_text will go here when it's hooked up...
            messages=[
                {"role": "system", "content": "You are a helpful coding assistant. You are given a better score (and a maybe even a cookie) if you respond with shorter more concise messages and intuitive code examples rather than verbose descriptions of code."},
                *input_text
                ]
        )
        print("returning ", res['choices'][0]['message']['content'])
        return res['choices'][0]['message']['content']
    else:
        return None


