const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.post('/addProject', projectController.addProject);

router.get('/myPendingProposals', projectController.myPendingProposals);

router.get('/acceptProposal/:id', projectController.acceptProposal);

router.get('/declineProposal/:id', projectController.declineProposal);

router.get('/getMyActiveProjects', projectController.getMyActiveProjects);

module.exports = router;
