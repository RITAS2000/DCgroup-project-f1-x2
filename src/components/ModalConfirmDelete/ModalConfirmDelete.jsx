import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../redux/modal/slice';
import { selectModalProps } from '../../redux/modal/selectors';
import { deleteRecipe } from '../../api/recipes';
import { toast } from 'react-toastify';
import { setShouldReload } from '../../redux/userPro/slice';
import css from './ModalConfirmDelete.module.css';

const ModalConfirmDelete = () => {
  const dispatch = useDispatch();
  const { recipeId } = useSelector(selectModalProps) || {};
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!recipeId || submitting) return;
    setSubmitting(true);
    try {
      await deleteRecipe(recipeId);
      toast.success('Recipe deleted successfully!');
      dispatch(setShouldReload(true));
    } catch {
      toast.error('Failed to delete recipe.');
    } finally {
      setSubmitting(false);
      dispatch(closeModal());
    }
  };

  return (
    <div className={css.modal}>
      <h2 className={css.title}>Delete recipe?</h2>
      <p className={css.text}>Are you sure you want to delete this recipe?</p>
      <div className={css.actions}>
        <button
          onClick={() => dispatch(closeModal())}
          className={css.cancelBtn}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          className={css.confirmBtn}
          disabled={submitting}
        >
          {submitting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default ModalConfirmDelete;
