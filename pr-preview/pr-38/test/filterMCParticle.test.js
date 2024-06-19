import { reconnect } from "../js/menu/filter/reconnect.js";
import { loadObjects } from "../js/types/load.js";
import {
  Range,
  Checkbox,
  buildCriteriaFunction,
} from "../js/menu/filter/parameters.js";
import { CheckboxBuilder } from "../js/menu/filter/builders.js";

let objects = {};

const data = {
  "Event 0": {
    "Collection": {
      "collType": "edm4hep::MCParticleCollection",
      "collection": [
        {
          "momentum": 0,
          "charge": 0,
          "mass": 0,
          "simStatus": 70,
          "parents": [],
          "daughters": [
            {
              "collectionID": 0,
              "index": 1,
            },
          ],
        },
        {
          "momentum": 100,
          "charge": 1,
          "mass": 10,
          "simStatus": 24,
          "daughters": [
            {
              "collectionID": 0,
              "index": 3,
            },
          ],
          "parents": [
            {
              "collectionID": 0,
              "index": 0,
            },
          ],
        },
        {
          "momentum": 200,
          "charge": 2,
          "mass": 20,
          "simStatus": 25,
          "daughters": [
            {
              "collectionID": 0,
              "index": 4,
            },
          ],
          "parents": [
            {
              "collectionID": 0,
              "index": 0,
            },
          ],
        },
        {
          "momentum": 300,
          "charge": 3,
          "mass": 30,
          "simStatus": 26,
          "daughters": [
            {
              "collectionID": 0,
              "index": 4,
            },
          ],
          "parents": [
            {
              "collectionID": 0,
              "index": 1,
            },
          ],
        },
        {
          "momentum": 400,
          "charge": 4,
          "mass": 40,
          "simStatus": 27,
          "parents": [
            {
              "collectionID": 0,
              "index": 2,
            },
            {
              "collectionID": 0,
              "index": 3,
            },
          ],
          "daughters": [],
        },
      ],
    },
  },
};

beforeAll(() => {
  objects = loadObjects(data, 0, ["edm4hep::MCParticle"]);
});

describe("filter by ranges", () => {
  it("filter by a single range parameter", () => {
    const momentum = new Range({
      property: "momentum",
      unit: "GeV",
    });
    momentum.min = 300;
    momentum.max = 1000;
    const rangeFilters = Range.buildFilter([momentum]);
    const criteriaFunction = buildCriteriaFunction(rangeFilters);

    const filteredObjects = reconnect(criteriaFunction, objects);

    expect(
      filteredObjects["edm4hep::MCParticle"].collection.map(
        (mcParticle) => mcParticle.id
      )
    ).toEqual([3, 4]);
  });

  it("filter by a combination of ranges", () => {
    const charge = new Range({
      property: "charge",
      unit: "e",
    });
    charge.min = 3;
    const mass = new Range({
      property: "mass",
      unit: "GeV",
    });
    mass.min = 20;
    mass.max = 40;
    const rangeFilters = Range.buildFilter([mass, charge]);
    const criteriaFunction = buildCriteriaFunction(rangeFilters);

    const filteredObjects = reconnect(criteriaFunction, objects);

    expect(
      filteredObjects["edm4hep::MCParticle"].collection.map(
        (mcParticle) => mcParticle.id
      )
    ).toEqual([3, 4]);
  });
});

describe("filter by checkboxes", () => {
  it("filter by a single checkbox", () => {
    const simulatorStatus = new Checkbox("simStatus", 23);
    simulatorStatus.checked = true;
    const checkboxFilters = Checkbox.buildFilter([simulatorStatus]);
    const criteriaFunction = buildCriteriaFunction(checkboxFilters);

    const filteredObjects = reconnect(criteriaFunction, objects);

    expect(
      filteredObjects["edm4hep::MCParticle"].collection.map(
        (mcParticle) => mcParticle.id
      )
    ).toEqual([]);
  });

  it("filter by a combination of checkboxes", () => {
    const simulatorStatus1 = new Checkbox("simStatus", 23);
    simulatorStatus1.checked = true;
    const simulatorStatus2 = new Checkbox("simStatus", 26);
    simulatorStatus2.checked = true;
    const simulatorStatus3 = new Checkbox("simStatus", 27);
    simulatorStatus3.checked = true;
    const checkboxFilters = Checkbox.buildFilter([
      simulatorStatus1,
      simulatorStatus2,
      simulatorStatus3,
    ]);
    const criteriaFunction = buildCriteriaFunction(checkboxFilters);

    const filteredObjects = reconnect(criteriaFunction, objects);

    expect(
      filteredObjects["edm4hep::MCParticle"].collection.map(
        (mcParticle) => mcParticle.id
      )
    ).toEqual([]);
  });
});

describe("filter by ranges and checkboxes", () => {
  it("show all particles when no kind of filter is applied", () => {
    const charge = new Range({
      property: "charge",
      unit: "e",
    });
    const simulatorStatus = new Checkbox("simStatus", 26);
    const rangeFilters = Range.buildFilter([charge]);
    const checkboxFilters = Checkbox.buildFilter([simulatorStatus]);
    const criteriaFunction = buildCriteriaFunction(
      rangeFilters,
      checkboxFilters
    );

    const filteredObjects = reconnect(criteriaFunction, objects);

    expect(
      filteredObjects["edm4hep::MCParticle"].collection.map(
        (mcParticle) => mcParticle.id
      )
    ).toEqual([0, 1, 2, 3, 4]);
  });

  it("filter by a combination of ranges and checkboxes", () => {
    const charge = new Range({
      property: "charge",
      unit: "e",
    });
    charge.max = 3;
    const simulatorStatus = new Checkbox("simStatus", 23);
    simulatorStatus.checked = true;
    const rangeFilters = Range.buildFilter([charge]);
    const checkboxFilters = Checkbox.buildFilter([simulatorStatus]);
    const criteriaFunction = buildCriteriaFunction(
      rangeFilters,
      checkboxFilters
    );

    const filteredObjects = reconnect(criteriaFunction, objects);

    expect(
      filteredObjects["edm4hep::MCParticle"].collection.map(
        (mcParticle) => mcParticle.id
      )
    ).toEqual([]);
  });
});
