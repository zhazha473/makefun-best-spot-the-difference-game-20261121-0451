// The difference registry and hit-testing for Harbourlog, plus the panel
// geometry every other module shares. Each scene lists ten differences in
// its panel's own 600x600 coordinates; a click counts when it lands inside a
// difference's radius, nearest first, and a difference already found can
// never be found twice.
export const PANEL_SIZE = 600;
export const PANEL_TOP = 100;
export const PANEL_LEFT = { x: 24 };
export const PANEL_RIGHT = { x: 656 };

// Canvas position of a difference's centre on the named panel.
export function diffScreenPosition(diff, side) {
  const origin = side === 'left' ? PANEL_LEFT.x : PANEL_RIGHT.x;
  return { x: origin + diff.x, y: PANEL_TOP + diff.y };
}

// The nearest unfound difference within its radius of a panel point, or -1.
export function hitTest(diffs, found, px, py) {
  let best = -1;
  let bestDistance = Infinity;
  for (let i = 0; i < diffs.length; i += 1) {
    if (found.has(i)) continue;
    const dx = px - diffs[i].x;
    const dy = py - diffs[i].y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance <= diffs[i].r && distance < bestDistance) {
      best = i;
      bestDistance = distance;
    }
  }
  return best;
}

export function foundCount(found) {
  return found.size;
}

export function remainingCount(diffs, found) {
  return diffs.length - found.size;
}

// The first difference still unfound, for the hint system.
export function firstUnfound(diffs, found) {
  for (let i = 0; i < diffs.length; i += 1) {
    if (!found.has(i)) return i;
  }
  return -1;
}
