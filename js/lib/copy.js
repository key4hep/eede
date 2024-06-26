export function copyObject(objToCopy, updatedObject) {
  for (const [key, value] of Object.entries(objToCopy)) {
    updatedObject[key] = value;
  }
}

export function emptyCopyObject(objToCopy, updatedObject) {
  updatedObject.datatypes = {};

  for (const [objectType, elements] of Object.entries(objToCopy.datatypes)) {
    const { _, oneToMany, oneToOne } = elements;

    updatedObject.datatypes[objectType] = {
      collection: [],
      oneToMany: {},
      oneToOne: {},
    };

    for (const name in oneToMany) {
      updatedObject.datatypes[objectType].oneToMany[name] = [];
    }

    for (const name in oneToOne) {
      updatedObject.datatypes[objectType].oneToOne[name] = [];
    }
  }

  updatedObject.associations = {};

  for (const key in objToCopy.associations) {
    updatedObject.associations[key] = [];
  }
}
