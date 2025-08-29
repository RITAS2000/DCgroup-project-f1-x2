import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { closeModal } from "../../redux/modal/slice.js";
import css from './ModalRecipeSaved.module.css'

const ModalRecipeSaved = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleGoProfile = (path) => {
        dispatch(closeModal());
        navigate(path);
    }

  return (
    <>
    <h2 className={css.title}>Done! Recipe saved!</h2>
          <p className={css.text}>You can find recipe in our profile</p>
          <div className={css.action}>
            <button className={css.goProfileBtn} onClick={() => handleGoProfile('/profile/own')}>Go to My profile</button>
          </div>
    </>
  );
};

export default ModalRecipeSaved;