import React, { useState } from 'react';
import axios from "axios";
import './App.css'
function Product() {  
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    description: '',
    mobile: '',
    email: '',
  });

  const amount = (formData.amount)*100;
  const currency = "INR";
  const receiptId = "qwsaq1";

  const paymentHandler = async (e) => {
    if((formData.description).length == 0){
      formData.description = " "
    }
    const response = await fetch("http://localhost:5000/order", {
      method: "POST",
      body: JSON.stringify({
        amount,
        currency,
        receipt: receiptId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const order = await response.json();
    console.log(order);

    var options = {
      key: "rzp_test_cfrRAsszZbkogm", // Enter the Key ID generated from the Dashboard
      amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency,
      name: "CORYD", //your business name
      description:formData.description,
      image: "https://example.com/your_logo",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response) {
        const body = {
          ...response,
        };

        const validateRes = await fetch(
          "http://localhost:5000/order/validate",
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const jsonRes = await validateRes.json();
        console.log(jsonRes);
        console.log(jsonRes.orderId)
        console.log(jsonRes.paymentId)
        const st = {
          Fname : formData.name,
          Famount : formData.amount,
          forderid : jsonRes.orderId,
          fpaymentid : jsonRes.paymentId,
          femail: formData.email,
          fphone : formData.mobile
        }
        axios.post('http://localhost:5000/Storedetails', st, {
                headers: {
                  'Content-Type': 'application/json',
                },
              })
              .then(res => { 
                // console.log(data);
                alert(res.data);
              })
              .catch(err => {
                console.log(err);
              });
      },
      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
        name: formData.name, //your customer's name
        email: formData.email,
        contact: formData.mobile, //Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    rzp1.open();
    e.preventDefault();
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className='IMGS'>
        <div className="product">
        <label htmlFor="name" className='requi'>Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className='inputall'
          required
        /><br /><br />

        <label htmlFor="amount" className='requi'>Amount:</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className='inputall'
          required
        /><br /><br />

        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className='inputall'
          
        /><br /><br />

        <label htmlFor="mobile" className='requi'>Mobile:</label>
        <input
          type="number"
          id="mobile"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          className='inputall'
          required
          pattern="[1-9]{1}[0-9]{9}"
        /><br /><br />

        <label htmlFor="email" className='requi'>Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className='inputall'
          required
        /><br /><br />
        <button onClick={paymentHandler}>Pay</button>
      </div>
    </div>
  );
}

export default Product;
