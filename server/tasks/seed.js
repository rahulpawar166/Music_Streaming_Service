const dbConnection = require("../config/mongoConnection");
const data = require("../data");
const users = data.users;
const posts = data.posts;

(async () => {
  const db = await dbConnection.dbConnection();
  await db.dropDatabase();

  const patrick = await users.addUser("Patrick", "Hill");
  const id = patrick._id.toString();
  await posts.addPost("Hello, class!", "Today we are creating a blog!", [], id);
  await posts.addPost(
    "Using the seed",
    "We use the seed to have some initial data so we can just focus on servers this week",
    [],
    id,
  );

  await posts.addPost(
    "Using routes",
    "The purpose of today is to simply look at some GET routes",
    [],
    id,
  );

  console.log("Done seeding database");

  await dbConnection.closeConnection();
})();
