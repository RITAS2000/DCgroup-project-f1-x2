import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { register } from '../../redux/auth/operations';
import css from './RegistrationForm.module.css';
import Container from "../Container/Container";
import { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .max(16, 'Name must be at most 16 characters')
    .required('Name is required'),

  email: Yup.string()
    .email('Invalid email address')
    .max(128, 'Email must be at most 128 characters')
    .required('Email is required'),

  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .required('Password is required'),

  confirm: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function RegistrationForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirm: '',
  };

  const handleSubmit = async (values, { resetForm, setSubmitting  }) => {
  try {
    const result = await dispatch(
      register({
        name: values.name,
        email: values.email,
        password: values.password,
      })
    );

    if (result.meta.requestStatus === "fulfilled") {
      navigate("/auth/login");
      resetForm();
    } else {
      toast.error(result.payload?.message || "Registration failed. Please try again.");
    }
  } catch (error) {
    toast.error(error?.message || "Something went wrong. Please try again.");
  } finally {
    setSubmitting(false);;
  }
};
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={false}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnChange={true}  
      validateOnBlur={false}    
    >
      {({ errors, values, touched }) => (   
        <Container variant="white">
          <div className={css.container}>
            <Form className={css.form}>
              <h2 className={css.title}>Register</h2>
              <p className={css.text}>
                Join our community of culinary enthusiasts, save your favorite
                recipes, and share your cooking creations
              </p>

              <label className={css.label}>
                <span className={css.labelText}>Enter your name</span>
                <Field
                  name="name"
                  type="text"
                  placeholder="Max"
                  className={`${css.input} ${
                    errors.name && touched.name ? css.inputError : ''
                  }`}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className={css.error}
                />
              </label>

              <label className={css.label}>
                <span className={css.labelText}>Enter your email address</span>
                <Field
                  name="email"
                  type="email"
                  placeholder="email@gmail.com"
                  aria-invalid={Boolean(values.email && errors.email)}
                  className={`${css.input} ${
                    values.email && errors.email ? css.inputError : ''
                  }`} 
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={css.error}
                />
              </label>

              <label className={css.label}>
                <span className={css.labelText}>Create a strong password</span>
                <div className={css.passWrapper}>
                  <Field
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="********"
                    className={`${css.input} ${
                      errors.password && touched.password ? css.inputError : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={css.toggleBtn}
                  >
                    {showPassword ? <AiOutlineEye size={20} />  : <AiOutlineEyeInvisible size={20} /> }
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className={css.error}
                />
              </label>

              <label className={css.label}>
                <span className={css.labelText}>Repeat your password</span>
                <div className={css.passWrapper}>
                  <Field
                    name="confirm"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="********"
                    className={`${css.input} ${
                      errors.confirm && touched.confirm ? css.inputError : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className={css.toggleBtn}
                  >
                    {showConfirm ? <AiOutlineEye size={20} />  : <AiOutlineEyeInvisible size={20} />}
                  </button>
                </div>
                <ErrorMessage
                  name="confirm"
                  component="div"
                  className={css.error}
                />
              </label>

              <button type="submit" className={css.button}>
                Create account
              </button>

              <div className={css.box}>
                <p className={css.registerHint}>
                  Already have an account?
                  <Link to="/auth/login" className={`${css.registerLink} ${css.pulseLink}`}>
                    Log in
                  </Link>
                </p>
              </div>
            </Form>
          </div>
        </Container>
      )}
    </Formik>
  );
}
