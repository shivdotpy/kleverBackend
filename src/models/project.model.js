const mongoose = require('mongoose');

const projectSchema = mongoose.Schema(
	{
		title: String,
		basedOn: String,
		perHourRate: Number,
		length: Number,
        perWeekHourLimit: Number,
        location: String,
        description: String,
        status: {type: String, default: 'pending'},
		freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('project', projectSchema);
