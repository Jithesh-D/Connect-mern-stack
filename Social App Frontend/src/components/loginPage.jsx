import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GOOGLE_CLIENT_ID =
  "731499129152-te7fngasjpd55l5hd550l5o8sgkl40vv.apps.googleusercontent.com";
const ALLOWED_DOMAIN = "@rvu.edu.in";

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.toLowerCase().endsWith(ALLOWED_DOMAIN)) {
      setError(`Please use your ${ALLOWED_DOMAIN} email to sign in.`);
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3001/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      console.log("Login successful:", res.data);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      // notify app about auth change so chatbot / other widgets can update immediately
      window.dispatchEvent(new Event("userChanged"));
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Google sign-in moved to Signup page. Keep placeholder handlers in case of future reuse.
  const handleGoogleSuccess = async () => {};
  const handleGoogleError = () => {};

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Login</h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleManualSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    RVU Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="you@rvu.edu.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Logging in...
                      </>
                    ) : (
                      "Login with email"
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center mt-3">
                <p className="mb-0">
                  Don't have an account?{" "}
                  <a
                    href="/signup"
                    className="text-primary text-decoration-none fw-semibold"
                  >
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
