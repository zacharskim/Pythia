from flask import Flask, Blueprint
import speech_recognition as sr
import openai
import pvporcupine
import pyaudio
import numpy as np
from flask_socketio import emit
from . import socketio
from decouple import config

openai.api_key = config('OPENAI_API_KEY')



porcupine = pvporcupine.create(
  access_key=config('PORCUPINE_ACCESS_KEY'),
  keywords=['porcupine', 'bumblebee']

)



stream = None

def get_next_audio_frame():
    global stream

    audio_data = stream.read(porcupine.frame_length)
    return np.frombuffer(audio_data, dtype=np.int16)


@socketio.on("connect")
def connected():
    """event listener when client connects to the server"""
    emit('my response', {'data': 'Connected'})
    print('cpmmected?')


print("hello?")

@socketio.on('start_listening')
def start_listening():
    global stream

    print("in the start_listening fn")

    audio = pyaudio.PyAudio()
    stream = audio.open(
    rate=porcupine.sample_rate,
    channels=1,
    format=pyaudio.paInt16,
    input=True,
    frames_per_buffer=porcupine.frame_length,
    )



    try:
        while True:
            audio_frame = get_next_audio_frame()
            keyword_index = porcupine.process(audio_frame)

            if keyword_index == 0:
                print("Detected 'porkopine...'")
            elif keyword_index == 1:
                print("Detected 'bumblebee'")
                emit('message', {'text': 'Detected "bumblebee"'})
                break

    except KeyboardInterrupt:
        print("Stopped listening.")
    finally:
        stream.stop_stream()
        stream.close()
        audio.terminate()
        porcupine.delete()
