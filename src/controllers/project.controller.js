const projectModel = require('../models/project.model');

module.exports.addProject = (req, res) => {
	const { freelancerId, title, basedOn, perHourRate, length, perWeekHourLimit, location, description } = req.body;

	const Project = new projectModel({
		user: req.userId,
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

module.exports.myPendingProposals = async (req, res) => {
	const pendingProopsals = await projectModel
		.find({ freelancer: req.userId, status: 'pending' })
		.populate('user', 'fullName')
		.exec();
	return res.status(200).send({
		error: false,
		message: 'Pending proposals',
		data: pendingProopsals
	});
};

module.exports.acceptProposal = (req, res) => {
	projectModel.findById(req.params.id, (err, projectFound) => {
		if (err) {
			return res.status(500).send({
				error: true,
				message: 'Error while finding proposal',
				data: err
			});
		}

		projectFound.status = 'accepted';
		projectFound.save();
		return res.status(200).send({
			error: false,
			message: 'Proposal accepted successfully'
		});
	});
};

module.exports.declineProposal = (req, res) => {
	projectModel.findById(req.params.id, (err, projectFound) => {
		if (err) {
			return res.status(500).send({
				error: true,
				message: 'Error while finding proposal',
				data: err
			});
		}

		projectFound.status = 'declined';
		projectFound.save();
		return res.status(200).send({
			error: false,
			message: 'Proposal declined successfully'
		});
	});
};


module.exports.getMyActiveProjects = async (req, res) => {
	const projects = await projectModel.find({user: req.userId}).populate('freelancer', 'fullName image').exec()
	return res.status(200).send({
		error: false,
		message: 'Active projects',
		data: projects
	})
}