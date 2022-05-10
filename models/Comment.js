const { Schema, model, Types } = require('mongoose');
const reactionSchema = require('./reaction')

const commentSchema = new Schema(
  {
    commentText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 300
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username:{
      type: String,
      required: true
    },
    reactions: [reactionSchema]
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

commentSchema.virtual('reactioncount').get(function() {
  return this.reactions.length;
});

const Comment = model('Comment', commentSchema);

module.exports = Comment;
