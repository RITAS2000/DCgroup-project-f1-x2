import s from './SearchBox.module.css';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setQuery } from '../../redux/recipes/slice';

const Schema = Yup.object({
  q: Yup.string()
    .trim()
    .min(2, 'Enter more than 2 letters')
    .required('Enter more than 2 letters'),
});

export default function SearchBox({ resetRef }) {
  const dispatch = useDispatch();
  const initValues = { q: '' };

  const onSubmit = async (values, actions) => {
    try {
      const q = values.q.trim();
      if (!q) {
        actions.setSubmitting(false);
        return;
      }

      // добавляем bump — явный «триггер» нового поиска даже с тем же текстом
      dispatch(setQuery({ title: q, bump: Date.now() }));
    } catch (e) {
      toast.error(String(e));
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      innerRef={resetRef}
      initialValues={initValues}
      validationSchema={Schema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className={s.searchbox}>
          <label className="form-field">
            <Field
              name="q"
              type="text"
              placeholder="Search recipes"
              className={`${s.input} ${errors.q && touched.q ? s.error : ''}`}
            />
            <ErrorMessage name="q" component="div" className={s.fix} />
          </label>
          <button type="submit" className={s.btn} disabled={isSubmitting}>
            Search
          </button>
        </Form>
      )}
    </Formik>
  );
}

// import s from './SearchBox.module.css';
// import { Formik, Field, Form, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import { useDispatch, useSelector } from 'react-redux';
// import { searchRecipes } from '../../redux/recipes/operations';
// import { toast } from 'react-toastify';
// import { setQuery, clearResults } from '../../redux/recipes/slice'; // 🟢 додав clearResults
// import { useRef } from 'react'; // 🟢 додав

// const Schema = Yup.object({
//   q: Yup.string()
//     .trim()
//     .min(2, 'Enter more than 2 letters')
//     .required('Enter more than 2 letters'),
// });

// export default function SearchBox({ resetRef }) {
//   // 🟢 додав resetRef
//   const dispatch = useDispatch();
//   const initValues = { q: '' };
//   const query = useSelector((s) => s.recipes.query);
//   const onSubmit = async (values, actions) => {
//     try {
//       const q = values.q.trim();
//       if (!q) {
//         actions.setSubmitting(false);
//         return;
//       }

//       dispatch(setQuery({ title: q }));

//       const res = await dispatch(searchRecipes({ title: q, page: 1 })).unwrap();
//       if (!res.recipes || res.recipes.length === 0) {
//         // toast.info('Nothing found'); //закоментув буде виводитись компонент NoResultSearch
//       }
//     } catch (e) {
//       toast.error(String(e));
//     } finally {
//       actions.setSubmitting(false);
//     }
//   };

//   // 🟢 метод для скидання пошуку (буде передаватись у NoResultSearch)
//   const handleReset = () => {
//     dispatch(clearResults());
//   };

//   return (
//     <Formik
//       innerRef={resetRef} // 🟢 додав
//       initialValues={initValues}
//       validationSchema={Schema}
//       onSubmit={onSubmit}
//     >
//       {({ errors, touched, isSubmitting }) => (
//         <Form className={s.searchbox}>
//           <label className="form-field">
//             <Field
//               name="q"
//               type="text"
//               placeholder="Search recipes"
//               className={`${s.input} ${errors.q && touched.q ? s.error : ''}`}
//             />
//             <ErrorMessage name="q" component="div" className={s.fix} />
//           </label>
//           <button type="submit" className={s.btn} disabled={isSubmitting}>
//             Search
//           </button>
//         </Form>
//       )}
//     </Formik>
//   );
// }
