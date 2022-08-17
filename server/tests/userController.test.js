const db = require('./testDB');
const { User } = require('../model.js')
const { createUser } = require('../controllers/userController');

// Starting mongo server with desired schema layout in local memory


describe('User Controller', () => {
  // Opens database for testing
  beforeAll(async () => {
    await db.connect();
  })

  // Clears database after each test
  afterEach(async () => {
    await db.clearDatabase();
  });

  // Closes database after testing
  afterAll(async () => {
    await db.closeDatabase();
  })

  // Test for whether inserting user into database works
  it('createUser', async done => {
    // Create user in database
    const { username } = await createUser({username, password});

    // Find user from database
    const user = await User.find({username})

    // Testing whether user created in database
    expect(user.username).toEqual(username);
    done()
  })

})