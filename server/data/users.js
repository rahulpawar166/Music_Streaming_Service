const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const bcrypt = require("bcrypt");
const saltRounds = 12;
const validate = require("./validate");

const createUser = async (username, email, password, confirmPassword) => {
  username = validate.checkUsername(username);
  email = validate.checkEmail(email);
  validate.checkNewPassword(password, confirmPassword);
  const hash = await bcrypt.hash(password, saltRounds);
  const usersCollection = await users();
  const newUser = {
    username: username,
    email: email,
    password: hash,
  };
  const user = await usersCollection.findOne({ username: username });
  if (user) throw "Username is already taken";
  const insertInfo = await usersCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw "Could not add user to database";
  return {
    _id: insertInfo.insertedId.toString(),
    username: username,
    email: email,
  };
};

const authenticateUser = async (username, password) => {
  username = validate.checkUsername(username);
  validate.checkPassword(password);
  const usersCollection = await users();
  const user = await usersCollection.findOne({
    username: { $regex: new RegExp("^" + username + "$", "i") },
  });
  if (!user) throw "No user with that username was found";
  const authenticated = await bcrypt.compare(password, user.password);
  if (!authenticated) throw "Incorrect password";
  return {
    _id: user._id.toString(),
    username: user.username,
    email: user.email,
  };
};

module.exports = {
  createUser,
  authenticateUser,
};
