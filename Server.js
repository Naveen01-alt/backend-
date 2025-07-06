const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors"); // ✅ FIXED: previously you assigned string instead of requiring the package
require("dotenv").config();

const app = express();

// ✅ Update allowed origins
const allowedOrigins = [
  "https://milkmart-app.vercel.app",  // ✅ Your actual deployed frontend
  "http://localhost:5173",            // For local Vite dev server
  "http://localhost:3000"             // In case you're using React default dev server
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

app.post("/send-order", async (req, res) => {
  const { name, phone, address, pincode, cart, totalAmount } = req.body;

  const orderDetails = cart.map(item =>
    `${item.name} (${item.quantity}L) - ₹${item.price * item.quantity}`
  ).join(", ");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"MilkMart Orders" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: "New MilkMart Order",
    text: `
📦 New Order:

👤 Name: ${name}
📞 Phone: ${phone}
🏠 Address: ${address}
📮 Pincode: ${pincode}
🛒 Items: ${orderDetails}
💰 Total: ₹${totalAmount}
    `.trim(),
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Order email sent successfully!" });
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    res.status(500).json({ error: "Email sending failed" });
  }
});

app.listen(5000, () => {
  console.log("✅ Server running at http://localhost:5000");
  console.log("CORS configured for:", allowedOrigins);
});
