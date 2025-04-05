from flask import *
import os


env = os.getenv("APP_ENVIRONMENT", "Development")

app = Flask(__name__, static_folder='../dist') # after building, frontend is stored in dist folder

if env == "Production":
    app.config["DEBUG"] = False
    app.config["DEVELOPMENT"] = False
    app.config["CSRF_ENABLED"] = True
    app.config["ASSETS_DEBUG"] = False
elif env == "Development":
    app.config["DEBUG"] = True
    app.config["DEVELOPMENT"] = True
    app.config["CSRF_ENABLED"] = True
    app.config["ASSETS_DEBUG"] = True
    app.config["TEMPLATES_AUTO_RELOAD"] = True

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

