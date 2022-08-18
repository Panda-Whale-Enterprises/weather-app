const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod; 

// Opens database for testing
const connect = async () => {

  mongod = await MongoMemoryServer.create();

  const uri = mongod.getUri();
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
  mongod.stop();
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