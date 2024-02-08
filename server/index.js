const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();
const mongoose = require('mongoose');
const Table = require('./model.js')

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

mongoose.connect('mongodb+srv://desamsettisankar143:Desamsetti1@cluster0.6efo2qj.mongodb.net/?retryWrites=true&w=majority', 
  { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
    });
    mongoose.connection.on('connected', () => {
      console.log('Connected to MongoDB');
  });


  app.post("/Storedetails", async (req, res) => {
    var data = req.body;
    
    try {
      const newData = new Table({
        Name: data.Fname,
        OrderId: data.forderid,
        PaymentId: data.fpaymentid,
        Email: data.femail,
        Amount: data.Famount,
        PhoneNumber:data.fphone,

      });
      await newData.save();
      res.send("ok");
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });

app.post("/order", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: "rzp_test_cfrRAsszZbkogm",
      key_secret: "YSAzVd9tZ5MiIc1Tiuj8OLw3",
    });

    const options = req.body;
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Error");
    }

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

app.post("/order/validate", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const sha = crypto.createHmac("sha256", "YSAzVd9tZ5MiIc1Tiuj8OLw3");
  //order_id + "|" + razorpay_payment_id
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");
  if (digest !== razorpay_signature) {
    return res.status(400).json({ msg: "Transaction is not legit!" });
  }

  res.json({
    msg: "success",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});