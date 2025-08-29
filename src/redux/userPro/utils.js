export const normalizeListResponse = (payload) => {
  const box = payload?.data ?? payload;
  const list = box?.data ?? box?.recipes ?? box?.items ?? [];

  const totalPages = box?.totalPages ?? box?.data?.totalPages;
  const totalItems = box?.totalItems ?? box?.data?.totalItems ?? list.length;

  return { list, totalPages, totalItems };
};

export const resolveTotalPages = (tpFromApi, totalItems, limit = 12) => {
  const safeLimit = Number(limit) || 12;
  return typeof tpFromApi === 'number' && tpFromApi > 0
    ? tpFromApi
    : Math.max(1, Math.ceil(totalItems / safeLimit));
};
