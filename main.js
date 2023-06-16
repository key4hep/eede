const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let draggedInfoBox = -1;
let isDragging = false;
let prevMouseX = 0;
let prevMouseY = 0;
let visibleBoxes = [];
let visibleParentLinks = [];
let visibleChildrenLinks = [];

const infoBoxes = [];
const parentLinks = [];
const childrenLinks = [];

const mouseDown = function(event) {
  event.preventDefault();

  const boundigClientRect = canvas.getBoundingClientRect();
  const mouseX = parseInt(event.clientX - boundigClientRect.x);
  const mouseY = parseInt(event.clientY - boundigClientRect.y);

  prevMouseX = mouseX;
  prevMouseY = mouseY;

  for (let i = visibleBoxes.length - 1; i >= 0; i--) {
    if (infoBoxes[visibleBoxes[i]].isHere(mouseX, mouseY)) {
      draggedInfoBox = visibleBoxes[i];
      isDragging = true;
      return;
    }
  }
}

const mouseUp = function(event) {
  if (!isDragging) {
    return;
  }

  event.preventDefault();
  isDragging = false;

  drawAll();
}

const mouseOut = function(event) {
  if (!isDragging) {
    return;
  }

  event.preventDefault();
  isDragging = false;
}

const mouseMove = function(event) {
  if (!isDragging) {
    return;
  }

  event.preventDefault();

  const boundigClientRect = canvas.getBoundingClientRect();
  const mouseX = parseInt(event.clientX - boundigClientRect.x);
  const mouseY = parseInt(event.clientY - boundigClientRect.y);

  const dx = mouseX - prevMouseX;
  const dy = mouseY - prevMouseY;

  const infoBox = infoBoxes[draggedInfoBox];
  infoBox.x += dx;
  infoBox.y += dy;

  drawVisible();

  prevMouseX = mouseX;
  prevMouseY = mouseY;
}

const getVisible = function(event) {
  const boundigClientRect = canvas.getBoundingClientRect();

  visibleBoxes = [];
  for (box of infoBoxes) {
    if (box.isVisible(0 - boundigClientRect.x, 0 - boundigClientRect.y,
                      window.innerWidth, window.innerHeight)) {
      visibleBoxes.push(box.id);
    }
  }

  visibleParentLinks = [];
  for (const boxId of visibleBoxes) {
    for (linkId of infoBoxes[boxId].parentLinks) {
      visibleParentLinks.push(linkId);
    }
  }
  for (link of parentLinks) {
    if (link.isVisible(0 - boundigClientRect.x, 0 - boundigClientRect.y,
                       window.innerWidth, window.innerHeight, infoBoxes)) {
      visibleParentLinks.push(link.id);
    }
  }
  visibleParentLinks = [...new Set(visibleParentLinks)];

  visibleChildrenLinks = [];
  for (const boxId of visibleBoxes) {
    for (linkId of infoBoxes[boxId].childrenLinks) {
      visibleChildrenLinks.push(linkId);
    }
  }
  for (link of childrenLinks) {
    if (link.isVisible(0 - boundigClientRect.x, 0 - boundigClientRect.y,
                       window.innerWidth, window.innerHeight, infoBoxes)) {
      visibleChildrenLinks.push(link.id);
    }
  }
  visibleChildrenLinks = [...new Set(visibleChildrenLinks)];
}

const onScroll = function(event) {
  getVisible();
}

canvas.onmousedown = mouseDown;
canvas.onmouseup = mouseUp;
canvas.onmouseout = mouseOut;
canvas.onmousemove = mouseMove;
window.onscroll = onScroll;

const drawVisible = function() {
  const boundigClientRect = canvas.getBoundingClientRect();
  ctx.clearRect(0 - boundigClientRect.x, 0 - boundigClientRect.y,
                window.innerWidth, window.innerHeight);
  for (const linkId of visibleParentLinks) {
    parentLinks[linkId].draw(ctx, infoBoxes);
  }
  for (const linkId of visibleChildrenLinks) {
    childrenLinks[linkId].draw(ctx, infoBoxes);
  }
  for (const boxId of visibleBoxes) {
    infoBoxes[boxId].draw(ctx);
  }
}

const drawAll = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const link of parentLinks) {
    link.draw(ctx, infoBoxes);
  }
  for (const link of childrenLinks) {
    link.draw(ctx, infoBoxes);
  }
  for (const infoBox of infoBoxes) {
    infoBox.draw(ctx);
  }
}

async function start() {
  await loadMCParticles(infoBoxes, parentLinks, childrenLinks);

  if (!infoBoxes) {
    return;
  }

  // Get How many rows
  const rows = infoBoxes.map(obj => {
    return obj.row;
  });
  const maxRow = Math.max(...rows);

  // Order infoBoxes into rows
  boxRows = [];
  for (let i = 0; i <= maxRow; i++) {
    boxRows.push([]);
  }
  for (const box of infoBoxes) {
    boxRows[box.row].push(box.id);
  }
  const rowWidths = boxRows.map(obj => {
    return obj.length;
  });
  const maxRowWidth = Math.max(...rowWidths);

  const boxWidth = infoBoxes[0].width;
  const boxHeight = infoBoxes[0].height;
  const horizontalGap = boxWidth * 0.4;
  const verticalGap = boxHeight * 0.3;

  canvas.width = boxWidth * maxRowWidth + horizontalGap * (maxRowWidth + 1);
  canvas.height = boxHeight * (maxRow + 1) + verticalGap * (maxRow + 2);

  for (const [i, row] of boxRows.entries()) {
    for (const [j, boxId] of row.entries()) {
      const box = infoBoxes[boxId];

      if (row.length % 2 === 0) {
        const distanceFromCenter = j - row.length / 2;
        if (distanceFromCenter < 0) {
          box.x = canvas.width/2 - boxWidth - horizontalGap/2
                  + (distanceFromCenter + 1) * boxWidth
                  + (distanceFromCenter + 1) * horizontalGap;
        } else {
          box.x = canvas.width/2 + horizontalGap/2 +
                  distanceFromCenter * boxWidth +
                  distanceFromCenter * horizontalGap;
        }
      } else {
        const distanceFromCenter = j - row.length / 2;
        box.x = canvas.width/2 - boxWidth / 2 + distanceFromCenter * boxWidth
                + distanceFromCenter * horizontalGap;
      }
      box.y = i * verticalGap + verticalGap + i * boxHeight;
    }
  }

  for (const box of infoBoxes) {
    box.updateTexImg();
  }

  drawAll();

  getVisible();
};
