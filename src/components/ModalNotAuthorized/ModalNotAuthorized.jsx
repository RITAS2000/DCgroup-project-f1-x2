import css from '../ModalNotAuthorized/ModalNotAuthorized.module.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../redux/modal/slice.js';

const ModalNotAuthorized = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleNavigate = (path) => {
    // dispatch(logout());
    dispatch(closeModal());
    navigate(path);
  };

  return (
    <>
      <h2 className={css.title}>Not authorized</h2>
      <p className={css.text}>
        Please log in or register to open your account.
      </p>
      <div className={css.action}>
        <button
          className={css.loginBtn}
          onClick={() => handleNavigate('auth/login')}
        >
          Log in
        </button>
        <button
          className={css.registerBtn}
          onClick={() => handleNavigate('auth/register')}
        >
          Register
        </button>
      </div>
    </>
  );
};

export default ModalNotAuthorized;
