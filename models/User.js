const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
  {
    first: String,
    last: String,
    age: Number,
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'comments',
      },
    ],
  },
  {
    // Mongoose supports two Schema options to transform Objects after querying MongoDb: toJSON and toObject.
    // Here we are indicating that we want virtuals to be included with our response, overriding the default behavior
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Initialize our User model
const User = model('user', userSchema);

module.exports = User;


// const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   lastAccessed: { type: Date, default: Date.now },
// });

// const User = mongoose.model('User', UserSchema);

// const handleError = (err) => console.error(err);

// // Will add data only if collection is empty to prevent duplicates
// // Note that two documents can have the same name value
// User.find({}).exec((err, collection) => {
//   if (err) {
//     return handleError(err);
//   }
//   if (collection.length === 0) {
//     return User.insertMany(
//       [
//         { username: 'tester123' },
//         { username: 'johnstamos' },
//         { username: 'olsentwins99' },
//         { username: 'mynameaborat' },
//         { username: 'saulgoodman' },
//         { username: 'iamtesting' },
//         { username: 'lastbutnotleast321' },
//       ],
//       (insertError) =>
//         insertError ? handleError(insertError) : console.log('Inserted')
//     );
//   }
//   return console.log('Already populated');
// });

// module.exports = User;
