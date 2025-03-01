"use client";
import { useLoading } from "../context/LoadingContext";

export default function Loading() {
  const { loading, message } = useLoading();

  return loading ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-md">
      <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-xl">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-700 text-lg font-medium">{message || "Loading, please wait..."}</p>
      </div>
    </div>
  ) : null;
}
