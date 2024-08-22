import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import React, { useState, useEffect } from "react";

const stripePromise = loadStripe(
  "pk_test_51Pp8JZDJE9QH0zh48YRGhD7dSKgpxuiH5DqwCxc0mBoQ6SCkd9DBG5HfAYUlOcIX6jWQ9aJsRMeSzNvAv6CiAyhr00q1tPlPID"
);

const firebaseConfig = {
  apiKey: "AIzaSyCzGZjohQaxi6N0e4nHQmxAgL40bxUto30",
  authDomain: "techchapters-a381e.firebaseapp.com",
  databaseURL: "https://techchapters-a381e-default-rtdb.firebaseio.com",
  projectId: "techchapters-a381e",
  storageBucket: "techchapters-a381e.appspot.com",
  messagingSenderId: "350355077376",
  appId: "1:350355077376:web:53059c1623aeeff2a65be5",
  measurementId: "G-ENHLKCGHGW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function Subscriptions() {
  const navigate = useNavigate();
  const database = getDatabase(app);
  const auth = getAuth(app); // Initialize Firebase Auth
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  const savePaymentDetails = async (plan) => {
    if (!user) {
      console.error("No user is logged in.");
      return;
    }

    const userName = user.displayName || "Anonymous";
    const userId = user.uid;
    const userEmail = user.email;
    const currentDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(currentDate.getMonth() + 1);
    const paymentId = uuidv4();

    const paymentDetails = {
      paymentDate: currentDate.toISOString().split("T")[0],
      expiryDate: expiryDate.toISOString().split("T")[0],
      userId: userId,
      userName: userName,
      email: userEmail,
      subscriptionType: plan,
      paymentId: paymentId,
    };

    try {
      await set(
        ref(database, `users/${userId}/payments/` + Date.now()),
        paymentDetails
      );
      console.log("Payment details saved successfully!");
    } catch (error) {
      console.error("Error saving payment details:", error);
    }

    navigate("/subscriptions");
    window.location.reload();
  };

  const handleSubscription = async (priceId, plan) => {
    const stripe = await stripePromise;

    try {
      const result = await stripe.redirectToCheckout({
        lineItems: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        successUrl: `${window.location.origin}/subscriptions?plan=${plan}`, // Update with your success page URL
        cancelUrl: `${window.location.origin}/subscriptions`, // Update with your cancel page URL
      });

      if (result.error) {
        console.error("Stripe Checkout error:", result.error.message);
      }
    } catch (error) {
      console.error("Error during Stripe Checkout:", error);
    }
  };

  const queryParams = new URLSearchParams(window.location.search);
  const plan = queryParams.get("plan");

  const handleSuccessfulPayment = () => {
    if (plan) {
      savePaymentDetails(plan);
    }
  };

  useEffect(() => {
    if (plan) {
      handleSuccessfulPayment();
    }
  }, [plan]);

  const proPlan = () => {
    const priceId = "price_1PpOeiDJE9QH0zh40SVnuXqU";
    handleSubscription(priceId, "pro");
  };

  const premiumPlan = () => {
    const priceId = "price_1PpOqVDJE9QH0zh4Wb9ki5mi";
    handleSubscription(priceId, "premium");
  };

  return (
    <div>
      <h2 className="mt-28 text-3xl text-center font-bold text-gray-900 dark:text-white">
        Subscription Plans
      </h2>

      <div className="flex flex-wrap justify-around mt-12">
        {/* Basic Plan */}
        <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
          <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
            Basic plan
          </h5>
          <div className="flex items-baseline text-gray-900 dark:text-white">
            <span className="text-5xl font-extrabold tracking-tight">Free</span>
          </div>
          <ul role="list" className="space-y-5 my-7">
            <li className="flex items-center">
              <svg
                className="flex-shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
                One event per month
              </span>
            </li>
            <li class="flex">
              <svg
                class="flex-shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
                Upto 5 event feedback
              </span>
            </li>

            <li class="flex line-through decoration-gray-500">
              <svg
                class="flex-shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span class="text-base font-normal leading-tight text-gray-500 ms-3">
                Participant registration for events
              </span>
            </li>
            <li class="flex line-through decoration-gray-500">
              <svg
                class="flex-shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span class="text-base font-normal leading-tight text-gray-500 ms-3">
                Volunteer registration for events
              </span>
            </li>
            <li class="flex line-through decoration-gray-500">
              <svg
                class="flex-shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span class="text-base font-normal leading-tight text-gray-500 ms-3">
                Email notifications
              </span>
            </li>
            <li class="flex line-through decoration-gray-500">
              <svg
                class="flex-shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span class="text-base font-normal leading-tight text-gray-500 ms-3">
                Goolge calendar notifications
              </span>
            </li>
          </ul>
          <button
            type="button"
            onClick={() => navigate("/Leaders")}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center"
          >
            Get Started
          </button>
        </div>

        {/* Pro Plan */}
        <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
          <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
            Pro plan
          </h5>
          <div className="flex items-baseline text-gray-900 dark:text-white">
            <span className="text-5xl font-extrabold tracking-tight">5$</span>
            <span className="text-base font-medium text-gray-500 dark:text-gray-400 ms-1">
              / month
            </span>
          </div>
          <ul role="list" className="space-y-5 my-7">
            <li className="flex items-center">
              <svg
                className="flex-shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
                5 events per month
              </span>
            </li>
            <li class="flex">
              <svg
                class="flex-shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
                Unlimited event feedback
              </span>
            </li>
            <li class="flex">
              <svg
                class="flex-shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
                Participant registration for events
              </span>
            </li>
            <li class="flex">
              <svg
                class="flex-shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
                Volunteer registration for events
              </span>
            </li>
            <li class="flex line-through decoration-gray-500">
              <svg
                class="flex-shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span class="text-base font-normal leading-tight text-gray-500 ms-3">
                Email notifications
              </span>
            </li>
            <li class="flex line-through decoration-gray-500">
              <svg
                class="flex-shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span class="text-base font-normal leading-tight text-gray-500 ms-3">
                Goolge calendar notifications
              </span>
            </li>
          </ul>
          <button
            type="button"
            onClick={proPlan}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center"
          >
            Get Started
          </button>
        </div>

        {/* Premium Plan */}
        <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
          <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
            Premium plan
          </h5>
          <div className="flex items-baseline text-gray-900 dark:text-white">
            <span className="text-5xl font-extrabold tracking-tight">10 $</span>
            <span className="text-base font-medium text-gray-500 dark:text-gray-400 ms-1">
              / month
            </span>
          </div>
          <ul role="list" className="space-y-5 my-7">
            <li className="flex items-center">
              <svg
                className="flex-shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
                Unlimited events
              </span>
            </li>
            <li class="flex">
              <svg
                class="flex-shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
                Unlimited event feedback
              </span>
            </li>
            <li class="flex">
              <svg
                class="flex-shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
                Participant registration for events
              </span>
            </li>
            <li class="flex">
              <svg
                class="flex-shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
                Volunteer registration for events
              </span>
            </li>
            <li class="flex">
              <svg
                class="flex-shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
                Email notifications
              </span>
            </li>
            <li class="flex">
              <svg
                class="flex-shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span class="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
                Goolge calendar notifications
              </span>
            </li>
          </ul>
          <button
            type="button"
            onClick={premiumPlan}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default Subscriptions;
