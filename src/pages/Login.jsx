// Login.jsx
import React, { useState } from "react";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/omnivibe/auth/login", {
        username,
        email,
        password,
      });

      alert(res.data.message); // ✅ "Login successful"
      console.log("✅ Login response:", res.data);

      // Store user info in localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect after login
      window.location.href = "/";
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-sm p-6 bg-black border border-gray-700 rounded-xl">
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          OmniVibe Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            autoComplete="off"
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-white text-black font-semibold py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-400 text-sm">
          Don’t have an account?{" "}
          <a href="/register" className="text-white font-semibold hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
