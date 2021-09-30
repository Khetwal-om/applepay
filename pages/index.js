import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  PaymentRequestButtonElement,
  Elements,
  useStripe
} from '@stripe/react-stripe-js';

const CheckoutForm = () => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Demo total',
          amount: 1099
        },
        requestPayerName: true,
        requestPayerEmail: true
      });
      console.log(pr);

      // Check the availability of the Payment Request API.
      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe]);

  if (paymentRequest) {
    return <PaymentRequestButtonElement onClick={()=>console.log('clicking')} options={{ paymentRequest }} />;
  }

  // Use a traditional checkout form.
  return 'Insert your form or button component here.';
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
