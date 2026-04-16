//importer mongoose
const mongoose = require("mongoose");

//creer schema
const orderSchema = mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  phone: { type: String, required: true },

  shippingAddress1: { type: String, required: true },
  shippingAddress2: { type: String },
  city: { type: String, required: true },
  //Zone Improvement Plan code, code postal
  zip: { type: String, required: true },
  country: { type: String, required: true },

  dateOrdered: { type: Date, default: Date.now },
  //total Price is not required bcs we don't trust the frontend to send the correct total price, we will calculate it on the backend by multiplying the quantity of each order item by the price of the product and then summing them up to get the total price of the order.
  totalPrice: { type: Number },
  status: { type: String, default: "Pending" },
});

//virtual id to get the id from the database and convert it to string to be used in the frontend, because in the database the id is stored as an ObjectId and we need to convert it to a string to be used in the frontend.
orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// 7tina l'option virtuals bach n9dro nst3mlo l'id f JSON
orderSchema.set("toJSON", {
  virtuals: true,
});

//creer le model
exports.Order = mongoose.model("Order", orderSchema);
