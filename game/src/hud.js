// The heads-up display for Harbourlog: the top bar with the logbook title,
// the big "N LEFT" counter, the shrinking time bar, score and streak, and the
// footer with the hint and sound buttons plus the controls legend. Everything
// is drawn on the canvas so the screenshots carry the whole game.
import { PANEL_LEFT, PANEL_RIGHT, PANEL_SIZE, PANEL_TOP } from './differences.js';

export const HINT_BUTTON = { x: 24, y: 722, w: 168, h: 56 };
export const MUTE_BUTTON = { x: 204, y: 722, w: 168, h: 56 };
export const NEXT_BUTTON = { x: 490, y: 560, w: 300, h: 56 };

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// The top bar: title left, the remaining counter and time bar in the middle,
// score and streak on the right.
export function drawHeader(ctx, state, scene) {
  ctx.save();
  ctx.fillStyle = '#f7efdd';
  ctx.fillRect(0, 0, 1280, 80);
  ctx.fillStyle = '#2e3a45';
  ctx.fillRect(0, 78, 1280, 2);

  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#1d2b33';
  ctx.font = '700 30px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText('HARBOURLOG', 24, 36);
  ctx.font = 'italic 14px Georgia, serif';
  ctx.fillStyle = '#5c6a70';
  ctx.fillText('the keeper\u2019s logbook \u2014 spot what changed', 24, 60);

  const remaining = scene.diffs.length - state.found.size;
  ctx.textAlign = 'center';
  ctx.fillStyle = remaining === 0 ? '#1e7d4f' : '#a33b1f';
  ctx.font = '800 34px Georgia, serif';
  ctx.fillText(remaining === 0 ? 'ALL FOUND!' : `${remaining} LEFT`, 640, 38);
  ctx.font = '13px Georgia, serif';
  ctx.fillStyle = '#5c6a70';
  ctx.fillText(`FOUND ${state.found.size} OF ${scene.diffs.length}`, 640, 60);

  // The time bar: a shrinking band under the counter, so the pressure is
  // visible in every frame.
  const barX = 470;
  const barW = 340;
  const barY = 66;
  const fraction = Math.max(0, state.timeLeft / state.timeLimit);
  ctx.fillStyle = '#d8cdb4';
  roundRect(ctx, barX, barY, barW, 10, 5);
  ctx.fill();
  ctx.fillStyle = fraction > 0.35 ? '#2f7d5b' : fraction > 0.15 ? '#c98a1b' : '#a33b1f';
  if (fraction > 0) {
    roundRect(ctx, barX, barY, Math.max(10, barW * fraction), 10, 5);
    ctx.fill();
  }
  ctx.fillStyle = '#1d2b33';
  ctx.font = '700 13px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.fillText(`\u23f1 ${formatTime(state.timeLeft)}`, barX + barW + 10, 75);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#1d2b33';
  ctx.font = '700 20px Georgia, serif';
  ctx.fillText(`SCORE ${state.score.toLocaleString('en-US')}`, 1256, 34);
  ctx.font = '700 15px Georgia, serif';
  ctx.fillStyle = state.streak >= 3 ? '#b0701a' : '#5c6a70';
  ctx.fillText(
    state.streak >= 2 ? `STREAK \u00d7${state.streak}  (+${(state.streak - 1) * 10} bonus)` : 'STREAK \u00d7' + state.streak,
    1256,
    58,
  );
  ctx.restore();
}

// The footer: hint and sound buttons on the left, the controls legend right.
export function drawFooter(ctx, state) {
  ctx.save();
  ctx.fillStyle = '#f7efdd';
  ctx.fillRect(0, 712, 1280, 88);
  ctx.fillStyle = '#2e3a45';
  ctx.fillRect(0, 712, 1280, 2);

  drawButton(ctx, HINT_BUTTON, `HINT  (H)  \u00d7${state.hintsLeft}`, state.hintsLeft > 0);
  drawButton(ctx, MUTE_BUTTON, state.muted ? 'SOUND OFF  (M)' : 'SOUND ON  (M)', true);

  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#5c6a70';
  ctx.font = '14px Georgia, serif';
  ctx.fillText('Click a change, or move with \u2190 \u2191 \u2193 \u2192 and mark with Enter  \u00b7  H hint  \u00b7  N next  \u00b7  R retry  \u00b7  Esc map', 1256, 750);
  ctx.restore();
}

