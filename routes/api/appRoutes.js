const router = require('express').Router();
const {
  getComments,
  getSinglecomment,
  createComment,
  updateComment,
  deleteComment,
  addReaction,
  removeReaction,
} = require('../../controllers/appController');

// /api/applications
router.route('/').get(getComments).post(createComment);

// /api/applications/:applicationId
router
  .route('/:applicationId')
  .get(getSinglecomment)
  .put(updateComment)
  .delete(deleteComment);

// /api/applications/:applicationId/tags
router.route('/:commentId/reaction').post(addReaction);

// /api/applications/:applicationId/tags/:tagId
router.route('/:commentId/reaction/:reactionId').delete(removeReaction);

module.exports = router;
