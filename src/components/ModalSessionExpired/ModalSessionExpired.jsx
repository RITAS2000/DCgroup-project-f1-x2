import { useDispatch, useSelector } from 'react-redux';
import css from './ModalSessionExpired.module.css';
import { closeLogout } from '../../redux/modal/logoutSlice.js';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/auth/operations.js';
import { selectLogoutModalMessage } from '../../redux/modal/selectors.js';
export default function ModalSessionExpired() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const props = useSelector(selectLogoutModalMessage);

  const handleOk = () => {
    dispatch(logout());
    dispatch(closeLogout());
    navigate('auth/login');
  };
  return (
    <div className={css.container}>
      <div>
        <h2 className={css.title}>Session Expired</h2>
        <p className={css.text}>{props?.message}</p>
      </div>
      <button className={css.button} onClick={handleOk}>
        OK
      </button>
    </div>
  );
}
