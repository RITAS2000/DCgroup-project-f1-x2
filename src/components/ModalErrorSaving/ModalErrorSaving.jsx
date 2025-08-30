import { useDispatch } from 'react-redux';
import { closeModal } from '../../redux/modal/slice.js';
import css from './ModalErrorSaving.module.css';
import { useNavigate } from 'react-router-dom';

const ModalErrorSaving = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    dispatch(closeModal());
    navigate(path);
  };
  return (
    <>
      <h2 className={css.title}>Error while saving</h2>
      <p className={css.text}>
        To save this recipe, you need to authorize first
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

export default ModalErrorSaving;
