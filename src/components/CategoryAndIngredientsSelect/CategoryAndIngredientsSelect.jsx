import { ErrorMessage, useField } from 'formik';
import Select, { components } from 'react-select';
import css from './CategoryAndIngredientsSelect.module.css';

const SPRITE = '/sprite/symbol-defs.svg';

const CategoryAndIngredientsSelect = ({
  categories,
  placeholder,
  name,
  id,
}) => {
  const [field, meta, helpers] = useField(name);

  const options =
    categories?.map((category) => ({
      value: category.name,
      label: category.name,
    })) || [];

  const DropdownIndicator = (props) => {
    const isMenuOpen = props.selectProps.menuIsOpen;
    return (
      <components.DropdownIndicator {...props}>
        <div
          className={`${css.dropdownIconWrapper} ${isMenuOpen ? css.open : ''}`}
        >
          <svg className={css.dropdownIcon} width="24" height="24">
            <use href={`${SPRITE}#icon-chevron-down`} />
          </svg>
        </div>
      </components.DropdownIndicator>
    );
  };

  return (
    <div className={css.selectWrapper}>
      <Select
        inputId={id}
        name={name}
        placeholder={placeholder}
        options={options}
        value={options.find((opt) => opt.value === field.value) || null}
        onChange={(selectedOption) =>
          helpers.setValue(selectedOption?.value || '')
        }
        onBlur={() => helpers.setTouched(true)}
        classNamePrefix="customSelect"
        components={{ DropdownIndicator }}
      />
      <ErrorMessage name={name} component="span" className={css.errorMsg} />
    </div>
  );
};

export default CategoryAndIngredientsSelect;
