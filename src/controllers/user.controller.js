const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const base64Img = require('base64-img');
const randomstring = require('randomstring');

module.exports.signup = (req, res) => {
	if (!req.body.fullName) {
		return res.status(403).send({
			error: true,
			message: 'Full name is required'
		});
	}

	if (!req.body.email) {
		return res.status(403).send({
			error: true,
			message: 'Email is required'
		});
	}

	if (!req.body.password) {
		return res.status(403).send({
			error: true,
			message: 'Password is required'
		});
	}

	if (!req.body.companyName) {
		return res.status(403).send({
			error: true,
			message: 'Company name is required'
		});
	}

	if (!req.body.phoneNumber) {
		return res.status(403).send({
			error: true,
			message: 'Phone number is required'
		});
	}

	userModel.findOne({ email: req.body.email }, (err, userFound) => {
		if (err) {
			return res.status(500).send({
				error: true,
				message: 'Error while finding user',
				data: err
			});
		} else if (userFound) {
			return res.status(403).send({
				error: true,
				message: 'User already exists'
			});
		} else {
			bcrypt.hash(req.body.password, 10, (err, hash) => {
				if (err) {
					return res.status(500).send({
						error: true,
						message: 'Error while generating hash',
						data: err
					});
				} else {
					const user = new userModel({
						fullName: req.body.fullName,
						email: req.body.email,
						password: hash,
						companyName: req.body.companyName,
						phoneNumber: req.body.phoneNumber,
						userType: req.body.userType ? req.body.userType : 'employer'
					});

					user.save((err, userSaved) => {
						if (err) {
							return res.status(500).send({
								error: true,
								message: 'Error while saving user',
								data: err
							});
						} else {
							return res.status(201).send({
								error: false,
								message: 'User created successfully, please check your email address'
							});
						}
					});
				}
			});
		}
	});
};

module.exports.signin = (req, res) => {
	if (!req.body.email) {
		return res.status(403).send({
			error: true,
			message: 'Email is required'
		});
	}

	if (!req.body.password) {
		return res.status(403).send({
			error: true,
			message: 'Password is required'
		});
	}

	userModel.findOne({ email: req.body.email }, (err, userFound) => {
		if (err) {
			return res.status(500).send({
				error: true,
				message: 'Error while finding user',
				data: err
			});
		} else if (!userFound) {
			return res.status(403).send({
				error: true,
				message: 'No user regstered with this email'
			});
		} else {
			// if (userFound.status !== 'active') {
			// 	return res.status(401).send({
			// 		error: true,
			// 		message: 'Please activate your account before login'
			// 	});
			// }

			bcrypt.compare(req.body.password, userFound.password, function(err, result) {
				if (err) {
					return res.status(500).send({
						error: true,
						message: 'Error while comparing password',
						data: err
					});
				} else if (!result) {
					return res.status(401).send({
						error: true,
						message: 'Unauthorised Access'
					});
				} else {
					// generate token
					var token = jwt.sign({ _id: userFound._id }, 'kleverSecret');
					return res.status(200).send({
						error: false,
						message: 'Logged in successfully.',
						data: {
							token: token,
							userType: userFound.userType,
							fullName: userFound.fullName
						}
					});
				}
			});
		}
	});
};

module.exports.updateUserImage = (req, res) => {
	if (!req.body.image) {
		return res.status(403).send({
			error: true,
			message: 'image is required'
		});
	}

	// random hash
	const randomString = randomstring.generate(10);

	// handle image
	let fileName = '';
	const filepath = base64Img.imgSync(req.body.image, 'public', randomString);
	if (filepath.includes('/')) {
		fileName = filepath.split('/')[1];
	} else {
		fileName = filepath.split('\\')[1];
	}

	userModel.findById(req.userId, (err, userFound) => {
		userFound.image = `http://${req.headers.host}/${fileName}`;
		userFound.save();
		return res.status(200).send({
			error: false,
			message: 'Image updated successfully'
		});
	});
};

module.exports.getUserImage = (req, res) => {
	userModel.findById(req.userId, (err, userFound) => {
		return res.status(200).send({
			error: false,
			message: 'User image',
			data: userFound.image
		})
	})
};

module.exports.updateFreelancerProfile = (req, res) => {
	const body = {
		fullName: req.body.fullName,
		skills: req.body.skills,
		title: req.body.title,
		shortDescription: req.body.shortDescription,
		description: req.body.description,
		availability: req.body.availability,
		rate: req.body.rate,

	}
	userModel.findByIdAndUpdate(req.userId, body, (err, userUpdated) => {
		if (err) {
			return res.status(500).send({
				error: true,
				message: 'Error while updating user',
				data: err
			})
		}
		return res.status(200).send({
			error: true,
			message: 'User updated successfully'
		})
	})
}
