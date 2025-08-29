import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  getImageUrl,
  deleteFavorite,
  addFavorite,
  deleteRecipe,
} from '../../api/recipes';
import s from './UserRecipeCard.module.css';
import { toast } from 'react-toastify';

const SPRITE = '/sprite/symbol-defs.svg';

export default function UserRecipeCard({
  item,
  mode = 'own',
  onRemoved,
  onRemovedError,
}) {
  const navigate = useNavigate();
  const loc = useLocation();
  const [pending, setPending] = useState(false);

  const r = item?.recipe ?? item ?? {};
  const recipeId = item?.recipeId ?? item?.id ?? r?._id;
  const heading = (r.title || r.name || 'Recipe') ?? '';
  const desc = (r.description || r.desc || '') ?? '';
  const time = r.time ?? r.cookTime ?? r.totalTime ?? '';
  const cals = r.cals ?? r.calories ?? r.calory;
  const rawImg = r.photo || r.thumb || r.image || r.img || '';
  const img = getImageUrl(rawImg || '/images/placeholder.png');

  const isFavoritesTab =
    /\/profile\/favorites/.test(loc.pathname) || mode === 'favorites';
  const [isSaved, setIsSaved] = useState(!!isFavoritesTab);

  async function toggleSave(id) {
    if (!id || pending) return;

    try {
      setPending(true);
      if (isSaved) {
        await deleteFavorite(id);
        setIsSaved(false);
        toast.success('Recipe removed from favorites!');
        if (isFavoritesTab && typeof onRemoved === 'function') {
          onRemoved(id);
        }
      } else {
        await addFavorite(id);
        setIsSaved(true);
      }
    } catch (err) {
      if (typeof onRemovedError === 'function') onRemovedError(id, err);
      alert('Operation failed. Please try again.');
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(id) {
    if (!id || pending) return;
    const confirmAction = window.confirm(
      'Are you sure you want to delete this recipe?',
    );
    if (!confirmAction) return;

    setPending(true);
    try {
      await deleteRecipe(id);
      toast.success('Recipe deleted successfully!');
      if (typeof onRemoved === 'function') onRemoved(id);
    } catch {
      if (typeof onRemoved === 'function') onRemoved(id);
    } finally {
      setPending(false);
    }
  }

  return (
    <article className={s.card} data-rc="v2">
      <div className={s.thumbWrap}>
        <img className={s.image} src={img} alt={heading} />
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
            onClick={() => {
              handleDelete(recipeId);
            }}
            disabled={pending}
            aria-label="Delete recipe"
          >
            <svg
              className={s.trash}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        )}

        {isFavoritesTab && (
          <button
            type="button"
            className={`${s.favBtn} ${isSaved ? s.favBtnActive : ''}`}
            onClick={() => toggleSave(recipeId)}
            aria-label={isSaved ? 'Remove from favorites' : 'Save to favorites'}
            aria-pressed={isSaved ? 'true' : 'false'}
            disabled={pending || !recipeId}
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
