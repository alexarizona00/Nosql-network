const {
  Comment,
  User
} = require('../models');
const CommentController = {

  //get all Comment
  getAllComment(req, res) {
    Comment.find({})
      .then(dbCommentData => res.json(dbCommentData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  //get one Comment by id
  getCommentById({
    params
  }, res) {
    Comment.findOne({
      _id: params.id
    })
      .select('-__v')
      .sort({
        _id: -1
      })
      .then(dbCommentData => {
        if (!dbCommentData) {
          res.status(404).json({
            message: 'No Comment found with id.'
          });
          return;
        }
        res.json(dbCommentData)
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  //create Comment
  addComment({
    body
  }, res) {
    Comment.create(body)
      .then((CommentData) => {
        return User.findOneAndUpdate(
          //create a Comment using current user
          {
            _id: body.userId
          }, {
          $addToSet: {
            Comment: CommentData._id
          }
        }, {
          new: true
        }
        );
      })
      .then(dbUsersData => {
        if (!dbUsersData) {
          res.status(404).json({
            message: 'No user found id.'
          });
          return;
        }
        res.json(dbUsersData)
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  //update Comment by id
  updateComment({
    params,
    body
  }, res) {
    Comment.findOneAndUpdate({
      _id: params.CommentId
    }, {
      $set: body
    }, {
      runValidators: true,
      new: true
    })
      .then(updateComment => {
        if (!updateComment) {
          return res.status(404).json({
            message: 'No Comment with this id!'
          });
        }
        return res.json({
          message: "Success"
        });
      })
      .catch(err => res.json(err));
  },

  //delete Comment
  removeComment({
    params
  }, res) {
    Comment.findOneAndDelete({
      _id: params.CommentId
    })
      .then(deletedComment => {
        if (!deletedComment) {
          return res.status(404).json({
            message: 'No Comment with this id!'
          });
        }
        return User.findOneAndUpdate({
          Comment: params.CommentId
        }, {
          $pull: {
            Comment: params.CommentId
          }
        }, {
          new: true
        });
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({
            message: 'No Comment found with this id!'
          });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  //create reactions
  addReaction({
    params,
    body
  }, res) {
    Comment.findOneAndUpdate({
      _id: params.CommentId
    }, {
      $push: {
        reactions: body
      }
    }, {
      new: true,
      runValidators: true
    })
      .then(updatedComment => {
        if (!updatedComment) {
          res.status(404).json({
            message: 'No reaction found with this id!'
          });
          return;
        }
        res.json(updatedComment);
      })
      .catch(err => res.json(err));
  },
  // Delete a reaction
  removeReaction({
    params
  }, res) {
    Comment.findOneAndUpdate({
      _id: params.CommentId
    },
      //allows to remove the reaction by id
      {
        $pull: {
          reactions: {
            reactionId: params.reactionId
          }
        }
      }, {
      new: true
    }
    )
      .then((Comment) => {
        if (!Comment) {
          res.status(404).json({
            message: 'No reaction found with this id.'
          });
          return;
        }
        res.json(Comment)
      })
      .catch(err => res.json(err));
  },
}

module.exports = CommentController;