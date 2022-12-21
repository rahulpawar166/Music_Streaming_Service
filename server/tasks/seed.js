const dbConnection = require("../config/mongoConnection");
const data = require("../data");
// const users = data.users;
const playlists = data.playlists;


(async () => {
  const db = await dbConnection.dbConnection();
  await db.dropDatabase();

  console.log ("---------------------PLAYLISTS-----------------")
  console.log("CREATE - PLAYLISTS");
  const createproperty1 = await playlists.createPlaylist(ownerId.toString(), "testing", true, ["1DzJbVkBELu6jDu6q0T0tk"]);
  console.log(createproperty1);

  console.log("CREATE - PLAYLISTS");
  const createproperty2 = await playlists.createPlaylist(ownerId.toString(), "testing2", true, ["1DzJbVkBELu6jDu6q0T0tk"]);
  console.log(createproperty2);

  console.log("CREATE - PLAYLISTS");
  const createproperty3 = await playlists.createPlaylist(ownerId.toString(), "testing3", false, ["1DzJbVkBELu6jDu6q0T0tk"]);
  console.log(createproperty3);

  console.log("GET - PLAYLISTS");
  const property4 = await playlists.getPlaylist(ownerId.toString(), createproperty1._id.toString());
  console.log(property4);
  console.log("GET - PLAYLISTS");
  const property5 = await playlists.getPlaylist(ownerId.toString(), createproperty2._id.toString());
  console.log(property5);

  console.log("Delete - PLAYLISTS");
  const property6 = await playlists.deletePlaylist(ownerId.toString(), createproperty1._id.toString());
  console.log(property6);

  console.log("Add Track - PLAYLISTS");
  const property7 = await playlists.addTrack(ownerId.toString(), createproperty1._id.toString());
  console.log(property7);

  console.log("Done seeding database");

  await dbConnection.closeConnection();
})();
