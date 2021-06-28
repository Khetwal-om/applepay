import Stripe from 'stripe';
const stripe = new Stripe(
  'sk_test_51IIaCjCLRibWvXdYTlBTjxE2S5uKCLzsJl7Si4fK19KbQFCfllAb0HhslSbp3N9drq8VcwM2UGwWS7tLoquOOT1C00l9rBsjcC'
);

export default async (req, res) => {
  const { id, amount } = req.body;

  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: 'INR',
      description: 'Delicious empanadas',
      payment_method: id,
      confirm: true
    });

    console.log(payment);
    return res.status(200).json({
      confirm: 'abc123'
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message
    });
  }
};
