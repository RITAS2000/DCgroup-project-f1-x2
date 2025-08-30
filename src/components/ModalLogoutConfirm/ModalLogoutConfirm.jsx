import { useDispatch } from 'react-redux';
import { closeModal } from '../../redux/modal/slice.js';
import css from './ModalLogoutConfirm.module.css';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/auth/operations.js';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

const ModalLogoutConfirm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClose = useCallback(() => dispatch(closeModal()), [dispatch]);

  const handleConfirm = async () => {
    try {
      await dispatch(logout()).unwrap();
      dispatch(closeModal());
      navigate('/');
      toast.success('You have successfully logged out.');
    } catch (e) {
      // показать toast/error при желании
      console.error(e);
    }
  };

  return (
    <>
      <h2 className={css.title}>Are you sure?</h2>
      <p className={css.text}>We will miss you</p>
      <div className={css.action}>
        <button className={css.logoutBtn} onClick={handleConfirm}>
          Log out
        </button>
        <button className={css.cancelBtn} onClick={handleClose}>
          Cancel
        </button>
      </div>
    </>
  );
};

export default ModalLogoutConfirm;
