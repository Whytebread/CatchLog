import { useState, useContext } from 'react';
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from 'react-router-dom';
import { validateUser } from "../utils/validate";
import { toast } from "react-toastify";



const Signup = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateUser(form);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      const data = await signup(form.name, form.email, form.password);
      toast.success(`Account created! Welcome, ${data.user.name}!`);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed");
      toast.error(err.message || "Unable to register. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create an Account</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        {error && <div className="error">{error}</div>}
        <button type="submit">Sign Up</button>
        <div className="link-text">
          Already have an account? <a href="/login">Log In</a>
        </div>
      </form>
    </div>
  );
};

export default Signup;
