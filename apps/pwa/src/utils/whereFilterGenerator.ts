export const whereFilterGenerator = (values: any[]) => {
  let where = {};
  function whereGenerator(values: any[]) {
    if (values.length === 0) return {};
    where = {
      ...values[0],
      ...(values.length !== 1 && { _and: whereGenerator(values.slice(1)) }),
    };
    return where;
  }

  return whereGenerator(values);
};
