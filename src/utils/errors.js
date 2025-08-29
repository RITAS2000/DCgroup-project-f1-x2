export const getErrorMessage = (e) =>
  e?.response?.data?.message || e?.message || 'Request failed';
