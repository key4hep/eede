export const togglePDG = async (objects) => {
  const collection = objects.datatypes["edm4hep::MCParticle"].collection;

  const updatePDG = collection.map((object) =>
    object.drawImage(`${object.name}`)
  );

  await Promise.all(updatePDG);
};

export const toggleId = async (objects) => {
  const collection = objects.datatypes["edm4hep::MCParticle"].collection;

  const updateId = collection.map((object) =>
    object.drawImage(`${object.PDG}`)
  );

  await Promise.all(updateId);
};
