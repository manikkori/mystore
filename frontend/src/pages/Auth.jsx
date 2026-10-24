import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loadingForm, setLoadingForm] = useState(false);
  const { login, register, googleLogin, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [user, navigate, from]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success("Logged in successfully");
      } else {
        await register(formData.name, formData.email, formData.password);
        toast.success("Registered successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed");
    } finally {
      setLoadingForm(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoadingForm(true);
      await googleLogin(credentialResponse.credential);
      toast.success("Signed in with Google successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Google sign in failed");
    } finally {
      setLoadingForm(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google sign in was cancelled or failed");
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="bg-white p-8 rounded-2xl border border-brand-100 w-full max-w-md shadow-sm">
        <h2 className="text-3xl font-display font-bold text-center mb-8 text-brand-900">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        {/* Google Sign In */}
        <div className="mb-6">
          {googleClientId ? (
            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                shape="pill"
                width="100%"
                text={isLogin ? "signin_with" : "signup_with"}
              />
            </div>
          ) : (
            <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
              Google Sign-In ready: Set <strong>VITE_GOOGLE_CLIENT_ID</strong> in .env to activate 1-click Google login.
            </div>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-3 bg-white text-gray-500 font-semibold tracking-wider">
                Or continue with email
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-900 focus:border-brand-900 outline-none transition-all"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-900 focus:border-brand-900 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-900 focus:border-brand-900 outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loadingForm}
            className="w-full bg-brand-900 text-white py-3.5 rounded-lg font-medium hover:bg-black transition-colors disabled:opacity-50 mt-2 shadow-sm"
          >
            {loadingForm ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-brand-900 hover:underline"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
