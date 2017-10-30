const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const {Fave} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

//FETCHES FAVORITES LIST FROM DB, CREATES DB ENTRY IF NEW USER
router.post('/get', jsonParser, passport.authenticate('jwt', {session: false}),
	(req, res) => {
	let getRequestID = req.body.userID
	return Fave.find()
		.then(users => users.filter(obj => {
			return obj.userID === getRequestID;
		}))
		.then(user => {
			if (user.length === 0) {
				return Fave.create({
					userID: getRequestID
				});
			}
			else {
				return user[0];
			}
		})
		.then(user => {
			return res.json(user.apiRepr());
		})
		.catch(err => res.status(500).json({message: 'Internal server error'}));
});

//ADDS FAVORITE TO USER'S FAVORITES LIST
router.post('/add', jsonParser, passport.authenticate('jwt', {session: false}),
	(req, res) => {
	let addRequestID = req.body.userID;
	let favoriteArtist = req.body.favoriteArtist;
	return Fave.update(
		{userID: addRequestID},
		{
			$addToSet: {
				favorites: {
					$each: [favoriteArtist],
				}
			}
		})
		.then(() => {
				return Fave.update(
					{userID: addRequestID},
					{
						$push: {
							favorites: {
							$each: [],
							$sort: 1
							}
						}
					})
		})
		.then(() => {
			res.status(200).json({message: `${favoriteArtist} added to favorites!`})
		})
		.catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {router};