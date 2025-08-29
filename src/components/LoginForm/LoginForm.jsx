import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { login } from "../../redux/auth/operations";
import css from "./LoginForm.module.css";
import Container from "../Container/Container";
import { useState } from "react";  
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email")
    .max(50, "Email must be at most 50 characters")
    .required("Required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be at most 50 characters")
    .required("Required"),
});

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false); 

  const handleSubmit = async (values, { resetForm }) => {
  try {
    const result = await dispatch(login(values));

    if (result.meta.requestStatus === "fulfilled") {
      navigate("/");
    } else {
      toast.error(result.payload?.message || "Login failed. Please try again.");
    }
  } catch (error) {
    toast.error(error?.message || "Something went wrong. Please try again.");
  } finally {
    resetForm();
  }
};

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Container variant="white">
          <Form className={css.container}>
            <h2 className={css.title}>Login</h2>

            <div className={css.form}>
              <label className={css.label}>
                <span className={css.text}>Enter your email address</span>
                <Field
                  name="email"
                  type="email"
                  placeholder="email@gmail.com"
                  className={`${css.input} ${
                    errors.email && touched.email ? css.inputError : ""
                  }`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={css.error}
                />
              </label>

              <label className={css.label}>
                <span className={css.text}>Enter your password</span>
                <div className={css.passWrapper}>
                  <Field
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    className={`${css.input} ${
                      errors.password && touched.password ? css.inputError : ""
                    }`}
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className={css.toggleBtn}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <AiOutlineEye size={20} />  : <AiOutlineEyeInvisible size={20} />}
                    </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className={css.error}
                />
              </label>

              <button type="submit" className={css.button}>
                Login
              </button>
            </div>

            <p className={css.titlehint}>
              Don’t have an account?{" "}
              <Link to="/auth/register" className={css.link}>
                Register
              </Link>
            </p>
          </Form>
        </Container>
      )}
    </Formik>
  );
}