import asyncHandler from "../middleware/asyncHandler.js";
import Favourite from "../models/favouriteModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { calcPrices } from "../utils/calcPrices.js";
import { verifyPayPalPayment, checkIfNewTransaction } from "../utils/paypal.js";

// @desc Create new order
// @route POST /api/favourite
// @access Private
const addFavourite = asyncHandler(async (req, res) => {
  const { _id, name, image, price } = req.body;
  const currentUser = req.user._id;

  const existingFavourite = await Favourite.findOne({ user: currentUser });

  if (existingFavourite) {
    existingFavourite.favouriteItems.push({ _id, name, image, price });
    const updatedFavourite = await existingFavourite.save();
    res.status(201).json(updatedFavourite);
  } else {
    const favourite = new Favourite({
      user: currentUser,
      favouriteItems: [{ _id, name, image, price }],
    });
    const createdFavourite = await favourite.save();
    res.status(201).json(createdFavourite);
  }
});

// @desc Delete a favourite
// @route DELETE /api/favourite/mine
// @access Private
const deleteFavourite = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const currentUser = req.user._id;

  try {
    const existingFavourite = await Favourite.findOne({ user: currentUser });

    if (!existingFavourite) {
      return res.status(404).json({ message: "Favourite not found" });
    }

    existingFavourite.favouriteItems = existingFavourite.favouriteItems.filter(
      (product) => product._id.toString() !== productId
    );
    await existingFavourite.save();
    res.status(201).json(existingFavourite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// const { orderItems, shippingAddress, paymentMethod } = req.body;
// if (orderItems && orderItems.length === 0) {
//   res.status(400);
//   throw new Error("No order items");
// } else {
//   // get the ordered items from our database
//   const itemsFromDB = await Product.find({
//     _id: { $in: orderItems.map((x) => x._id) },
//   });
//   // map over the order items and use the price from our items from database
//   const dbOrderItems = orderItems.map((itemFromClient) => {
//     const matchingItemFromDB = itemsFromDB.find(
//       (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
//     );
//     return {
//       ...itemFromClient,
//       product: itemFromClient._id,
//       price: matchingItemFromDB.price,
//       _id: undefined,
//     };
//   });
//   // calculate prices
//   const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
//     calcPrices(dbOrderItems);
//   const order = new Order({
//     orderItems: dbOrderItems,
//     user: req.user._id,
//     shippingAddress,
//     paymentMethod,
//     itemsPrice,
//     taxPrice,
//     shippingPrice,
//     totalPrice,
//   });
//   const createdOrder = await order.save();
//   res.status(201).json(createdOrder);
// }

// @desc Create logged in user orders
// @route GET /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

// @desc Get order by ID
// @route GET /api/orders/:id
// @access Private/Admin
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc Update order to paid
// @route PUT /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const { verified, value } = await verifyPayPalPayment(req.body.id);
  if (!verified) throw new Error("Payment not verified");

  // check if this transaction has been used before
  const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
  if (!isNewTransaction) throw new Error("Transaction has been used before");

  const order = await Order.findById(req.params.id);

  if (order) {
    // check the correct amount was paid
    const paidCorrectAmount = order.totalPrice.toString() === value;
    if (!paidCorrectAmount) throw new Error("Incorrect amount paid");

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc Update order to delivered
// @route PUT /api/orders/:id/deliver
// @access Private
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    res.json(404);
    throw new Error("Order not found");
  }
});

// @desc Get all orders
// @route GET /api/orders
// @access Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.status(200).json(orders);
});

export {
  addFavourite,
  deleteFavourite,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
