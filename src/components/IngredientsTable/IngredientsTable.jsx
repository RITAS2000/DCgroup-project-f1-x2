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
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 16.3846L12 9.80769M4.875 7.06731H6.51923M19.125 7.06731H17.4808M14.7404 7.06731H9.25962M14.7404 7.06731V5.97115C14.7404 5.36576 14.2496 4.875 13.6442 4.875H10.3558C9.75038 4.875 9.25962 5.36576 9.25962 5.97115V7.06731M14.7404 7.06731H17.4808M9.25962 7.06731H6.51923M17.4808 7.06731V16.9327C17.4808 18.1435 16.4992 19.125 15.2885 19.125H8.71154C7.50076 19.125 6.51923 18.1435 6.51923 16.9327V7.06731"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
