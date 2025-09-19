import React, { useState } from "react";
import AuthService from "../service/AuthService";
import "./LoginPage.css";

function LoginPage({ onLogin, darkMode, toggleDarkMode }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); 
  const [messageType, setMessageType] = useState(""); // ✅ success | warning | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      if (isLogin) {
        const result = await AuthService.login(email, password);
        if (result.success) {
          setMessage("✅ Login successful!");
          setMessageType("success");
          onLogin();
        } else {
          setMessage(result.message || "Login failed");
          setMessageType("error");
        }
      } else {
        const result = await AuthService.register({
          username,
          email,
          password,
          role,
        });

        if (result.success) {
          setMessage("✅ Registration successful! You can now log in.");
          setMessageType("success");
          setIsLogin(true);
          setUsername("");
          setEmail("");
          setPassword("");
          setRole("User");
        } else {
          // Detect if it's "already exists"
          if (
            result.message &&
            result.message.toLowerCase().includes("exists")
          ) {
            setMessage("⚠️ User already exists!");
            setMessageType("warning");
          } else {
            setMessage(result.message || "Registration failed");
            setMessageType("error");
          }
        }
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    }

    setLoading(false);
  };

  return (
    <div className={darkMode ? "login-page dark" : "login-page light"}>
      <div className="login-left">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>{isLogin ? "Login" : "Sign Up"}</h2>

          {/* Feedback message */}
          {message && <p className={`feedback ${messageType}`}>{message}</p>}

          {isLogin ? (
            <>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="User">User</option>
                <option value="Manager">Manager</option>
              </select>
            </>
          )}

          <button type="submit" disabled={loading}>
            {loading
              ? isLogin
                ? "Logging in..."
                : "Registering..."
              : isLogin
              ? "Login"
              : "Sign Up"}
          </button>

          <p>
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <span onClick={() => setIsLogin(false)}>Sign Up</span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span onClick={() => setIsLogin(true)}>Login</span>
              </>
            )}
          </p>

          <button
            type="button"
            className="toggle-darkmode-btn"
            onClick={toggleDarkMode}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </form>
      </div>

      <div className="login-right">{/* static content later */}</div>
    </div>
  );
}

export default LoginPage;
