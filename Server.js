const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors"); // ✅ FIXED: previously you assigned string instead of requiring the package
require("dotenv").config();

const app = express();

// ✅ Update allowed origins
const allowedOrigins = [
  "https://milk-mart-5auf.vercel.app"  ,
  "https://naveen-sparkle-portfolio.vercel.app",
  "https://vinaybyagari-portfolio.vercel.app"
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


app.post("/send-message", async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // you receive it
    subject: "New Portfolio Contact Message",
    text: `
📩 New Message Received:

👤 Name: ${name}
📧 Email: ${email}
💬 Message: ${message}
    `.trim(),
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("❌ Failed to send message:", error);
    res.status(500).json({ error: "Message sending failed" });
  }
});

app.post("/send-message1", async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: "vinaybyagari07@gmail.com", // you receive it
    subject: "New Portfolio Contact Message",
    text: `
📩 New Message Received:

👤 Name: ${name}
📧 Email: ${email}
💬 Message: ${message}
    `.trim(),
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("❌ Failed to send message:", error);
    res.status(500).json({ error: "Message sending failed" });
  }
});



app.listen(5000, () => {
  console.log("✅ Server running at http://localhost:5000");
  console.log("CORS configured for:", allowedOrigins);
});
