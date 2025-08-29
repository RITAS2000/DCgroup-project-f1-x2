import { useNavigate } from 'react-router-dom';
import css from './RecipeCard.module.css';
import { selectIsLoggedIn } from '../../redux/auth/selectors.js';

import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../../redux/modal/slice.js';

export default function RecipeCard({
  id,
  thumb,
  title,
  time,
  description,
  calories,
}) {
  const navigate = useNavigate();
  const handleLearnMore = () => {
    navigate(`/recipes/${id}`);
  };

  const isLoggedIn = useSelector(selectIsLoggedIn);

  const dispatch = useDispatch();

  //бажання зберегти рецепт
  const handleAddToSavedRecipes = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      dispatch(openModal({ type: 'errorSaving' }));
    }
  };

  return (
    <div className={css.card}>
      <img className={css.image} src={thumb} alt={title} />
      <div className={css.title_container}>
        <h3 className={css.title}>{title}</h3>
        <div className={css.time_container}>
          <svg width="24" height="24">
            <use xlinkHref="/sprite/symbol-defs.svg#icon-clock"></use>
          </svg>
          {/* <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 7.61537V12.5481L15.2885 15.2884M19.125 12C19.125 15.935 15.935 19.125 12 19.125C8.06497 19.125 4.875 15.935 4.875 12C4.875 8.06497 8.06497 4.875 12 4.875C15.935 4.875 19.125 8.06497 19.125 12Z"
              stroke="black"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg> */}
          <p className={css.time}>{time}</p>
        </div>
      </div>
      <div className={css.descr_cont}>
        <p className={css.description1}>{description}</p>
        <p className={css.description2}>~{calories ?? 'N/A'} cals</p>
      </div>
      <div className={css.btn_cont}>
        <button className={css.btn_learn} onClick={handleLearnMore}>
          Learn more
        </button>
        <button className={css.btn_save} onClick={handleAddToSavedRecipes}>
          <svg width="24" height="24">
            <use xlinkHref="/sprite/symbol-defs.svg#icon-bookmark-outline"></use>
          </svg>
          {/* <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.9971 3.5C13.2607 3.50001 14.4206 3.62091 15.3398 3.76074C16.5036 3.93777 17.416 4.7353 17.6758 5.84961C17.9894 7.19485 18.2969 9.24141 18.2441 11.9902C18.1859 15.0233 17.7432 17.2117 17.3164 18.6396C17.201 19.0256 16.9339 19.2243 16.6318 19.2754C16.316 19.3287 15.9263 19.2236 15.6094 18.9082C15.0326 18.334 14.3719 17.7138 13.7627 17.2344C13.4586 16.9951 13.1558 16.7817 12.875 16.626C12.6101 16.4791 12.2995 16.3457 11.9971 16.3457C11.6993 16.3457 11.3783 16.4769 11.0977 16.6211C10.7986 16.7747 10.4675 16.9855 10.1289 17.2246C9.45038 17.7037 8.69895 18.3244 8.03711 18.8994C7.68779 19.2029 7.27644 19.2747 6.95215 19.1865C6.63917 19.1013 6.37522 18.8609 6.29395 18.4424C6.01488 17.0044 5.75 14.8805 5.75 12C5.75 9.12652 6.04615 7.09969 6.34082 5.79492C6.58505 4.71356 7.4671 3.94375 8.60156 3.76855C9.52893 3.62535 10.7091 3.5 11.9971 3.5Z"
              stroke="black"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg> */}
        </button>
      </div>
    </div>
  );
}
