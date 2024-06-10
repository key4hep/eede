import { createLink } from "../js/types/reconstruction.js";

test("it should create a link", () => {
  const link = createLink(1, 2, { collectionID: 3, index: 4 });
  expect(link.id).toBe(1);
  expect(link.from).toBe(2);
  expect(link.to).toBe(4);
  expect(link.collectionID).toBe(3);
});
