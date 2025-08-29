import { useDispatch, useSelector } from 'react-redux';
import css from './UserMenu.module.css';

import { openModal } from '../../redux/modal/slice.js';

export default function UserMenu() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const firstLetter = user?.name?.charAt(0) || 'U';

  const handleLogOut = (e) => {
    e.preventDefault();
    dispatch(openModal({ type: 'logoutConfirm' }));
  };

  return (
    <div className={css.userMenu}>
      <div className={css.userName}>
        <div className={css.letter}>{firstLetter}</div>
        <span>{user?.name || ''}</span>
      </div>

      <div className={css.separator}></div>

      <button className={css.btnLogout} onClick={handleLogOut}>
        <svg width="24" height="24">
          <use href="/sprite/symbol-defs.svg#icon-log-out" />
        </svg>
      </button>
    </div>
  );
}
