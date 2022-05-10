const mongoose = require('mongoose');

// Wrap Mongoose around local connection to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/nosqlnetwork', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set('debug', true);

// Export connection
module.exports = mongoose.connection;
