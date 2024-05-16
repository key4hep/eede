import { infoMsg, errorMsg } from "../js/tools";

describe("infoMsg", () => {
  it("should add a message to the input-message div", () => {
    document.body.innerHTML = '<div id="input-message"></div>';

    infoMsg("Test message");
    const msgDiv = document.getElementById("input-message");

    expect(msgDiv.classList.contains("mb-20")).toBe(true);
    expect(msgDiv.style.color).toBe("gray");
    expect(msgDiv.innerHTML).toBe("<p>INFO: Test message</p>");
  });
});

describe("errorMsg", () => {
  document.body.innerHTML = '<div id="input-message"></div>';

  errorMsg("Test error message");
  const msgDiv = document.getElementById("input-message");

  expect(msgDiv.classList.contains("mb-20")).toBe(true);
  expect(msgDiv.style.color).toBe("red");
  expect(msgDiv.innerHTML).toBe("<p>ERROR: Test error message</p>");
});
