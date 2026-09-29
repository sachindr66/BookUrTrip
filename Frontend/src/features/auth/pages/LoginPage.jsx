import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../authSlice";
import { Mail, Lock, Eye, EyeOff, AlertCircle, LogIn, CheckCircle } from "lucide-react";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, message } = useSelector(
    (state) => state.auth
  );

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState({
    email: "",
    password: "",
  });

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // ---------- FORM VALIDATION ----------
  const validateForm = () => {
    const errors = {};

    if (!user.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(user.email))
      errors.email = "Please enter a valid email";

    if (!user.password) errors.password = "Password is required";
    return errors;
  };

  // ---------- INPUT CHANGE ----------
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setLocalError({ ...localError, [e.target.name]: "" });
  };

  // focus fields when validation errors appear
  useEffect(() => {
    if (localError.email) emailRef.current?.focus();
    else if (localError.password) passwordRef.current?.focus();
  }, [localError]);

  // ---------- SUBMIT ----------
  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setLocalError(errors);
      return;
    }

    dispatch(loginUser(user));
  };

  // ---------- BACKEND ERROR → FIELD ----------
  useEffect(() => {
    if (error) {
      if (error.toLowerCase().includes("email")) {
        setLocalError({ email: error });
      } else if (error.toLowerCase().includes("password")) {
        setLocalError({ password: error });
      }
    }
  }, [error]);

  // ---------- REDIRECT ----------
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);


  const getInputClass = (field) => {
    const baseClass = "w-full pl-12 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ";
    const errorClass = localError[field] ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50" : "border-gray-300 focus:ring-blue-600 focus:border-blue-500 hover:border-blue-300";
    return baseClass + errorClass;
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        {/* Header */}
        <div className="text-center mb-4">
          <Link to="/">
            <h1 className="text-3xl font-bold text-blue-600">BookUrTrip</h1>
          </Link>
          <p className="text-gray-500 mt-1">Welcome back — log in to continue</p>
        </div>

        {/* Global messages */}
        {error && !/email|password/i.test(error) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2" role="alert" aria-live="assertive">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2" role="status" aria-live="polite">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-700 text-sm">{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative mt-1 ">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="email"
                ref={emailRef}
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={getInputClass("email")}
                autoFocus
                aria-invalid={!!localError.email}
                aria-describedby={localError.email ? "email-error" : undefined}
              />
            </div>
            {localError.email && (
              <p id="email-error" className="text-red-500 text-sm mt-1 flex items-center gap-1" aria-live="assertive">
                <AlertCircle size={14} /> {localError.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1 ">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                ref={passwordRef}
                type={showPassword ? "text" : "password"}
                name="password"
                value={user.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={getInputClass("password")}
                aria-invalid={!!localError.password}
                aria-describedby={localError.password ? "password-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {localError.password && (
              <p id="password-error" className="text-red-500 text-sm mt-1 flex items-center gap-1" aria-live="assertive">
                <AlertCircle size={14} /> {localError.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${loading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5'
              } text-white shadow-lg hover:shadow-xl`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Log In
              </>
            )}
          </button>
          <div className="flex justify-between items-center">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot Password?</Link>
            <Link to="/register" className="text-sm text-gray-600 hover:underline">Create account</Link>
          </div>

        </form>


      </div>
    </div>
  );
};

export default LoginPage;
