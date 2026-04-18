//importer mongoose
const mongoose = require("mongoose");

//creer schema
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true , unique: true },
  phone: { type: String, default: "" },
  passwordHash: { type: String, required: true },
  apartment: { type: String, default: "" },
  street: { type: String, default: "" },
  zip: { type: String, default: "" },
  city: { type: String, default: "" },
  country: { type: String, default: "" },
  isAdmin: { type: Boolean, default: false },
});

//virtual id to get the id from the database and convert it to string to be used in the frontend, because in the database the id is stored as an ObjectId and we need to convert it to a string to be used in the frontend.
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// 7tina l'option virtuals bach n9dro nst3mlo l'id f JSON
userSchema.set("toJSON", {
  virtuals: true,
});

//creer le modele
exports.User = mongoose.model("User", userSchema);
