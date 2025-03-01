"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthService from "../services/AuthService";
import { useLoading } from "../context/LoadingContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const {loading, setLoading, setMessage} = useLoading();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("Checking for membership. Please wait a moment...")
    setLoading(true);
  
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }
    try {
      const data = await AuthService.register(name, email, tel, password);
      toast.success(data.message);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
      <img
        src="/register.png" 
        alt="Register"
        className="mx-auto mb-4 w-40 h-40"
      />
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">Register</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-600"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">Email</label>
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
            <label className="block mb-2 text-sm font-medium text-gray-600">Phone</label>
            <input
              type="tel"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-600"
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-600"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-600"
              placeholder="Confirm your password"
              required
            />
          </div>
          <button
            type="submit"
            className="btn-blue w-full py-2"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>


          <button
            type="button"
            className="btn-outline-blue w-full py-2 mt-2"
            onClick={() => router.push("/")}
          >
            back to login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
