import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../../redux/modal/slice';
import { getImageUrl, deleteFavorite } from '../../api/recipes';
import { setShouldReload } from '../../redux/userPro/slice';
import { ClockLoader } from 'react-spinners';
import s from './UserRecipeCard.module.css';
import { toast } from 'react-toastify';

const SPRITE = '/sprite/symbol-defs.svg';

export default function UserRecipeCard({ item, mode = 'own', onRemovedError }) {
  const navigate = useNavigate();
  const loc = useLocation();
  const dispatch = useDispatch();

  // Якщо у сторі нема поля deletingIds — повернеться порожній масив,
  // і кнопка поводитиметься як звичайно.
  const deletingIds = useSelector((st) => st.userProfile?.deletingIds || []);

  const [pending, setPending] = useState(false); // для видалення зі "Saved"

  const r = item?.recipe ?? item ?? {};
  const recipeId = item?.recipeId ?? item?.id ?? r?._id;
  const heading = (r.title || r.name || 'Recipe') ?? '';
  const desc = (r.description || r.desc || '') ?? '';
  const time = r.time ?? r.cookTime ?? r.totalTime ?? '';
  const cals = r.cals ?? r.calories ?? r.calory;
  const rawImg = r.photo || r.thumb || r.image || r.img || '';
  const img = rawImg ? getImageUrl(rawImg) : '/images/placeholder.png';

  const isFavoritesTab =
    /\/profile\/favorites/.test(loc.pathname) || mode === 'favorites';
  const isDeleting = deletingIds.includes(String(recipeId));

  function handleDelete(id) {
    if (!id || pending || isDeleting) return;
    dispatch(openModal({ type: 'confirmDelete', props: { recipeId: id } }));
  }

  async function handleRemoveFavorite(id) {
    if (!id || pending) return;
    setPending(true);
    try {
      await deleteFavorite(id);
      toast.success('Recipe removed from favorites!');
      // тригеримо глобальний рефетч + показ годинника в списку
      dispatch(setShouldReload(true));
    } catch (err) {
      if (typeof onRemovedError === 'function') onRemovedError(id, err);
    } finally {
      setPending(false);
    }
  }

  return (
    <article className={s.card} data-rc="v2">
      <div className={s.thumbWrap}>
        {img ? (
          <img
            className={s.thumb}
            src={img}
            alt={heading}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/images/placeholder.png';
            }}
          />
        ) : (
          <div className={s.thumbFallback} aria-label="No image available" />
        )}
      </div>

      <div className={s.headerRow}>
        <h3 className={s.title} title={heading}>
          {heading}
        </h3>
        {time && (
          <span className={s.timeBadge} title={`${time} min`}>
            <svg width="24" height="24">
              <use href={`${SPRITE}#icon-clock`} />
            </svg>
            {time}
          </span>
        )}
      </div>

      <div className={s.descBlock}>
        <p className={s.desc}>{desc || '\u00A0'}</p>
        <span className={s.calsPill}>
          {typeof cals === 'number' ? `~${cals} cals` : '~N/A cals'}
        </span>
      </div>

      <div className={s.footerRow}>
        <button
          className={`${s.moreBtn} ${
            mode === 'own' ? s.moreBtnOwn : s.moreBtnFav
          }`}
          type="button"
          onClick={() => recipeId && navigate(`/recipes/${recipeId}`)}
          disabled={!recipeId}
        >
          Learn more
        </button>

        {mode === 'own' && (
          <button
            type="button"
            className={s.deleteBtn}
            onClick={() => handleDelete(recipeId)}
            disabled={pending || isDeleting}
            aria-label="Delete recipe"
          >
            {isDeleting ? (
              <ClockLoader size={16} color="#fff" />
            ) : (
              <svg
                className={s.trash}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M3 6h18" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            )}
          </button>
        )}

        {isFavoritesTab && (
          <button
            type="button"
            className={s.favBtn}
            onClick={() => handleRemoveFavorite(recipeId)}
            disabled={pending}
            aria-label="Remove from favorites"
            aria-pressed="true"
          >
            <svg width="24" height="24" style={{ color: '#fff' }}>
              <use href={`${SPRITE}#icon-bookmark-outline`} />
            </svg>
          </button>
        )}
      </div>
    </article>
  );
}
