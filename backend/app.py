from flask import *
import os


env = os.getenv("APP_ENVIRONMENT", "Development")

app = Flask(__name__, static_folder='../dist', static_url_path="") # after building, frontend is stored in dist folder

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
def serve():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def serve_react_app(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")

if __name__ == '__main__':
   app.run(host='0.0.0.0', port=5000)