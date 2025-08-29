import css from './Footer.module.css';
import Logo from '../Logo/Logo.jsx';
import FooterLink from '../FooterLink/FooterLink.jsx';

export default function Footer() {
  return (
    <footer className={css.container}>
      <Logo />
      <p className={css.textCooking}>
        © 2025 CookingCompanion. All rights reserved.
      </p>
      <FooterLink />
    </footer>
  );
}
