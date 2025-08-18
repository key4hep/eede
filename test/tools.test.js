import { infoMsg, warningMsg, errorMsg } from "../js/lib/messages.js";

let msgDiv;

beforeEach(() => {
  document.body.innerHTML = "<div id='input-message'></div>";
  msgDiv = document.getElementById("input-message");
});

describe("infoMsg", () => {
  it("should add a message to the input-message div", () => {
    infoMsg("Test message");

    expect(msgDiv.classList.contains("mb-20")).toBe(true);
    expect(msgDiv.style.color).toBe("gray");
    expect(msgDiv.innerHTML).toBe("<p>Info: Test message</p>");
  });
});

describe("warningMsg", () => {
  it("should add a warning message to the input-message div", () => {
    warningMsg("Test warning message");

    expect(msgDiv.classList.contains("mb-20")).toBe(true);
    expect(msgDiv.style.color).toBe("orange");
    expect(msgDiv.innerHTML).toBe("<p>Warning: Test warning message</p>");
  });
});

describe("errorMsg", () => {
  it("should add an error message to the input-message div", () => {
    errorMsg("Test error message");

    expect(msgDiv.classList.contains("mb-20")).toBe(true);
    expect(msgDiv.style.color).toBe("red");
    expect(msgDiv.innerHTML).toBe("<p>Error: Test error message</p>");
  });
});
