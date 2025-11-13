"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@utils/loginAPI";
import "@styles/login.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(username, password);

      if (res?.message === "Login successful") {
        router.push("/asset");
      } else {
        setError("Invalid login credentials.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modern-login-container">
      <div className="modern-login-card">
        <div className="login-header">
          <h1>Login</h1>
          <p>Enter your details</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Email address</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="modern-login-button"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {error && <p className="modern-error-message">{error}</p>}
      </div>
    </div>
  );
}