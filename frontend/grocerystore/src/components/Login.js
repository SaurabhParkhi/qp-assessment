import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getdecodedToken } from "../helper/jwt";

export const Login = (({setAuthToken})=>{
    const [formData, setFormData] = useState({
        email: "",
        password: "",
      });
    
      const [error, setError] = useState("");
      const [success, setSuccess] = useState("");

      const navigate = useNavigate();
    
      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
        setError("");
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.email || !formData.password) {
          setError("Please enter both email and password.");
          return;
        }
    
        const response = await fetch("http://localhost:5000/api/auth/login",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            email:formData.email,
            password:formData.password
          })
        });
        const resp = await response.json();
        
        if(response.status === 200){
          setSuccess(resp.message);
          localStorage.setItem("token",resp.accessToken);
          const decodedToken = getdecodedToken(resp.accessToken);
          setAuthToken(decodedToken);
          navigate('/store');
          return;
        }
        else{
          setError(resp.message);
          return;
        }
        
        // if (formData.email === "test@example.com" && formData.password === "password123") {
        //   setSuccess("Login successful!");
        //   setFormData({ email: "", password: "" });
        // } else {
        //   setError("Invalid credentials. Please try again.");
        // }
      };
    
      return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
          <div className="bg-white rounded shadow p-4 w-100" style={{ maxWidth: "400px" }}>
            <h2 className="text-center mb-4">User Login</h2>
    
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
    
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your password"
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>
    
            <div className="mt-3 text-center">
              <p>Don't have an account? <a href="/register">Register here</a></p>
            </div>
          </div>
        </div>
      );
})

// export default Login;