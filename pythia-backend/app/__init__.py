from flask import Flask
from flask_cors import CORS
from flask_sse import sse
from flask_session import Session
from flask_socketio import SocketIO
# from redis import Redis

# socketio = SocketIO()

def create_app():
    print('running...')
    app = Flask(__name__)
    # CORS(app, origins=['*'])
    CORS(app,resources={r"/*":{"origins":"*"}})
    socketio = SocketIO(app,cors_allowed_origins="*")

    # from app.audio.views import audio_blueprint
    # from app.gpt4.views import gpt_blueprint
    
    # app.config['REDIS_URL'] = 'redis://localhost:6379/0'  # Adjust the URL as needed
    # app.config['SESSION_TYPE'] = 'redis'
    # redis = Redis.from_url(app.config['REDIS_URL'])
    Session(app)

    
    socketio.init_app(app)

    # app.register_blueprint(audio_blueprint, url_prefix='/audio')
    # app.register_blueprint(gpt_blueprint, url_prefix='/msgs')


    return app, socketio