function drawButton(ctx, rect, label, enabled) {
  ctx.save();
  ctx.fillStyle = enabled ? '#1d2b33' : '#9aa5a0';
  roundRect(ctx, rect.x, rect.y, rect.w, rect.h, 10);
  ctx.fill();
  ctx.fillStyle = '#f7efdd';
  ctx.font = '700 16px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
  ctx.restore();
}

// Small captions over each panel so the judge reads the pair at a glance.
export function drawPanelLabels(ctx, scene) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = '700 13px Georgia, serif';
  ctx.fillStyle = '#5c6a70';
  ctx.fillText('SKETCH \u2014 MORNING', PANEL_LEFT.x + PANEL_SIZE / 2, 94);
  ctx.fillText('SKETCH \u2014 EVENING', PANEL_RIGHT.x + PANEL_SIZE / 2, 94);
  ctx.fillStyle = '#1d2b33';
  ctx.font = 'italic 15px Georgia, serif';
  ctx.fillText(`Scene ${scene.number} of 5 \u2014 ${scene.name}`, 640, 94);
  ctx.restore();
}

// A gold ring around every found difference, drawn on both panels.
export function drawFoundMarkers(ctx, diffs, found, time) {
  ctx.save();
  for (const index of found) {
    const diff = diffs[index];
    const pulse = 1 + 0.03 * Math.sin(time * 2 + index);
    for (const originX of [PANEL_LEFT.x, PANEL_RIGHT.x]) {
      const cx = originX + diff.x;
      const cy = PANEL_TOP + diff.y;
      ctx.beginPath();
      ctx.arc(cx, cy, (diff.r + 7) * pulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(212, 160, 23, 0.16)';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#d4a017';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, (diff.r + 13) * pulse, 0, Math.PI * 2);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(212, 160, 23, 0.55)';
      ctx.stroke();
    }
  }
  ctx.restore();
}

// The hint's pulsing ring around one unfound difference, on both panels.
export function drawHintPulse(ctx, diff, progress) {
  if (!diff) return;
  ctx.save();
  const radius = diff.r + 8 + 10 * Math.sin(progress * Math.PI * 4);
  const alpha = 0.55 + 0.35 * Math.sin(progress * Math.PI * 4);
  for (const originX of [PANEL_LEFT.x, PANEL_RIGHT.x]) {
    ctx.beginPath();
    ctx.arc(originX + diff.x, PANEL_TOP + diff.y, radius, 0, Math.PI * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = `rgba(31, 125, 79, ${alpha.toFixed(2)})`;
    ctx.stroke();
  }
  ctx.restore();
}

// A red X flash where a wrong click landed.
export function drawWrongMark(ctx, mark, age) {
  if (!mark) return;
  ctx.save();
  const alpha = Math.max(0, 1 - age / 0.6);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = '#a33b1f';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  const s = 14;
  ctx.beginPath();
  ctx.moveTo(mark.x - s, mark.y - s);
  ctx.lineTo(mark.x + s, mark.y + s);
  ctx.moveTo(mark.x + s, mark.y - s);
  ctx.lineTo(mark.x - s, mark.y + s);
  ctx.stroke();
  ctx.restore();
}

// The keyboard crosshair cursor.
export function drawCursor(ctx, cursor) {
  if (!cursor.keyboard) return;
  ctx.save();
  ctx.strokeStyle = '#1d2b33';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cursor.x, cursor.y, 13, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cursor.x - 20, cursor.y);
  ctx.lineTo(cursor.x - 6, cursor.y);
  ctx.moveTo(cursor.x + 6, cursor.y);
  ctx.lineTo(cursor.x + 20, cursor.y);
  ctx.moveTo(cursor.x, cursor.y - 20);
  ctx.lineTo(cursor.x, cursor.y - 6);
  ctx.moveTo(cursor.x, cursor.y + 6);
  ctx.lineTo(cursor.x, cursor.y + 20);
  ctx.stroke();
  ctx.fillStyle = '#a33b1f';
  ctx.beginPath();
  ctx.arc(cursor.x, cursor.y, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function pointInRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}
