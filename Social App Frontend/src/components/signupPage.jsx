import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GOOGLE_CLIENT_ID =
  "731499129152-te7fngasjpd55l5hd550l5o8sgkl40vv.apps.googleusercontent.com";

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

function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3001/api/auth/signup",
        { username, email, password },
        { withCredentials: true }
      );
      console.log("Signup successful:", res.data);
      // If server returned user info, persist and notify app
      if (res.data?.user) {
        try {
          sessionStorage.setItem("user", JSON.stringify(res.data.user));
          try {
            localStorage.setItem("isAuthenticated", "true");
          } catch (e) {}
        } catch (e) {}
        window.dispatchEvent(new Event("userChanged"));
      }
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Google sign-up handlers
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setIsGoogleLoading(true);

    try {
      const credential = credentialResponse?.credential;
      if (!credential) {
        setError("Google signup failed: no credential returned.");
        setIsGoogleLoading(false);
        return;
      }

      // Optionally decode token for client-side display
      const payload = decodeJwt(credential);

      // Send credential to backend for verification and session creation
      const res = await axios.post(
        "http://localhost:3001/api/auth/google",
        { credential },
        { withCredentials: true }
      );

      const user = res.data.user || payload;
      if (user) {
        try {
          sessionStorage.setItem("user", JSON.stringify(user));
          try {
            localStorage.setItem("isAuthenticated", "true");
          } catch (e) {}
        } catch (e) {}
        window.dispatchEvent(new Event("userChanged"));
        navigate("/home");
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Google sign-up failed. Please try again."
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl w-full gap-12">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl font-extrabold text-green-600">RVUConnect</h1>
          <p className="text-lg text-gray-700 mt-4 max-w-md mx-auto md:mx-0">
            RVUConnect helps you connect, collaborate, and grow with students
            and opportunities across
          </p>
        </div>

        <div className="flex-1 max-w-md w-full">
          <div className="bg-white shadow-lg rounded-2xl p-8">
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <div className="d-flex justify-content-center mb-4 position-relative">
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
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
              </div>
            </GoogleOAuthProvider>

            <div className="text-center my-2">or</div>
            <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
            <br></br>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength="3"
              />
              <br></br>
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="RVU Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <br></br>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
              <br></br>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="6"
              />
              <br></br>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg hover:bg-blue-700 transition"
              >
                {isLoading ? "Signing up..." : "Sign Up"}
              </button>
            </form>

            <p className="text-center text-gray-600 text-sm mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
