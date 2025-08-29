import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from '../Layout/Layout.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import RecipeDetails from '../RecipeDetails/RecipeDetails.jsx';
import RecipesList from '../RecipesList/RecipesList.jsx';

import PrivateRoute from '../PrivateRoute.jsx';
import RestrictedRoute from '../RestrictedRoute.jsx';
import NotFound from '../../pages/NotFound/NotFound.jsx';
import UnauthorizedHandler from '../UnauthorizedHandler/UnauthorizedHandler.jsx';
import ReModalContainer from '../ModalContainer/ModalContainer.jsx';

const MainPage = lazy(() => import('../../pages/MainPage/MainPage.jsx'));
const AuthPage = lazy(() => import('../../pages/AuthPage/AuthPage.jsx'));
const AddRecipePage = lazy(() =>
  import('../../pages/AddRecipePage/AddRecipePage.jsx'),
);
const ProfilePage = lazy(() =>
  import('../../pages/ProfilePage/ProfilePage.jsx'),
);
// const NotFoundPage = lazy(() =>
//   import('../../pages/NotFoundPage/NotFoundPage.jsx'),
// );
const RecipeViewPage = lazy(() =>
  import('../../pages/RecipeViewPage/RecipeViewPage.jsx'),
);

export default function App() {
  return (
    <>
      <UnauthorizedHandler />
      <Layout>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<MainPage />} />

            <Route
              path="/recipes/:recipeId"
              element={<RecipeViewPage />}
            ></Route>

            <Route
              path="/recipes/*"
              element={
                <PrivateRoute
                  redirectTo="/auth/login"
                  component={<NotFound />}
                />
              }
            />

            <Route
              path="/add-recipe"
              element={
                <PrivateRoute
                  redirectTo="/auth/login"
                  component={<AddRecipePage />}
                />
              }
            />

            <Route
              path="/profile/:recipeType"
              element={
                <PrivateRoute
                  redirectTo="/auth/login"
                  component={<ProfilePage />}
                />
              }
            />

            <Route
              path="/auth/:authType"
              element={
                <RestrictedRoute redirectTo="/" component={<AuthPage />} />
              }
            />

            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </Suspense>

        <ToastContainer
          position="bottom-center"
          autoClose={2500}
          theme="colored"
        />
       
      </Layout>
    </>
  );
}
