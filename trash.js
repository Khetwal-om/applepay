import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  PaymentRequestButtonElement,
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import axios from 'axios';

const CheckoutForm = () => {
  const [paymentRequest, setPaymentRequest] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  // apple
  useEffect(() => {
    if (!stripe) {
      return;
    }
    const pr = stripe.paymentRequest({
      currency: 'usd',
      country: 'US',
      requestPayerEmail: true,
      requestPayerName: true,
      total: {
        label: 'Demo',
        amount: 1999
      }
    });
    console.log(pr);
    pr.canMakePayment()
      .then((result) => {
        console.log(result);
        if (result) {
          console.log(pr);
          // display button
          setPaymentRequest(pr);
        }
      })
      .catch((err) => console.log(err));

    // pr.on('paymentmethod', async (e) => {
    //   // create payment intent on the server
    //   const { clientSecret } = await fetch('/charge', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       paymentMethodType: 'card',
    //       currency: 'usd'
    //     })
    //   }).then((r) => r.json());
    //   // confirm the payment intent on the client
    //   const { error, paymentIntent } = await stripe.confirmCardPayment(
    //     clientSecret,
    //     {
    //       payment_method: e.paymentMethod.id
    //     },
    //     {
    //       handleActions: false
    //     }
    //   );
    //   if (error) {
    //     e.complete('fail');
    //     return;
    //   }
    //   e.complete('success');
    //   if (paymentIntent.status == 'requires_action') {
    //     stripe.confirmCardPayment(clientSecret);
    //   }
    // });
  }, [stripe]);

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements.getElement(CardElement);

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement
    });

    if (error) {
      console.log('[error]', error);
    } else {
      const { id } = paymentMethod;

      try {
        const { data } = await axios.post('/api/charge', { id, amount: 1099 });
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <div style={{ border: '4px solid #2aabba', padding: '1rem 0' }}>
        {paymentRequest && (
          <PaymentRequestButtonElement options={paymentRequest} />
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: '400px', margin: '0 auto' }}
      >
        <CardElement />

        <button type='submit' disabled={!stripe}>
          Pay
        </button>
      </form>
    </div>
  );
};

const stripePromise = loadStripe(
  'pk_test_51J7EbKKPb9py8ci96XGzWrm0kFq3uacGobMuk9xY4TvT74jNyXXgThePKE7SLeQMhDc6CksyaMJOPX4Ie9JnjgLB00kYyNGrEZ',
  {
    stripeAccount: 'acct_1J7EbKKPb9py8ci9'
  }
);

const index = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default index;
