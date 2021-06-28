import Stripe from 'stripe';
const stripe = new Stripe(
  'sk_test_51J7EbKKPb9py8ci93fVtAfqrIDMpz50CAzKiG1zQpMOi6XBvf7ONrvBUmnOifLyZXgjreqM3gUQBRSK6AmURSvwS00y7WbThYo'
);

export default async (req, res) => {
  const { id, amount } = req.body;

  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: 'USD',
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
