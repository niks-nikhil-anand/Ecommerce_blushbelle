"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ErrorPage = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("An unexpected error occurred. Please try again.");

  useEffect(() => {
    if (router.isReady && router.query && router.query.error) {
      // Only set the error message if the router is ready, and `error` exists in `query`
      setErrorMessage(router.query.error);
    }
  }, [router.isReady, router.query]); // Only watch `router.isReady` and `router.query`

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-red-600">Error</h1>
      <p className="mt-4 text-lg text-gray-700">
        {errorMessage}
      </p>
      <button
        className="mt-6 px-4 py-2 bg-green-500 text-white rounded-lg"
        onClick={() => router.push("/auth/signIn")}
      >
        Go Back to Sign In
      </button>
    </div>
  );
};

export default ErrorPage;
