import {
  extractOneToManyLinks,
  extractOneToOneLink,
  createLinksManager,
  createGenericLink,
} from "../js/types/reconstruction.js";

test("it should create a generic link", () => {
  const link = createGenericLink(1, 2, { collectionID: 3, index: 4 });
  expect(link.id).toBe(1);
  expect(link.from).toBe(2);
  expect(link.to).toBe(4);
  expect(link.collectionID).toBe(3);
});

test("it should create a links manager", () => {
  const linksManager = createLinksManager(["a", "b"]);
  expect(linksManager).toEqual({ a: [], b: [] });
});

test("it should extract one-to-many links", () => {
  const linksManager = { a: [], b: [] };
  const keys = ["a", "b"];
  const newParticle = { index: 0, a: [], b: [] };
  const particleData = {
    a: [{ collectionID: 1, index: 2 }],
    b: [{ collectionID: 3, index: 4 }],
  };
  const firstLink = createGenericLink(0, 0, { collectionID: 1, index: 2 });
  const secondLink = createGenericLink(0, 0, { collectionID: 3, index: 4 });

  extractOneToManyLinks(linksManager, keys, newParticle, particleData);
  expect(linksManager).toEqual({ a: [firstLink], b: [secondLink] });
  expect(newParticle.a).toEqual([0]);
  expect(newParticle.b).toEqual([0]);
});

test("it should extract one-to-one link", () => {
  const linksManager = { a: [] };
  const key = "a";
  const newParticle = { index: 0, a: [] };
  const particleData = { a: { collectionID: 1, index: 2 } };
  const link = createGenericLink(0, 0, { collectionID: 1, index: 2 });

  extractOneToOneLink(linksManager, key, newParticle, particleData);
  expect(linksManager).toEqual({ a: [link] });
  expect(newParticle.a).toEqual(0);
});
