const router = require('express').Router();
const {
  getAllComment,
  getCommentById,
  addComment,
  updateComment,
  removeComment,
  addReaction,
  removeReaction,
} = require('../../controllers/appController');

router.route('/').get(getAllComment).post(addComment);


router
  .route('/:id')
  .get(getCommentById)
  .put(updateComment)
  .delete(removeComment);

router.route('/:id/reaction').post(addReaction);

// /api/applications/:applicationId/tags/:tagId
router.route('/:id/reaction/:reactionId').delete(removeReaction);

module.exports = router;
