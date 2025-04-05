
# to start:

# npm run build
# flask run

from flask import *
import os
import mysql.connector
from flask_cors import CORS
# needed because front and back are on diff ports

env = os.getenv("APP_ENVIRONMENT", "Development")

app = Flask(__name__, static_folder='../dist', static_url_path="") # after building, frontend is stored in dist folder

CORS(app)

def get_db_connection():
    return mysql.connector.connect(
        host='dbhost.cs.man.ac.uk',
        user='n25451pc',
        password='MrjbTglmgaZr2FZdm/ygVEr3MgYKf+7YgakSvEJ5kUI',
        database='n25451pc',
        port=3306
    )


def execute_query(query, params=(), fetchone=False):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(query, params)
    
    result = cursor.fetchone() if fetchone else cursor.fetchall()
    connection.commit()
    cursor.close()
    connection.close()
    return result


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

@app.route("/", methods=["GET","POST"])
def serve():
    print("SERVE")
    
    if request.method == "GET":
        print("GET")
        return send_from_directory(app.static_folder, "index.html")
    else:
        print("POST")
        data = request.get_json()
        name = data.get("name")
        
        print(f"Received login from: {name}")
        
        user = execute_query("SELECT * FROM USERS WHERE full_name = %s", (name.lower(),), fetchone=True)
        
        if user:
            print("User already exists")
            # get agent_id, location, whatever
        else:
            print("New user")
            execute_query("INSERT INTO USERS (full_name) VALUES (%s)",(name.lower(),))
            # create new agent and store ID
        
        return jsonify({"message": f"{name} accessed the system"})

@app.route("/<path:path>")
def serve_react_app(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")

if __name__ == '__main__':
   app.run(host='0.0.0.0', port=5000)