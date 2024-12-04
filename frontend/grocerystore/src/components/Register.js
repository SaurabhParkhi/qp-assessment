import { useState } from "react";
import { useNavigate } from "react-router-dom";
export const Register = (()=>{
    // return (
    //     <div className="d-flex justify-content-center align-item-center bg-secondary vh-100">
    //         <div className="bg-white rounded p-3 w-25">
    //             Register
    //         </div>
    //         <form>

    //         </form>
    //     </div>
    // )

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword:""
      });
    
      const [error, setError] = useState("");
      const [success, setSuccess] = useState("");
    
      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
        setError("");
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
          setError("All fields are required.");
          return;
        }

        if(formData.password !== formData.confirmPassword){
            setError("Passwords do not match");
            return;
        }

        const response = await fetch("http://localhost:5000/api/auth/register",{
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
              },
            body:JSON.stringify({
                name: formData.name,
                email: formData.email,
                password: formData.password

            })
        });

        if(response.status == 200 ){
            const resp = await response.json();
            setSuccess("Registration successful!");
            setTimeout(()=>{
              navigate('/login');
            },2000)
            
        }
        else{
            setError("Something went wrong");
        }
        
        setFormData({ name: "", email: "", password: "" });
      };
    
      return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
          <div className="bg-white rounded shadow p-4 w-100" style={{ maxWidth: "400px" }}>
            <h2 className="text-center mb-4">Register</h2>
    
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
    
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter your name"
                />
              </div>
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
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Retype password"
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Register
              </button>
            </form>
          </div>
        </div>
      );
})

// export default Register;