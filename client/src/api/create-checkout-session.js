import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { products } = req.body;

      // Validate the request body
      if (!products || !Array.isArray(products) || products.length === 0) {
        console.error("Invalid products array:", products);
        return res.status(400).json({ error: "Invalid products array" });
      }

      // Log the received products for debugging
      console.log("Received products:", products);

      // Create a Stripe Checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: products.map((product) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
            },
            unit_amount: product.price, // Amount in cents
          },
          quantity: product.quantity,
        })),
        mode: "payment",
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cancel`,
      });

      console.log("Stripe session created:", session.id);

      // Send success response with session ID
      res.status(200).json({ id: session.id });
    } catch (err) {
      // Log detailed error information
      console.error("Error creating Stripe session:", err);

      // Send error response with detailed message
      res
        .status(500)
        .json({ error: `Failed to create session: ${err.message}` });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
