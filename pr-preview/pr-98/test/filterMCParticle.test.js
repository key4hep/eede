import { loadObjects } from "../js/types/load.js";
import { filterOut } from "../js/filters/filter-out.js";
import data from "./filter.json" with { type: "json" };

let objects = {};

const range = {
  "edm4hep::MCParticle": (object) =>
    object.momentum >= 300 &&
    object.momentum <= 1000 &&
    object.mass >= 20 &&
    object.mass <= 30,
};

const checkboxes = {
  "edm4hep::MCParticle": (object) =>
    object.simulatorStatus === 24 || object.simulatorStatus === 26,
};

const all = {
  "edm4hep::MCParticle": () => true,
};

beforeAll(() => {
  objects = loadObjects(data, 0);
});

test("filter by ranges", () => {
  const ids = filterOut(objects, {}, range);

  expect(ids).toEqual(new Set(["3-0"]));
});

test("filter by property equality", () => {
  const ids = filterOut(objects, {}, checkboxes);

  expect(ids).toEqual(new Set(["1-0", "3-0"]));
});

test("filter by function that allows all objects", () => {
  const ids = filterOut(objects, {}, all);

  expect(ids).toEqual(new Set(["0-0", "1-0", "2-0", "3-0", "4-0"]));
});
