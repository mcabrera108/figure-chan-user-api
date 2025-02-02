const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please add a valid username"],
    maxLength: 50,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please add a valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please add a valid password"],
    minLength: 6,
  },
});
UserSchema.virtual("url").get(function () {
  return `/user/${this.username}`;
});
module.exports = mongoose.model("User", UserSchema);
