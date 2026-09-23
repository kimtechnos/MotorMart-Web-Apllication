import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/dark.css";
import "react-simple-toasts/dist/theme/success.css";
import "react-simple-toasts/dist/theme/failure.css";
import { Link, useNavigate } from "react-router-dom";
import { apiBase } from "../../utils/config";
import useUserStore from "../../store/useUserstore";
import "./register-log.css";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password should be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const changeUserInformation = useUserStore(
    (state) => state.changeUserInformation,
  );

  const handleSubmit = async (values) => {
    setSubmitting(true);

    try {
      const response = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok && data.success === true) {
        toast(data.message || "Login success", { theme: "success" });
        changeUserInformation(data.data);
        if (data.data.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      } else {
        toast(data.message || "Login failed", { theme: "failure" });
      }
    } catch (err) {
      toast(err.message || "An error occurred. Please try again.", {
        theme: "failure",
        duration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="auth-screen">
      <div className="form">
        <p className="badge">MotorMart</p>
        <h1>Login</h1>
        <p className="muted">Use the email and password for your account.</p>
        <form onSubmit={formik.handleSubmit}>
          <div className="email">
            <label className="form__label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form__input"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="error">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="password">
            <label className="form__label" htmlFor="password">
              Password
            </label>
            <input
              className="form__input"
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="error">{formik.errors.password}</div>
            ) : null}
          </div>
          <button type="submit" className="btn" disabled={submitting}>
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="muted">
          New here? <Link to="/">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
