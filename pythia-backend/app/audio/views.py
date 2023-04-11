from flask import Blueprint, request, jsonify
import speech_recognition as sr
import openai
import pvporcupine
import pyaudio
import numpy as np

openai.api_key = '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'


porcupine = pvporcupine.create(
  access_key='VLs93afkZvgYp7uabSMemYvcS+nwQGpzRh1qkyQsUdFijA0dQvPiiQ==',
  keywords=['porcupine', 'bumblebee']

)

audio_blueprint = Blueprint('audio', __name__)

stream = None


def get_next_audio_frame():
    global stream

    audio_data = stream.read(porcupine.frame_length)
    return np.frombuffer(audio_data, dtype=np.int16)

# def processAudio(audio_data):
#     print('working!')
 
@audio_blueprint.route('/start_listening', methods=['POST'])
def start_listening():
    global stream

    audio = pyaudio.PyAudio()
    stream = audio.open(
    rate=porcupine.sample_rate,
    channels=1,
    format=pyaudio.paInt16,
    input=True,
    frames_per_buffer=porcupine.frame_length,
    )

    print("listening...")

    try:
        while True:
            audio_frame = get_next_audio_frame()
            keyword_index = porcupine.process(audio_frame)

            if keyword_index == 0:
                print("Detected 'porkopine...'")
            elif keyword_index == 1:
                print("Detected 'bumblebee'")
                break

    except KeyboardInterrupt:
        print("Stopped listening.")
    finally:
        stream.stop_stream()
        stream.close()
        audio.terminate()
        porcupine.delete()
        return jsonify({"message": "Listening stopped"})


    # recognizer = sr.Recognizer()
    # with sr.Microphone() as source:
    #     while True:
    #         try:
    #             audio = recognizer.listen(source)
    #             text = recognizer.recognize_google(audio)
    #             if 'hey pythia' in text.lower() or 'pythia' in text.lower():
    #                 processAudio(audio)
    #         except sr.UnknownValueError:
    #             pass
    #         except sr.RequestError as e:
    #             return jsonify({"error": f"Could not request results; {e}"})
