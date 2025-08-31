import React, { useEffect, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Select, { components as RS } from 'react-select';
import { BarLoader } from 'react-spinners';

import { fetchCategories } from '../../redux/categorie/operation.js';
import {
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesError,
} from '../../redux/categorie/selectors.js';

import css from './CategorySelect.module.css';

const SPRITE = '/sprite/symbol-defs.svg';
const BRAND = '#3d2218';

const DropdownIndicator = (props) => {
  const { menuIsOpen } = props.selectProps;
  return (
    <RS.DropdownIndicator {...props}>
      <svg
        className={`${css.chevron} ${menuIsOpen ? css.chevronRotated : ''}`}
        width="20"
        height="20"
        aria-hidden="true"
      >
        <use href={`${SPRITE}#icon-chevron-down`} />
      </svg>
    </RS.DropdownIndicator>
  );
};

export default function CategorySelect({ selectedCategory, onChange }) {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoriesLoading);
  const error = useSelector(selectCategoriesError);

  const requestedRef = useRef(false);

  useEffect(() => {
    if (categories?.length) return;

    if (requestedRef.current) return;
    requestedRef.current = true;
    dispatch(fetchCategories());
  }, [dispatch, categories?.length]);

  const options = useMemo(
    () => (categories || []).map((c) => ({ value: c.name, label: c.name })),
    [categories]
  );


  if (loading) {
    return (
      <div className={css.barWrap}>
        <BarLoader color={BRAND} width="100%" height={4} />
      </div>
    );
  }

  if (error) return <span className={css.hint}>Error: {String(error)}</span>;

  return (
    <Select
      className={css.reactSelect}
      classNamePrefix="select"
      placeholder="Category"
      options={options}
      value={
        selectedCategory
          ? { value: selectedCategory, label: selectedCategory }
          : null
      }
      onChange={(opt) => onChange(opt?.value || '')}
      menuPortalTarget={document.body}
      menuPosition="absolute"
      menuPlacement="auto"
      components={{ IndicatorSeparator: null, DropdownIndicator }}
      isClearable={false}
    />
  );
}

};


