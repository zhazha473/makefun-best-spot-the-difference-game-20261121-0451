// Mouse and keyboard input for Harbourlog. The mouse clicks straight on the
// pictures; the keyboard drives a crosshair cursor with the arrow keys and
// marks with Enter or Space, so the whole game is playable without a mouse.
// The canvas is drawn at a fixed 1280x800 and scaled by CSS, so every pointer
// position is converted back into canvas coordinates before it is used.
import { PANEL_LEFT, PANEL_RIGHT, PANEL_TOP, PANEL_SIZE } from './differences.js';

export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 800;

export class InputTracker {
  constructor(canvas, hooks) {
    this.canvas = canvas;
    this.hooks = hooks;
    this.mouse = { x: CANVAS_WIDTH / 2, y: PANEL_TOP + PANEL_SIZE / 2 };
    this.cursor = { x: CANVAS_WIDTH / 2, y: PANEL_TOP + PANEL_SIZE / 2, keyboard: false };
    this.keys = new Set();
    this.attach();
  }

  toCanvas(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * CANVAS_WIDTH,
      y: ((clientY - rect.top) / rect.height) * CANVAS_HEIGHT,
    };
  }

  attach() {
    this.canvas.addEventListener('pointermove', (event) => {
      const point = this.toCanvas(event.clientX, event.clientY);
      this.mouse = point;
      this.cursor.keyboard = false;
    });
    this.canvas.addEventListener('pointerdown', (event) => {
      const point = this.toCanvas(event.clientX, event.clientY);
      this.mouse = point;
      this.cursor = { x: point.x, y: point.y, keyboard: false };
      this.hooks.onPress(point.x, point.y);
    });
    window.addEventListener('keydown', (event) => {
      const key = event.key;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(key)) {
        event.preventDefault();
      }
      if (event.repeat && key !== 'ArrowUp' && key !== 'ArrowDown' && key !== 'ArrowLeft' && key !== 'ArrowRight') return;
      this.keys.add(key);
      const step = event.shiftKey ? 42 : 14;
      let moved = false;
      if (key === 'ArrowLeft') { this.cursor.x -= step; moved = true; }
      if (key === 'ArrowRight') { this.cursor.x += step; moved = true; }
      if (key === 'ArrowUp') { this.cursor.y -= step; moved = true; }
      if (key === 'ArrowDown') { this.cursor.y += step; moved = true; }
      if (moved) {
        this.cursor.x = Math.max(0, Math.min(CANVAS_WIDTH, this.cursor.x));
        this.cursor.y = Math.max(0, Math.min(CANVAS_HEIGHT, this.cursor.y));
        this.cursor.keyboard = true;
        this.mouse = { x: this.cursor.x, y: this.cursor.y };
        return;
      }
      if (key === 'Enter' || key === ' ') {
        this.cursor.keyboard = true;
        this.hooks.onPress(this.cursor.x, this.cursor.y);
        return;
      }
      this.hooks.onKey(key);
    });
    window.addEventListener('keyup', (event) => {
      this.keys.delete(event.key);
    });
  }
}

// Which panel, if any, a canvas point falls inside, and the point in that
// panel's own 600x600 coordinates. Returns null outside both panels.
export function panelAt(x, y) {
  if (y >= PANEL_TOP && y < PANEL_TOP + PANEL_SIZE) {
    if (x >= PANEL_LEFT.x && x < PANEL_LEFT.x + PANEL_SIZE) {
      return { side: 'left', x: x - PANEL_LEFT.x, y: y - PANEL_TOP };
    }
    if (x >= PANEL_RIGHT.x && x < PANEL_RIGHT.x + PANEL_SIZE) {
      return { side: 'right', x: x - PANEL_RIGHT.x, y: y - PANEL_TOP };
    }
  }
  return null;
}
