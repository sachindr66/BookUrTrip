import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../authSlice";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [localError, setLocalError] = useState("");

  const { loading, error, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (message) {
      setNewPassword("");
      setConfirmPassword("");
      setLocalError("");
      // Redirect after a short delay so user sees success message
      const t = setTimeout(() => navigate("/login"), 1800);
      return () => clearTimeout(t);
    }
  }, [message, navigate]);

  const validate = () => {
    if (!newPassword || !confirmPassword) return "All fields are required";
    if (newPassword.length < 6) return "Password must be at least 6 characters";
    if (newPassword !== confirmPassword) return "Passwords do not match";
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

    dispatch(
      resetPassword({
        token,
        newPassword,
      })
    );
  };

  const getInputClass = (hasError) =>
    `w-full pl-12 pr-12 py-3 border rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 ${
      hasError ? "border-red-300 focus:ring-red-500 bg-red-50" : "border-gray-300 focus:ring-blue-600"
    }`;

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 text-center">
          <div className="mx-auto mb-3 w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
            <AlertCircle className="text-yellow-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Invalid or expired link</h3>
          <p className="text-sm text-gray-500 mt-2">Your password reset link is invalid or has expired. You can request a new link.</p>
          <div className="mt-6">
            <Link to="/forgot-password" className="inline-block px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:opacity-95">Request new link</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <Lock className="text-blue-600" size={24} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Reset your password</h2>
          <p className="text-sm text-gray-500 mt-1">Choose a strong password and confirm to finish</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="sr-only">New password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="newPassword"
                name="newPassword"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setLocalError("");
                }}
                placeholder="New password"
                className={getInputClass(localError)}
              />
              <button
                type="button"
                onClick={() => setShowNew((s) => !s)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="sr-only">Confirm password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setLocalError("");
                }}
                placeholder="Confirm password"
                className={getInputClass(localError)}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {(localError || error) && (
            <p className="text-red-600 text-sm mt-1 flex items-start gap-2">
              <AlertCircle size={16} /> {localError || error}
            </p>
          )}

          {message && (
            <div className="mt-1 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm flex items-center gap-2">
              <CheckCircle size={16} /> {message} — redirecting to login
            </div>
          )}

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
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Remembered your password? {" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
