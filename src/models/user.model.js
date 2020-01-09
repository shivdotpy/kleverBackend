const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
	{
		fullName: String,
		image: String,
		email: String,
		title: String,
		shortDescription: String,
		description: String,
		availability: String,
		rate: String,
		skills: Array,
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
