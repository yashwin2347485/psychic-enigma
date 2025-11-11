"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [role, setRole] = useState<"student" | "admin">("student");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      role,
      id,
      password,
    });

    if (result?.error) {
      setError("❌ Invalid ID or Password");
    } else {
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/student");
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Placement Cell</h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Section - Description */}
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
              Student Placement Management System
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
              This project provides a centralized platform for managing student
              placement activities. Students can sign up, update their details,
              and apply for jobs, while admins can manage job postings,
              applications, and student records. The system ensures a smooth,
              transparent, and efficient placement process for both students and
              administrators.
            </p>
          </div>

          {/* Right Section - Login Card */}
          <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Welcome Back
            </h3>

            {/* Role Switch */}
            <div className="flex justify-center gap-2 mb-6 p-1 bg-gray-100 rounded-full">
              <button
                onClick={() => setRole("student")}
                className={`flex-1 px-4 py-2 rounded-full font-semibold ${
                  role === "student"
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Student
              </button>
              <button
                onClick={() => setRole("admin")}
                className={`flex-1 px-4 py-2 rounded-full font-semibold ${
                  role === "admin"
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                Admin
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="id"
                  className="block text-sm font-medium text-gray-700"
                >
                  {role === "admin" ? "Admin Username" : "Registration Number"}
                </label>
                <input
                  id="id"
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder={
                    role === "admin"
                      ? "Enter Admin Username"
                      : "Enter Registration No."
                  }
                  className="mt-1 w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="mt-1 w-full px-4 py-2 border rounded-md"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg"
              >
                Login as {role === "admin" ? "Admin" : "Student"}
              </button>
            </form>

            {/* Signup link only for students */}
            {role === "student" && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <a
                    href="/signup"
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Sign up
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
