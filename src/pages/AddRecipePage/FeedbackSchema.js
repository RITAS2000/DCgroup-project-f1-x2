import * as Yup from 'yup';

const ingredientItem = Yup.object().shape({
  name: Yup.string().trim().required('Ingredient name is required'),
  measure: Yup.string()
    .trim()
    .max(16, 'Must be at most 16 characters')
    .required('Ingredient amount is required'),
});

export const FeedbackSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .max(64, 'Max 64 characters')
    .required('Title is required'),
  description: Yup.string()
    .trim()
    .max(200, 'Max 200 characters')
    .required('Description is required'),
  time: Yup.number().min(1).max(360).required('Time is required'),
  calories: Yup.number().min(1).max(10000),

  category: Yup.mixed()
    .test('is-valid-category', 'Category is required', function (value) {
      if (typeof value === 'string') return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      return false;
    })
    .required('Category is required'),

  ingredients: Yup.array()
    .of(ingredientItem)
    .min(2, 'At least 2 ingredients required')
    .max(16, 'No more than 16 ingredients')
    .required('Ingredients are required'),

  instructions: Yup.string()
    .trim()
    .max(1200, 'Max 1200 characters')
    .required('Instructions are required'),
});
