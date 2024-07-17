const target = {};

function onDragMove(event) {
  if (target.element) {
    const dragTarget = target.element;
    dragTarget.parent.toLocal(event.global, null, dragTarget.position);
  }
}

export function onDragStart(element) {
  console.log("onDragStart");
  target.element = element;
  app.stage.on("pointermove", onDragMove);
}

function onDragEnd() {
  if (target.element) {
    app.stage.off("pointermove", onDragMove);
    target.element = null;
  }
}

export function setupEvents(app) {
  app.stage.eventMode = "static";
  app.stage.hitArea = app.screen;
  app.stage.on("pointerup", onDragEnd);
  app.stage.on("pointerupoutside", onDragEnd);
}
