import { Link } from 'react-router-dom';
import css from './Logo.module.css';

export default function Logo() {
  return (
    <Link className={css.continer} to="/">
      <div className={css.logo}>
        <svg width="24" height="24">

          <use href="/sprite/symbol-defs.svg#icon-logo" />

        </svg>
      </div>
      <p className={css.text}>Tasteorama</p>
    </Link>
  );
}
