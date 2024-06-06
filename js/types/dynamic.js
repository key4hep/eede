export function dynamicLoad(object, data, ignore = null) {
  let filteredData = {};

  if (ignore !== null) {
    for (const key in data) {
      if (!ignore.has(key)) filteredData[key] = data[key];
    }
  } else {
    filteredData = data;
  }

  for (const [key, value] of Object.entries(filteredData)) {
    object[key] = value;
  }
}
