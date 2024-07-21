const updateEmpty = (empty, length) => {
  if (length === 0) {
    empty.value = empty.value && true;
  } else {
    empty.value = false;
  }
};

export function checkEmptyObject(obj) {
  const datatypes = obj.datatypes;
  const associations = obj.associations;

  let empty = { value: true };

  Object.values(datatypes).forEach((datatype) => {
    updateEmpty(empty, datatype.collection.length);

    Object.values(datatype.oneToMany).forEach((oneToMany) => {
      updateEmpty(empty, oneToMany.length);
    });

    Object.values(datatype.oneToOne).forEach((oneToOne) => {
      updateEmpty(empty, oneToOne.length);
    });
  });

  Object.values(associations).forEach((association) => {
    updateEmpty(empty, association.length);
  });

  return empty.value;
}
