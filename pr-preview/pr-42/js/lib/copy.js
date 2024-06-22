export function copyObject(objToCopy, updatedObject) {
  for (const [key, value] of Object.entries(objToCopy)) {
    updatedObject[key] = value;
  }
}

export function emptyCopyObject(objToCopy, updatedObject) {
  for (const [objectType, elements] of Object.entries(objToCopy)) {
    const { _, oneToMany, oneToOne } = elements;

    updatedObject[objectType] = {
      collection: [],
      oneToMany: {},
      oneToOne: {},
    };

    for (const name in oneToMany) {
      updatedObject[objectType].oneToMany[name] = [];
    }

    for (const name in oneToOne) {
      updatedObject[objectType].oneToOne[name] = null;
    }
  }
}
