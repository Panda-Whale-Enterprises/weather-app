const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = async () => await MongoMemoryServer.create();

// Opens database for testing
const connect = async () => {

  const uri = await mongod.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'weatherApp'
  })
    .then(() => console.log('Connected to Mongo DB.'))
    .catch(err => console.log(err));
}

const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
}

const clearDatabase = async () => {
  // Stores collections to variable
  const collections = mongoose.connection.collections;
  // Deletes values in collections
  for (const key in collections) {
    await collections[key].deleteMany();
  }
}

module.exports = { connect, closeDatabase, clearDatabase }