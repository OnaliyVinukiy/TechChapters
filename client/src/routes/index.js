const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const express = require("express");
const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  const { products } = req.body;

  if (!products || !Array.isArray(products) || products.length === 0) {
    return res
      .status(400)
      .json({ error: "Products array is missing or invalid" });
  }

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "USD",
      product_data: {
        name: product.name,
      },
      unit_amount: Math.round(product.price * 100), // Stripe expects amount in cents
    },
    quantity: product.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:5173/payment?success=true",
      cancel_url: "http://localhost:5173/payment?canceled=true",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: "Failed to create payment session" });
  }
});

module.exports = router;
