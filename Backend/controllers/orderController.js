import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import userOrders from '../models/userModel.js';


const esewa = new (process.env.Esewa_SCRIPT || 'https://uat.esewa.com.np/epay/main')('8gBm/:&EnhH.1/q');

// Generate payment token
const paymentToken = await esewa.initPayment({
  amount: 100, // payment amount
  productCode: 'your-product-code', // your product code
  returnUrl: 'https://your-system.com/payment-return', // return URL
});

// Redirect to E-sewa payment page
res.redirect(`https://uat.esewa.com.np/epay/main?token=${paymentToken}`);
// Handle payment response
app.get('/payment-return', async (req, res) => {
  const paymentStatus = await esewa.verifyPayment({
    token: req.query.token,
  });

  if (paymentStatus === 'success') {
    // Update database with payment status
    res.send('Payment successful!');
  } else {
    res.send('Payment failed!');



try {
  const response = await esewa.initPayment({
    // payment configuration
  });
  // handle response
} catch (error) {
  console.error(error);
  res.status(500).send({ message: 'Error initializing payment' });
}

const placeOrder = async (req, res) => {
     
    const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";

  try {
        const { items, amount, address, userId } = req.body;

        // Create a payment intent with esewa
        const esewa = require('esewa')(process.env.Esewa_SCRIPT_KEY);
        const paymentIntent = await esewa.paymentIntents.create({
            amount: amount * 100, 
            currency: 'npr', // Nepalese Rupee
            description: 'Order Payment',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        // Create new order
        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            payment: false,
            paymentIntentId: paymentIntent.id
        });

        await newOrder.save();

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            orderId: newOrder._id
        });

    } catch (error) {
        console.log('Error placing order:', error);
        res.json({ success: false, message: 'Failed to place order' });
    }
}

// Update payment status
const updatePayment = async (req, res) => {
    try {
        const { orderId, paymentStatus } = req.body;

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: 'Order not found' });
        }

        order.payment = paymentStatus === 'completed';
        order.paymentStatus = paymentStatus;
        await order.save();

        res.json({ success: true, message: 'Payment status updated successfully' });
    } catch (error) {
        console.log('Error updating payment status:', error);
        res.json({ success: false, message: 'Failed to update payment status' });
    }
}





    

//user orders for frontend

const userOrder = async (req, res) => {
    try{
const orders = await orderModel.find({ userId: req.body.userId });
res.json({success:true,data:orders });
    }
    catch (error) {
        console.log(error);
        res.json({ success:false, message: 'Internal server error' });
    }

}

//list all orders for admin panel
const listAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log('Error fetching orders:', error);
        res.json({ success: false, message: 'Failed to fetch orders' });
    }
}


//api for updating order status
const updateStatus = async (req, res) =>{
    try{
await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: 'Order status updated successfully' });
    }
    catch (error) {
        console.log('Error updating order status:', error);
        res.json({ success: false, message: 'Failed to update order' });
    }

}
export {placeOrder, verifyOrder, userOrders,listOrders, updatePayment, userOrder, listAllOrders, updateStatus};
// Function to verify order payment
