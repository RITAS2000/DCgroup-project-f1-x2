import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../../redux/auth/selectors.js';
import css from './FooterLink.module.css';
import { openModal } from '../../redux/modal/slice.js';
import ModalNotAuthorized from '../ModalNotAuthorized/ModalNotAuthorized.jsx';
// import { selectIsModalOpen } from '../../redux/modal/selectors.js';

export default function FooterLink() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  // const isModalOpen = useSelector(selectIsModalOpen);
  const dispatch = useDispatch();

  const handleAccountClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();

      dispatch(openModal({type: 'notAuthorized'}));

    }
  };

  return (
    <div className={css.container}>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${css.link} ${css.isActive}` : css.link
        }
        to="/"
      >
        Recipes
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${css.link} ${css.isActive}` : css.link
        }
        to="/profile"
        onClick={handleAccountClick}
      >
        Account
      </NavLink>
      {/* {isModalOpen && <ModalNotAuthorized />} */}
    </div>
  );
}
