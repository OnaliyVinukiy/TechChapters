import s1 from "../images/sample/9.jpg";
import s2 from "../images/sample/10.jpg";

import axios from "axios";
import { loadStripe } from "@stripe/stripe-js/pure";

const Payment = () => {
  const onClick = async () => {
    const stripe = await loadStripe(
      "pk_test_51Pp8JZDJE9QH0zh48YRGhD7dSKgpxuiH5DqwCxc0mBoQ6SCkd9DBG5HfAYUlOcIX6jWQ9aJsRMeSzNvAv6CiAyhr00q1tPlPID"
    );

    const headers = {
      "Content-Type": "application/json",
    };
  };

  return (
    <div className="mt-20 pt-10 flex flex-col items-center md:flex-row md:justify-center md:space-x-6 space-y-6 md:space-y-0">
      <div className=" max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl hover:scale-105 transition-transform">
        <a href="#">
          <img
            className="w-full h-40 object-cover rounded-t-lg"
            src={s1}
            alt="Online Payment"
          />
        </a>
        <div className="p-5 text-center">
          <a href="#">
            <h5 className="mb-4 text-2xl font-bold tracking-tight text-green-700 dark:text-white">
              Online Payment
            </h5>
          </a>
          <p className="mb-4 font-normal text-gray-700 dark:text-gray-400 text-sm text-left">
            Make your payments quickly and securely with our online platform.
            Enter your details, choose your payment method, and you're done in
            just a few steps. Your information is safe with us, thanks to our
            strong security measures. Get started today and enjoy a smooth
            payment experience.
          </p>
          <button
            onClick={onClick}
            className="flex w-full items-center justify-center px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-800  rounded-lg  focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Continue
          </button>
        </div>
      </div>
      <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl hover:scale-105 transition-transform">
        <a href="#">
          <img
            className="w-full h-40 object-cover rounded-t-lg"
            src={s2}
            alt="Bank Payment"
          />
        </a>
        <div className="p-5 text-center">
          <a href="#">
            <h5 className="mb-4 text-2xl font-bold tracking-tight text-green-700 dark:text-white">
              Bank Payment
            </h5>
          </a>
          <p className="mb-4 font-normal text-gray-700 dark:text-gray-400 text-sm text-left">
            Please upload your bank payment receipt to confirm your transaction.
            This helps us verify your payment quickly so you can continue
            without delays. Once we receive your receipt, we'll review it
            promptly and update your payment status. Thank you for your
            cooperation!
          </p>
          <a
            href="#"
            className="flex w-full items-center justify-center px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-800  rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Continue
          </a>
        </div>
      </div>
    </div>
  );
};

export default Payment;
