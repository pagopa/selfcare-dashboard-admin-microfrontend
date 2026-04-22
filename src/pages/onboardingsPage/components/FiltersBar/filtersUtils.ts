export const parseFilters = (search: string): Filters => {
  const params = new URLSearchParams(search);

  return {
    search: params.get("search") || "",
    productIds: params.get("productIds")?.split(",") || [],
    institutionTypeIds:
      params.get("institutionTypeIds")?.split(",") || [],
    stateIds: params.get("stateIds")?.split(",") || [],
  };
};

export const serializeFilters = (filters: Filters): string => {
  const params = new URLSearchParams();

  if (filters.search) {params.set("search", filters.search);}
  if (filters.productIds.length)
    {params.set("productIds", filters.productIds.join(","));}
  if (filters.institutionTypeIds.length)
    {params.set(
      "institutionTypeIds",
      filters.institutionTypeIds.join(",")
    );}
  if (filters.stateIds.length)
    {params.set("stateIds", filters.stateIds.join(","));}

  return params.toString();
};