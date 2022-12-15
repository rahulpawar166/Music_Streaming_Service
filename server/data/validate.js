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
  checkUsername: (u) => {
    if (!u) throw `Error: You must supply a username!`;
    if (typeof u !== "string") throw `Error: username must be a string!`;
    u = u.trim();
    if (u.length === 0) throw `Error: username cannot contain only spaces!`;
    if (!isNaN(u)) throw `Error: username cannot contain only digits`;
    return u;
  },
  checkEmail: (e) => {
    if (!e) throw `Error: you must provide an email!`;
    if (typeof e !== "string") throw `Error: email must be a string!`;
    e = e.trim();
    if (e.length === 0) throw `Error: email cannot contain only spaces!`;
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailRegex.test(e)) throw `Error: email address is invalid!`;
    return e;
  },
  checkPassword: (p) => {
    if (!p) throw `Error: You must supply a password!`;
    if (typeof p !== "string") throw `Error: password must be a string!`;
    if (p.trim().length === 0) throw `Error: password cannot be empty!`;
    return;
  },
  checkNewPassword: (p, c) => {
    if (p !== c) throw `Error: password and confirmation did not match!`;
    if (!p) throw `Error: You must supply a password!`;
    if (typeof p !== "string") throw `Error: password must be a string!`;
    if (p.length > 32 || p.length < 8)
      throw `Error: password must be between 8 and 32 characters long!`;
    if (p.includes(" ")) throw `Error: password cannot contain any spaces!`;
    return;
  },
};
