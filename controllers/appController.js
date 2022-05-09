const { User, Comment, reaction } = require('../models');

module.exports = {
  // Function to get all of the commentss by invoking the find() method with no arguments.
  // Then we return the results as JSON, and catch any errors. Errors are sent as JSON with a message and a 500 status code
  getComments(req, res) {
    Comment.find()
      .then((comments) => res.json(comments))
      .catch((err) => res.status(500).json(err));
  },
  // Gets a single comments using the findOneAndUpdate method. We pass in the ID of the comments and then respond with it, or an error if not found
  getSinglecomments(req, res) {
    Comment.findOne({ _id: req.params.commentId })
      .then((comment) =>
        !comment
          ? res.status(404).json({ message: 'No comment with that ID' })
          : res.json(comment)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Creates a new comments. Accepts a request body with the entire comments object.
  // Because commentss are associated with Users, we then update the User who created the app and add the ID of the comments to the commentss array
  createcomments(req, res) {
    Comment.create(req.body)
      .then((comments) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { comments: comment._id } },
          { new: true }
        );
      })
      .then((user) =>
        !user
          ? res.status(404).json({
              message: 'comment created, but found no user with that ID',
            })
          : res.json('Created the comments 🎉')
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // Updates and comments using the findOneAndUpdate method. Uses the ID, and the $set operator in mongodb to inject the request body. Enforces validation.
  updateComment(req, res) {
    Comment.findOneAndUpdate(
      { _id: req.params.commentId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((comments) =>
        !comments
          ? res.status(404).json({ message: 'No comments with this id!' })
          : res.json(comments)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // Deletes a comment from the database. Looks for an app by ID.
  // Then if the app exists, we look for any users associated with the app based on he app ID and update the commentss array for the User.
  deleteComment(req, res) {
    Comment.findOneAndRemove({ _id: req.params.commentId })
      .then((comments) =>
        !comments
          ? res.status(404).json({ message: 'No comments with this id!' })
          : User.findOneAndUpdate(
              { comment: req.params.commentId },
              { $pull: { comment: req.params.commentId } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res.status(404).json({
              message: 'comments created but no user with this id!',
            })
          : res.json({ message: 'comments successfully deleted!' })
      )
      .catch((err) => res.status(500).json(err));
  },
  // Adds a tag to an comments. This method is unique in that we add the entire body of the tag rather than the ID with the mongodb $addToSet operator.
  addReaction(req, res) {
    Comment.findOneAndUpdate(
      { _id: req.params.commentId },
      { $addToSet: { tags: req.body } },
      { runValidators: true, new: true }
    )
      .then((comments) =>
        !comments
          ? res.status(404).json({ message: 'No comments with this id!' })
          : res.json(comments)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove comments tag. This method finds the comments based on ID. It then updates the tags array associated with the app in question by removing it's tagId from the tags array.
  removeReaction(req, res) {
    Comment.findOneAndUpdate(
      { _id: req.params.commentId },
      { $pull: { tags: { tagId: req.params.tagId } } },
      { runValidators: true, new: true }
    )
      .then((comments) =>
        !comments
          ? res.status(404).json({ message: 'No comments with this id!' })
          : res.json(comments)
      )
      .catch((err) => res.status(500).json(err));
  },
};
