import express from "express";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import dotenv from "dotenv"; // Ensure installed: npm install node-fetch

dotenv.config();
const router = express.Router();

function generateEsewaSignature(secretKey, signatureString) {
  return crypto.createHmac("sha256", secretKey).update(signatureString).digest("base64");
}

router.post("/initiate-payment", async (req, res) => {
  try {
    console.log("Payment initiation:", req.body);
    const { amount, productName, transactionId, method } = req.body;

    if (!amount || !productName || !transactionId || !method) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ eSewa Flow
    if (method === "esewa") {
      const txnUUID = `${Date.now()}-${uuidv4()}`;

      const escConfig = {
        amount: Number(amount).toFixed(0),
        tax_amount: "0",
        total_amount: Number(amount).toFixed(0),
        transaction_uuid: txnUUID,
        product_code: process.env.ESEWA_MERCHANT_CODE,
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: process.env.ESEWA_SUCCESS_URL,
        failure_url: process.env.ESEWA_FAILURE_URL,
        signed_field_names: "amount,total_amount,transaction_uuid,product_code",
      };

      const signatureString = `amount=${escConfig.amount},total_amount=${escConfig.total_amount},transaction_uuid=${escConfig.transaction_uuid},product_code=${escConfig.product_code}`;
      const signature = generateEsewaSignature(process.env.ESEWA_SECRET_KEY, signatureString);

      return res.json({
        payload: {
          ...escConfig,
          signature,
        },
      });
    }

    // ✅ Khalti Flow
    else if (method === "khalti") {
     const khaltiConfig = {
    return_url: `${process.env.BASE_URL}/success?method=khalti`,
    website_url: process.env.BASE_URL,
    amount: Math.round(parseFloat(amount) * 100), // amount in paisa
    purchase_order_id: transactionId,
    purchase_order_name: productName,
    customer_info
      : {
          // Test user info required by Khalti sandbox
          name: "Test User",
          email: "test@example.com",
          phone: "9800000000",
        },
  };
      const response = await fetch("https://a.khalti.com/api/v2/epayment/initiate/", {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(khaltiConfig),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Khalti API Error:", errorData);
        return res.status(500).json({ error: "Khalti API failed", details: errorData });
      }

      const khaltiRes = await response.json();
      return res.json({ khaltiPaymentUrl: khaltiRes.payment_url });
    }

    // ❌ Invalid Method
    else {
      return res.status(400).json({ error: "Invalid payment method" });
    }
  } catch (error) {
    console.error("Error during payment initiation:", error);
    return res.status(500).json({ error: "Something went wrong during payment" });
  }
});

// eSewa / Khalti Redirects
router.get("/payment/success", (req, res) => {
  console.log("Success:", req.query);
  res.redirect(`${process.env.BASE_URL}/success`);
});

router.get("/payment/failure", (req, res) => {
  console.log("Failure");
  res.redirect(`${process.env.BASE_URL}/failure`);
});

export default router;
