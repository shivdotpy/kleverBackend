const projectModel = require('../models/project.model');

module.exports.addProject = (req, res) => {
	const { freelancerId, title, basedOn, perHourRate, length, perWeekHourLimit, location, description } = req.body;

	const Project = new projectModel({
		freelancer: freelancerId,
		title,
		basedOn,
		perHourRate,
		length,
        perWeekHourLimit,
        location,
		description
	});

	Project.save((err, projectSaved) => {
		if (err) {
			return res.status(500).send({
				error: true,
				message: 'Error while saving project',
				data: err
			});
		}

		return res.status(200).send({
			error: false,
			message: 'Proposal send successfully'
		});
	});
};
