import { Field, ErrorMessage } from 'formik';

import css from './CategoryAndIngredientsSelect.module.css';

const CategoryAndIngredientsSelect = ({
  categories,
  placeholder,
  name,
  id,
}) => {
  // const { values } = useFormikContext();

  return (
    <div className={css.selectWrapper}>
      <Field className={css.select} as="select" name={name} id={id}>
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {Array.isArray(categories) &&
          categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
      </Field>
      <ErrorMessage className={css.errorMsg} name={name} component="span" />
    </div>
  );
};

export default CategoryAndIngredientsSelect;
