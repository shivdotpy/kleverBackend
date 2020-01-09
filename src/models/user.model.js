const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
	{
		fullName: String,
		image: String,
		email: String,
		password: String,
		companyName: String,
		mobileNumber: String,
		userType: { type: String, default: 'employer' }
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('user', userSchema);
