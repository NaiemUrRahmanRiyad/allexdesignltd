export function mobileViewportState({ width, height, layoutHeight, baselineHeight, offsetTop = 0, editable = false }) {
  const visibleHeight = Math.max(1, Number.isFinite(height) ? height : layoutHeight);
  return {
    mobile: width <= 1024,
    height: Math.round(visibleHeight),
    top: Math.max(0, Math.round(offsetTop)),
    keyboard: width <= 1024 && editable && Math.max(layoutHeight, baselineHeight) - visibleHeight > 100,
  };
}
