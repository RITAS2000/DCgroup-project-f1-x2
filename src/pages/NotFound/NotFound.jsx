import { Link } from 'react-router-dom';
import Container from '../../components/Container/Container.jsx';
import imgMobil1x from '../../images/NotFound-mobile@1x.jpg';
import imgMobil2x from '../../images/NotFound-mobile@2x.jpg';
import imgTabl1x from '../../images/NotFound-desk-tabl@1x.webp';
import imgTabl2x from '../../images/NotFound-desk-tabl@2x.webp';
import css from './NotFound.module.css';
import { GoArrowLeft } from 'react-icons/go';

export default function NotFound() {
  return (
    <Container variant="light">
      <div className={css.container}>
        <picture>
          <source
            media="(min-width: 768px)"
            srcSet={`${imgTabl1x} 1x, ${imgTabl2x} 2x`}
          />

          <source
            media="(max-width: 767px)"
            srcSet={`${imgMobil1x} 1x, ${imgMobil2x} 2x`}
          />
          <img
            className={css.img}
            src={imgMobil1x}
            alt="Empty plate"
            width="361"
            height="267"
          />
        </picture>
        <div className={css.textContainer}>
          <h1 className={css.title}>404</h1>
          <p className={css.text}>Recipe not found</p>
        </div>

        <Link className={css.link} to="/">
          <GoArrowLeft className={css.icon} />
          <p className={css.linkText}>Back to Home</p>
        </Link>
      </div>
    </Container>
  );
}
