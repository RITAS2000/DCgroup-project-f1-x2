import css from './IngredientsTable.module.css';

const IngredientsTable = ({ ingredients, remove }) => {
  return (
    <table className={css.table}>
      <thead className={css.thead}>
        <tr className={css.tr}>
          <th className={css.th}>Name:</th>
          <th className={css.th}>Amount:</th>
          <th className={css.thIcon}></th>
        </tr>
      </thead>
      <tbody className={css.tbody}>
        {ingredients.map((ingredient, index) => (
          <tr className={css.trBody} key={ingredient.id}>
            <td className={css.td}>{ingredient.name}</td>
            <td className={css.td}>{ingredient.measure}</td>
            <td className={css.tdIcon}>
              <button
                className={css.btn}
                type="button"
                onClick={() => remove(index)}
                aria-label="Remove ingredient"
              >
                <svg className={css.deleteIcon} width="24" height="28">
                  <use href="/sprite/symbol-defs.svg#icon-delete"></use>
                </svg>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default IngredientsTable;
