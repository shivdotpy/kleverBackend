module.exports.signup = (req, res) => {
	if (!req.body.email) {
		return res.status(403).send({
			error: true,
			message: 'Email is required'
		});
	}

	if (
		!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
			req.body.email
		)
	) {
		return res.status(403).send({
			error: true,
			message: 'Email is invalid'
		});
	}

	if (!req.body.password) {
		return res.status(403).send({
			error: true,
			message: 'Password is required'
		});
	}

	if (!req.body.userType) {
		return res.status(403).send({
			error: true,
			message: 'User type is required'
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
						email: req.body.email,
						password: hash,
						userType: req.body.userType ? req.body.userType : 'jobSeeker'
					});

					user.save((err, userSaved) => {
						if (err) {
							return res.status(500).send({
								error: true,
								message: 'Error while saving user',
								data: err
							});
						} else {
							// Email registration
							const randomCode = Math.random().toString(36).substring(7);

							fs.readFile(
								path.join(__dirname, '..', 'mailer', 'samples', 'signup.html'),
								(err, signupHtml) => {
									mailer.Email(
										req.body.email,
										'Welcome to Ketoadle',
										signupHtml
											.toString()
											.replace('#activationCode', randomCode)
											.replace('#activationCodeText', randomCode)
											.replace('#userEmail', req.body.email)
									);
								}
							);

							// Date calculation
							let currentDate = new Date();
							currentDate.setDate(currentDate.getDate() + 1);

							userModel.findOneAndUpdate(
								{ email: req.body.email },
								{ activationCode: randomCode, activationCodeTime: currentDate },
								(err, userActivationCode) => {
									if (err) {
										console.log('Error while saving activation code user');
									}
								}
							);

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