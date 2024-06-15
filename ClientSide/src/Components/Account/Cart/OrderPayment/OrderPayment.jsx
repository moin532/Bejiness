import { useCallback, useEffect } from "react";
import useRazorpay from "react-razorpay";

export default function OrderPayments() {
    
  const [Razorpay, isLoaded] = useRazorpay();

  const handlePayment = useCallback(async () => {
    // const order = await createOrder(params);
    const order={id:1234}

    const options = {
      key: "YOUR_KEY_ID",
      amount: "3000",
      currency: "INR",
      name: "Acme Corp",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order.id,
      handler: (res) => {
        console.log(res);
      },
      prefill: {
        name: "Piyush Garg",
        email: "youremail@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzpay = new Razorpay(options);
    rzpay.open();
  }, [Razorpay]);

  useEffect(() => {
    if (isLoaded) {
      handlePayment();
    }
  }, [isLoaded, handlePayment])

  return (
    <div className="App">
      <button onClick={handlePayment}>Click</button>
    </div>
  );
}