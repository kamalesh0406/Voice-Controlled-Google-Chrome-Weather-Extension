from flask import Flask,request,render_template,redirect,url_for
import MySQLdb
from passlib.hash import sha256_crypt

import json
app = Flask(__name__)
from flask_cors import CORS

db = MySQLdb.connect("localhost","root","password","WEATHER")

curs = db.cursor()

CORS(app)
@app.route("/speech")
def speech():
	print('Here')
	return render_template('index.html')

@app.route("/signup",methods=['GET','POST'])
def signup():
	if request.method == 'POST':
		password = sha256_crypt.encrypt(request.form['password'])
		print('here')
		print(request.form)
		curs.execute("INSERT INTO USER(user_name,password) VALUES(%s,%s)",(request.form['username'],password,))
		db.commit()
			
		return json.dumps({"status":"ok"})
@app.route("/login",methods=['GET','POST'])
def login():
	if request.method == 'POST':
		curs.execute("SELECT * FROM USER WHERE user_name = %s",(request.form['username'],))
		data = curs.fetchall()
		print(data)
		check = sha256_crypt.verify(request.form['password'], data[0][1])
		if check == True:
		 	return json.dumps({'status':'ok'})
		else:
		 	print ('False')


if __name__ == '__main__':
	app.run(debug=True)
