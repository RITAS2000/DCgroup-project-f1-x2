import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../redux/modal/slice.js';
import css from './ModalReUse.module.css';
import { useCallback } from 'react';

export default function ModalReUse({ children }) {
  const dispatch = useDispatch();

  const handleClose = useCallback(() => dispatch(closeModal()), [dispatch]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  const handleBackdropClick = () => handleClose();
  const handleModalClick = (e) => e.stopPropagation();

  return (
    <div className={css.backdrop} onClick={handleBackdropClick}>
      <div className={css.modal} onClick={handleModalClick}>
        <button onClick={handleClose} className={css.closeBtn}>
          <svg className={css.icon} width="24" height="24">
            <use xlinkHref="/sprite/symbol-defs.svg#icon-close" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
