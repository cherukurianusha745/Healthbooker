import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = "http://localhost:5002/api";

const TestLogin = () => {
  const [email, setEmail] = useState("dr.smith@healthbooker.com");
  const [password, setPassword] = useState("doctor123");
  const [result, setResult] = useState(null);

  const handleLogin = async () => {
    try {
      setResult(null);
      const response = await axios.post("/users/login", { email, password });
      setResult({
        success: true,
        data: response.data,
        token: response.data.token
      });
      toast.success("Login successful!");
      
      // Save to localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
    } catch (error) {
      setResult({
        success: false,
        error: error.response?.data?.message || error.message
      });
      toast.error("Login failed");
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Test Doctor Login</h1>
      
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        
        <label style={{ display: "block", marginBottom: "5px" }}>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "20px" }}
        />
        
        <button 
          onClick={handleLogin}
          style={{
            padding: "10px 20px",
            background: "#4a6cf7",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Test Login
        </button>
      </div>

      {result && (
        <div style={{ 
          marginTop: "20px", 
          padding: "20px", 
          background: result.success ? "#d4edda" : "#f8d7da",
          borderRadius: "5px"
        }}>
          <h3>{result.success ? "✅ Success" : "❌ Failed"}</h3>
          <pre style={{ overflow: "auto" }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestLogin;