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
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setIsGoogleLoading(true);

    try {
      const credential = credentialResponse?.credential;
      if (!credential) {
        setError("Google login failed: no credential returned.");
        setIsGoogleLoading(false);
        return;
      }

      // Send credential to backend for verification and session creation
      const res = await axios.post(
        "http://localhost:3001/api/auth/google",
        { credential },
        { withCredentials: true }
      );

      // Backend will create a session cookie. We trust server response and
      // navigate to home. Optionally store minimal user info from server.
      const user = res.data.user;
      if (user) sessionStorage.setItem("user", JSON.stringify(user));
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.error || "Google sign-in failed. Please try again."
      );
      console.error(err);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google sign-in was cancelled or failed. Please try again.");
    setIsGoogleLoading(false);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Sign in</h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <div className="d-flex justify-content-center mb-3 position-relative">
                  <div style={{ opacity: isGoogleLoading ? 0.6 : 1 }}>
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      useOneTap={false}
                    />
                  </div>
                  {isGoogleLoading && (
                    <div
                      className="position-absolute d-flex justify-content-center align-items-center"
                      style={{ inset: 0 }}
                    >
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}
                </div>
              </GoogleOAuthProvider>

              <div className="text-center my-2">or</div>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
