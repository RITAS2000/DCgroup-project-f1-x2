import css from './Outlet.module.css';
export default function Outlet({ children }) {
  return <main className={css.main}>{children}</main>;
}
