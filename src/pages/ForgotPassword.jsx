import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const [email, token] = [searchParams.get("email"), searchParams.get("token")];
  const navigate = useNavigate();

  const [form, setForm] = useState({});

  useEffect(() => {
    if (email && token) {
      setForm({ email, token });
    }
  }, [email, token]);

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validate password and re-password
  const validateFormPassword = () => {
    if (form.password !== form["re-password"]) {
      toast.error("Passwords do not match.");
      return false;
    }
    return true;
  };

  // Send email to reset password
  const handleSendEmail = async () => {
    // If email is not present, return
    if (!form.email) {
      return toast.error("Please enter your email.");
    }
    // If token is present, no need to send email
    if (token) return;
    try {
      const response = await fetch(baseUrl + "/api/users/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: form.email }),
      });

      if (response.ok) {
        toast(
          "If this email is registered, you will receive a reset link shortly."
        );
      } else {
        const result = await response.json();
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
      console.error("Error:", err);
    }
  };

  // Reset password
  const handleResetPassword = async () => {
    // If token is not present, return
    if (!token) return;
    // Validate password
    if (!validateFormPassword()) return;
    try {
      const response = await fetch(baseUrl + "/api/users/reset-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, token, password: form.password }),
      });

      if (response.ok) {
        toast("Password reset successfully!");
        navigate("/login?email=" + email);
        setForm({});
      } else {
        const result = await response.json();
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
      console.error("Error in reset password:", err);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSendEmail();
    await handleResetPassword();
  };

  // Render reset password form
  const renderResetForm = () => {
    if (!token) return null;
    return (
      <div className="flex flex-col gap-3">
        <input
          type="password"
          name="password"
          placeholder="Enter your new password"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="re-password"
          placeholder="Re-enter your new password"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Enter your Gmail"
            value={form.email}
            onChange={handleChange}
            disabled={token}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {renderResetForm()}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
