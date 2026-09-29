import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../authSlice";
import { Mail, AlertCircle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");

  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);

  useEffect(() => {
    // Clear input on success
    if (message) setEmail("");
  }, [message]);

  const validate = () => {
    if (!email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email";
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setLocalError(v);
      return;
    }
    setLocalError("");
    dispatch(forgotPassword({ email }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <Mail className="text-blue-600" size={24} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Forgot your password?</h2>
          <p className="text-sm text-gray-500 mt-1">Enter your email and we'll send a secure reset link.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setLocalError("");
                }}
                placeholder="you@example.com"
                className={`w-full pl-12 pr-4 py-3 border rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 ${
                  localError || error ? "border-red-300 focus:ring-red-500 bg-red-50" : "border-gray-300 focus:ring-blue-600"
                }`}
              />
            </div>
            {(localError || error) && (
              <p className="text-red-600 text-sm mt-2 flex items-start gap-2">
                <AlertCircle size={16} /> {localError || error}
              </p>
            )}

            {message && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm flex items-center gap-2">
                <CheckCircle size={16} /> {message}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 text-white shadow-lg hover:shadow-xl ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5"
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Remembered your password?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
