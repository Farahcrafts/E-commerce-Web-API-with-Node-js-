//creer un miniserveur
const express = require("express");
const router = express.Router();

//importer les modeles necessaires
const { Order } = require("../models/order");
const { OrderItem } = require("../models/orderItem");

//get total sales of the orders
router.get("/get/totalsales", async (req, res) => {
  try {
    //get the total sales of the orders by using the aggregate function of mongoose to sum the totalPrice field of all the orders in the db
    const totalSales = await Order.aggregate([
      { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
    ]);

    if (!totalSales) {
      return res.status(400).send("The order sales cannot be generated");
    }

    //send the total sales to the admin
    res.send({ totalsales: totalSales.pop().totalsales });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

//get the number of orders in the db
router.get(`/get/count`, async (req, res) => {
  try {
    const orderCount = await Order.countDocuments();

    if (!orderCount) {
      return res.status(500).json({ success: false });
    }
    res.send({
      orderCount: orderCount,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

//get orders of a user by user id
router.get(`/get/userorders/:userid`, async (req, res) => {
  try {
    const userOrderList = await Order.find({ user: req.params.userid })
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: "category",
        },
      })
      .sort({ dateOrdered: -1 });

    if (!userOrderList) {
      return res.status(500).json({ success: false });
    }
    res.send(userOrderList);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

//get orders
router.get(`/`, async (req, res) => {
  try {
    //find all orders in the db,
    //  populate the user field with the name of the user,
    //  and sort the orders by dateOrdered in descending order

    const orderList = await Order.find()
      .populate("user", "name")
      .sort({ dateOrdered: -1 });

    //failed to get the orders from the db
    if (!orderList) {
      return res.status(500).json({ success: false });
    }
    //send the list of orders to the admin
    res.send(orderList);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

//get order by id
router.get(`/:id`, async (req, res) => {
  try {
    //find the order with the given id in the db,
    // populate the user field with the name of the user,
    // and populate the orderItems field with the product and category of each order item
    const order = await Order.findById(req.params.id)
      .populate("user", "name")
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
          populate: "category",
        },
      });

    //order with the given id not found in the db
    if (!order) {
      return res.status(500).json({ success: false });
    }

    //send the order to the admin
    res.send(order);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

//create a new order
router.post("/", async (req, res) => {
  try {
    //array of order items ids that will be created after creating the order items and adding their ids to this array
    const orderItemsIds = Promise.all(
      req.body.orderItems.map(async (orderItem) => {
        //create a new order item with the data sent by the client in the request body
        let newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });

        //save the new order item in the db and return its id
        newOrderItem = await newOrderItem.save();

        //return the id of the new order item to the promise all function
        return newOrderItem._id;
      }),
    );

    //resolve the order items ids that will be used to create the order
    const orderItemsIdsResolved = await orderItemsIds;

    const totalPrices = await Promise.all(
      //array of total prices for each order item that will be created after getting the price of each product and multiplying it by the quantity of the order item, and adding the total price of each order item to this array
      orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate(
          "product",
          "price",
        );
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
      }),
    );

    //get the total price of the order by adding the total price of each order item
    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

    //create a new order with the data sent by the client in the request body,
    // and the order items ids that were created before
    let order = new Order({
      orderItems: orderItemsIdsResolved,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totalPrice,
      user: req.body.user,
    });

    //save the new order in the db
    order = await order.save();

    //order cannot be created in the db
    if (!order) return res.status(400).send("the order cannot be created!");

    //send the order to the admin
    res.send(order);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

//update the status of an order
router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );

    if (!order) return res.status(400).send("the order cannot be update!");

    res.send(order);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

//delete an order by id
router.delete("/:id", (req, res) => {
  try {
    Order.findByIdAndRemove(req.params.id)
      .then(async (order) => {
        if (order) {
          await Promise.all(
            order.orderItems.map((orderItem) =>
              OrderItem.findByIdAndRemove(orderItem),
            ),
          );
          return res
            .status(200)
            .json({ success: true, message: "the order is deleted!" });
        } else {
          return res
            .status(404)
            .json({ success: false, message: "order not found!" });
        }
      })
      .catch((err) => {
        return res.status(500).json({ success: false, error: err });
      });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
