import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "./services/authentication";

import { AppContext } from "./Context/AppContext";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { setSession } = useContext(AppContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(formData);
      setSession(response.token, response.user);
      navigate("/dashboard");
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setFormData((currentData) => ({
      ...currentData,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <p className="chip">Welcome back</p>
        <h1>Log in to your portfolio workspace.</h1>
        <p>
          Continue editing projects, refine your narrative, and keep your public profile ready for
          every opportunity.
        </p>
      </section>

      <section className="auth-form-panel">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Sign in</h2>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-switch">
          Need an account? <Link to="/register">Create one</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
