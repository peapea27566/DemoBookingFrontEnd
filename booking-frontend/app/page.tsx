"use client";
import React, { useState } from "react";
import AuthService from "./services/AuthService";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { useLoading } from "./context/LoadingContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, setLoading, setMessage } = useLoading();

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Checking information, please wait a moment...");
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const data = await AuthService.login(email, password);
      toast.success("Login successful!");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.setItem("authToken", data.token);
      window.location.href = "/calendar"
    } catch (error: any) {
      toast.error(error || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className=" w-full max-w-md p-8 bg-white shadow-md rounded-lg">
        <img
          src="/icon-calendar.png"
          alt="Booking Calendar"
          className="mx-auto mb-4 w-40 h-40"
        />
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Booking Calendar
        </h2>
        {successMessage && (
          <div className="mb-4 text-sm text-green-500">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="mb-4 text-sm text-red-500">{errorMessage}</div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-600"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-600"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="btn-blue w-full py-2"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            className="btn-outline-blue w-full py-2 mt-2"
            onClick={() => router.push("/register")}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
