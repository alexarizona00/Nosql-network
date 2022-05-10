const { Comment, User, Types } = require('../models');


const CommentController = {
    getAllComments(req, res) {
        Comment.find({})
            .select("-__v")
            .sort({ _id: -1 })
            .then((dbCommentData) => res.json(dbCommentData))
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    getCommentById({ params }, res) {
        console.log("params sent", params)
        Comment.findOne({ _id: params.CommentId })
      .select("-__v")
      .then((dbCommentData) => {
        if (!dbCommentData) {
          res.status(404).json({ message: "No Comment found with this id!" });
          return;
        }
        res.json(dbCommentData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
    },
    // add Comment to User
    addComment({ params, body }, res) {
        console.log("INCOMING BODY", body)
        Comment.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $push: { Comments: _id } },
                    { new: true }
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No User found with this id! first error' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },
    // remove Comment
    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.CommentId })
            .then(deletedComment => {
                if (!deletedComment) {
                    return res.status(404).json({ message: 'No Comment with this id!' });
                }
                return User.findOneAndUpdate(
                    { _id: params.username },
                    { $pull: { Comments: params.CommentId } },
                    { new: true }
                );
            })
            .then(dbUserData => {
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },
    addReaction({ params, body }, res) {
        console.log("INCOMING BODY", body)
        Comment.findOneAndUpdate(
            { _id: params.CommentId },
            { $push: { reactions: body } },
            { new: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No User found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },
    // remove reaction
    removeReaction({ params }, res) {
        Comment.findOneAndUpdate(
            { _id: params.CommentId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err));
    }
};

module.exports = CommentController