const { ObjectId } = require("mongodb");

module.exports = {
  checkId: (id) => {
    if (!id) throw "Error: You must provide an id!";
    if (typeof id !== "string") throw "Error: id must be a string!";
    id = id.trim();
    if (id.length === 0)
      throw "Error: id cannot be an empty string or just spaces!";
    if (!ObjectId.isValid(id)) throw "Error: invalid object ID!";
    return id;
  },
  checkString: (s, name) => {
    if (!s) throw `Error: You must supply a ${name}!`;
    if (typeof s !== "string") throw `Error: ${name} must be a string!`;
    s = s.trim();
    if (s.length === 0)
      throw `Error: ${name} cannot be an empty string or string with just spaces!`;
    if (!isNaN(s))
      throw `Error: ${s} is not a valid value for ${name} as it only contains digits!`;
    return s;
  },
  checkFirebaseUid: (uid) => {
    return true;
  },
};
