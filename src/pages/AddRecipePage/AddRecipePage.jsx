import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import { useId, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import css from './AddRecipePage.module.css';
import { FeedbackSchema } from './FeedbackSchema.js';
import CategoryAndIngredientsSelect from '../../components/CategoryAndIngredientsSelect/CategoryAndIngredientsSelect.jsx';
// import categories from './categoriesTemp.json';
// import ingredients from './ingredientsTemp.json';
import IngredientsTable from '../../components/IngredientsTable/IngredientsTable.jsx';
import { addRecipe } from '../../redux/addRecipe/operations.js';
import Container from '../../components/Container/Container.jsx';

import { fetchCategories } from '../../redux/categorie/operation.js';
import { selectCategories } from '../../redux/categorie/selectors.js';
import { fetchIngredients } from '../../redux/ingredient/operations.js';
import { selectIngredients } from '../../redux/ingredient/selectors.js';
import { openModal } from '../../redux/modal/slice.js';

const useIsTabletOrAbove = () => {
  return useMediaQuery({ query: '(min-width: 768px)' });
};

const AddRecipePage = () => {
  const photoId = useId();
  const titleFieldId = useId();
  const descriptionFieldId = useId();
  const timeFieldId = useId();
  const caloriesFieldId = useId();
  const categoryFieldId = useId();
  const ingredientsNameFieldId = useId();
  const amountFieldId = useId();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isTabletOrAbove = useIsTabletOrAbove();

  const categories = useSelector(selectCategories);
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchIngredients());
  }, [dispatch]);

  const initialValues = {
    thumb: null,
    title: '',
    description: '',
    time: '',
    calories: '',
    category: '',
    ingredientsName: '',
    measure: '',
    ingredients: [],
    instructions: '',
  };

  const handleSubmit = async (values, actions) => {
    const formData = new FormData();

    const sanitizedIngredients = values.ingredients.map(
      ({ name, measure }) => ({
        name,
        measure,
      }),
    );

    for (const key in values) {
      if (key === 'ingredients') {
        formData.append(key, JSON.stringify(sanitizedIngredients));
      } else if (key === 'thumb' && values.thumb) {
        formData.append(key, values.thumb); // File
      } else if (key !== 'ingredientsName' && key !== 'measure') {
        formData.append(key, values[key]);
      }
    }
    try {
      const result = await dispatch(addRecipe(formData)).unwrap();
      toast.success('Recipe added successfully!');
      actions.resetForm();
      navigate(`/recipes/${result.data._id}`);
    } catch {
      toast.error('Failed to add recipe. Please try again.');
    }
  };

  return (
    <div className={css.container}>
      <Container variant="transparent">
        <h2 className={css.mainTitle}>Add Recipe</h2>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          onSubmit={handleSubmit}
          validationSchema={FeedbackSchema}
        >
          {({ values, setFieldValue }) => (
            <Form className={css.form}>
              <div className={css.photoWrapper}>
                <h3 className={`${css.subtitle} ${css.photoTitle}`}>
                  Upload Photo
                </h3>
                <input
                  id={photoId}
                  name="thumb"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    setFieldValue('thumb', event.currentTarget.files[0]);
                  }}
                  className={css.hiddenInput}
                />

                <label htmlFor={photoId} className={css.uploadBox}>
                  {values.thumb ? (
                    <img
                      src={URL.createObjectURL(values.thumb)}
                      alt="Preview"
                      className={css.previewImage}
                    />
                  ) : (
                    <div className={css.placeholder}>
                      <svg className={css.photoIcon} width="82" height="82">
                        <use href="/sprite/symbol-defs.svg#icon-photo"></use>
                      </svg>
                    </div>
                  )}
                </label>
                <ErrorMessage
                  className={css.errorMsg}
                  name="thumb"
                  component="span"
                />
              </div>
              <div className={css.withoutPhotoWrapper}>
                <fieldset className={css.fieldset}>
                  <legend className={css.subtitle}>General Information</legend>
                  <div className={css.titleWrapper}>
                    <label className={css.label} htmlFor={titleFieldId}>
                      Recipe Title
                    </label>
                    <Field
                      className={css.input}
                      type="text"
                      name="title"
                      id={titleFieldId}
                      placeholder="Enter the name of your recipe"
                    />
                    <ErrorMessage
                      className={css.errorMsg}
                      name="title"
                      component="span"
                    />
                  </div>

                  <div className={css.descrWrapper}>
                    <label className={css.label} htmlFor={descriptionFieldId}>
                      Recipe Description
                    </label>
                    <Field
                      as="textarea"
                      className={css.textarea}
                      name="description"
                      id={descriptionFieldId}
                      placeholder="Enter a brief description of your recipe"
                    />
                    <ErrorMessage
                      className={css.errorMsg}
                      name="description"
                      component="span"
                    />
                  </div>

                  <div className={css.timeWrapper}>
                    <label className={css.label} htmlFor={timeFieldId}>
                      Cooking time in minutes
                    </label>
                    <Field
                      className={css.input}
                      type="number"
                      name="time"
                      id={timeFieldId}
                      placeholder="10"
                    />
                    <ErrorMessage
                      className={css.errorMsg}
                      name="time"
                      component="span"
                    />
                  </div>

                  <div className={css.calorCategWrapper}>
                    <div className={css.calorWrapper}>
                      <label className={css.label} htmlFor={caloriesFieldId}>
                        Calories
                      </label>
                      <Field
                        className={css.calorCategInput}
                        type="number"
                        name="calories"
                        id={caloriesFieldId}
                        placeholder="150"
                      />
                      <ErrorMessage
                        className={css.errorMsg}
                        name="calories"
                        component="span"
                      />
                    </div>

                    <div className={css.categoryWrapper}>
                      <label className={css.label} htmlFor={categoryFieldId}>
                        Category
                      </label>
                      <CategoryAndIngredientsSelect
                        categories={categories}
                        placeholder="Soup"
                        name="category"
                        id={categoryFieldId}
                      />
                    </div>
                  </div>
                </fieldset>

                <fieldset className={css.ingredientsFieldset}>
                  <legend className={css.subtitleIngredients}>
                    Ingredients
                  </legend>
                  <div className={css.ingredientsAmountWrapper}>
                    <div className={css.ingredientsWrapper}>
                      <label
                        className={css.label}
                        htmlFor={ingredientsNameFieldId}
                      >
                        Name
                      </label>
                      <CategoryAndIngredientsSelect
                        categories={ingredients}
                        placeholder="Broccoli"
                        name="ingredientsName"
                        id={ingredientsNameFieldId}
                      />
                    </div>

                    <div className={css.amountWrapper}>
                      <label className={css.label} htmlFor={amountFieldId}>
                        Amount
                      </label>
                      <Field
                        className={css.input}
                        type="text"
                        name="measure"
                        id={amountFieldId}
                        placeholder="100g"
                      />
                      <ErrorMessage
                        className={css.errorMsg}
                        name="measure"
                        component="span"
                      />
                    </div>
                  </div>

                  <FieldArray className={css.ingredientsArr} name="ingredients">
                    {({ push, remove }) => (
                      <div className={css.btnAndTableWrapper}>
                        <button
                          className={css.ingredientsBtn}
                          type="button"
                          onClick={() => {
                            const name = values.ingredientsName.trim();
                            const measure = values.measure.trim();

                            const selectedIngredient = ingredients.find(
                              (ing) => ing.name === name,
                            );

                            push({ id: selectedIngredient._id, name, measure });
                            setFieldValue('ingredientsName', '');
                            setFieldValue('measure', '');
                          }}
                        >
                          Add new Ingredient
                        </button>

                        {(values.ingredients.length > 0 || isTabletOrAbove) && (
                          <IngredientsTable
                            ingredients={values.ingredients}
                            remove={remove}
                          />
                        )}
                        <ErrorMessage
                          className={css.errorMsg}
                          name="ingredients"
                          component="span"
                        />
                      </div>
                    )}
                  </FieldArray>
                </fieldset>

                <div className={css.instructWrapper}>
                  <h3 className={css.subtitle}>Instructions</h3>
                  <Field
                    as="textarea"
                    className={css.textarea}
                    name="instructions"
                    placeholder="Enter a text"
                  />
                  <ErrorMessage
                    className={css.errorMsg}
                    name="instructions"
                    component="span"
                  />
                </div>
                <div className={css.btnWrapper}>
                  <button
                    className={css.btn}
                    type="submit"
                    onClick={() => dispatch(openModal({ type: 'recipeSaved' }))}
                  >
                    Publish Recipe
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Container>
    </div>
  );
};

export default AddRecipePage;
