from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO

socketio = SocketIO()

def create_app():
    app = Flask(__name__)
    CORS(app, origins=['vscode-webview://*'])

    from app.audio.views import audio_blueprint
    from app.gpt4.views import gpt_blueprint

    
    socketio.init_app(app)
    app.register_blueprint(audio_blueprint, url_prefix='/audio')
    app.register_blueprint(gpt_blueprint, url_prefix='/msgs')


    return app



