var mongoose = require("mongoose");

// username sally123
// loginType.type faceId
// loginType.password 1234
var OAuthUserSchema = new mongoose.Schema({
  uuid: { type: String, index: true },
  userNames: [String],
  passwords: [String],
});

const OAuthUser = mongoose.model("OAuthUser", OAuthUserSchema);
module.exports = OAuthUser;