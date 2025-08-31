import React, { useEffect, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Select, { components as RS } from 'react-select';
import { BarLoader } from 'react-spinners';

import { fetchIngredients } from '../../redux/ingredient/operations.js';
import {
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError,
} from '../../redux/ingredient/selectors.js';

import css from './IngredientsSelect.module.css';

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

export default function IngredientsSelect({ selectedIngredient, onChange }) {
  const dispatch = useDispatch();
  const ingredients = useSelector(selectIngredients);
  const loading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);

  const requestedRef = useRef(false);

  useEffect(() => {
    if (ingredients?.length) return;
    if (requestedRef.current) return;
    requestedRef.current = true;
    dispatch(fetchIngredients());
  }, [dispatch, ingredients?.length]);

  const options = useMemo(
    () => (ingredients || []).map((i) => ({ value: i._id, label: i.name })),
    [ingredients]
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
      placeholder="Ingredient"
      options={options}
      value={
        selectedIngredient
          ? options.find((o) => o.value === selectedIngredient) || null
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
