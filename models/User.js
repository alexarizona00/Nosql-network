const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: [true, 'You need to have an email!'],
      unique: true,
      validate: {
        validator: function (v) {
          return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(v);

        },
        message: props => `${props.value} is not a valid email address!`
      },
    },
    Comment:[{
      type: Schema.Types.ObjectId,
      ref: 'Comment'
  }],
  friends: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
  }]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false,
  }
);

// Initialize our User model
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

const User = model('user', userSchema);

module.exports = User;
