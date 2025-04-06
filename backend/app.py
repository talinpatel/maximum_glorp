
# to start:

# npm run build
# flask run

from flask import *
import os
import mysql.connector
from flask_cors import CORS
from agent import Assistant
import asyncio
import threading

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

@app.post("/submit_report")  # Simplified POST decorator
def submit_report():
    data = request.get_json()

    # id made when add to database
    reporter = data.get('reporter')
    reportee = data.get('reportee')
    date = data.get('date')
    description = data.get('description')

    try:
        execute_query(
            """
            INSERT INTO REPORTS (reporter, reportee, date, description)
            VALUES (%s, %s, %s, %s)
            """,
            (reporter, reportee, date, description)
        )
        return jsonify({"status": "success", "message": "Report submitted"})
    except Exception as e:
        print("Error saving report:", e)
        return jsonify({"status": "error", "message": str(e)}), 500
                        

# def catch_all(path):
#     return app.send_static_file('index.html')


@app.route("/Desktop")
def redirect_desktop():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/", methods=["GET","POST"])
def serve():
    print("SERVE")
    
    if request.method == "GET":
        print("GET")
        return send_from_directory(app.static_folder, "index.html")
    else:
        print("POST")
        data = request.get_json()
        global name
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

@app.route('/tts')
def start_tts():
    global thread
    ass = Assistant()
    thread = threading.Thread(target= lambda: asyncio.run(ass.main()))
    thread.start()
    # asyncio.run(ass.main())
    return redirect('/Desktop', 303)

# @app.route('/tts_end')
# def end_tts():
#     thread.join()
#     return redirect('/')


if __name__ == '__main__':
   app.run(host='0.0.0.0', port=5000)