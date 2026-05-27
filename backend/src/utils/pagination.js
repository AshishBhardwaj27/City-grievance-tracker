const paginate = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const skip = (page - 1) * limit;
  return {
    page,
    limit,
    skip,
    buildMeta: (total) => ({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    }),
  };
};

const buildSort = (query, allowed, def = "createdAt") => {
  const field = allowed.includes(query.sortBy) ? query.sortBy : def;
  return { [field]: query.order === "asc" ? 1 : -1 };
};

export { paginate, buildSort };
