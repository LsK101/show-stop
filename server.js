require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const {router: usersRouter} = require('./users');
const {router: authRouter, basicStrategy, jwtStrategy} = require('./auth');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');

const app = express();

app.use(express.static('public'));

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
	if (req.method === 'OPTIONS') {
		return res.send(204);
	}
	next();
});

app.use(passport.initialize());
passport.use(basicStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

app.get('/api/protected', passport.authenticate('jwt', {session: false}),
	(req, res) => {
		return res.status(200).sendFile('./public/main.html', {root: __dirname});
	}
);

//404 ANY UNKNOWN REQUESTS
app.use('*', (req,res) => {
	return res.status(404).json({message:'Not Found'});
});



// START/STOP SERVER HANDLING
let server;

function runServer() {
	return new Promise((resolve, reject) => {
		mongoose.connect(DATABASE_URL, err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(PORT, () => {
				console.log(`Listening on port ${PORT}`);
				resolve();
			})
			.on('error', err => {
				mongoose.disconnect();
				reject(err);
			});
		});
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}


if (require.main === module) {
	runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};