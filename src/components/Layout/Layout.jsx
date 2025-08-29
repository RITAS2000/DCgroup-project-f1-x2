import Footer from '../Footer/Footer.jsx';
import Header from '../Header/Header.jsx';
import css from './Layout.module.css';
import ModalContainer from '../ModalContainer/ModalContainer.jsx';
import { Suspense, lazy } from 'react';
import { ClockLoader } from 'react-spinners';

const Outlet = lazy(() => import('../Outlet/Outlet.jsx'));

export default function Layout({ children }) {
  return (
    <div className={css.page}>
      <Header />

      <ModalContainer />

      <div className={css['outlet-container']}>
        <Suspense
          fallback={
            <div className={css.loader}>
              <ClockLoader color="#3d2218" size={300} />
            </div>
          }
        >
          <Outlet>{children}</Outlet>
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}
