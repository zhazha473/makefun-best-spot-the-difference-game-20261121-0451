// Scene 1 — the harbour at dawn. The keeper's first sketch: a lighthouse,
// a pier, two boats and the morning sun over the water. Difficulty 1: the
// changes are large and plain to see, so a new player learns the hunt here.
import { sceneRandom, range } from './random.js';

export const DIFFS = [
  { x: 470, y: 105, r: 52, name: 'the sun grew long rays' },
  { x: 470, y: 262, r: 30, name: 'a lighthouse stripe turned white' },
  { x: 492, y: 112, r: 24, name: 'the flag now flies the other way' },
  { x: 300, y: 335, r: 36, name: 'the sail turned red' },
  { x: 300, y: 90, r: 22, name: 'a gull flew away' },
  { x: 330, y: 470, r: 26, name: 'the buoy turned green' },
  { x: 212, y: 360, r: 26, name: 'a third crate appeared' },
  { x: 85, y: 398, r: 24, name: 'the rope coil vanished' },
  { x: 470, y: 300, r: 20, name: 'a lighthouse window lit up' },
  { x: 120, y: 70, r: 32, name: 'an extra cloud drifted in' },
];

function drawCloud(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(255, 252, 244, 0.92)';
  ctx.beginPath();
  ctx.ellipse(x, y, 34 * s, 15 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 22 * s, y + 5 * s, 22 * s, 11 * s, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 24 * s, y + 5 * s, 24 * s, 12 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawGull(ctx, x, y, s) {
  ctx.strokeStyle = '#33414d';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 9 * s, y);
  ctx.quadraticCurveTo(x - 3 * s, y - 7 * s, x, y);
  ctx.quadraticCurveTo(x + 3 * s, y - 7 * s, x + 9 * s, y);
  ctx.stroke();
}

function drawLighthouse(ctx, diffs) {
  const cx = 470;
  // Tower.
  ctx.fillStyle = '#fbf6ea';
  ctx.fillRect(cx - 27, 170, 54, 175);
  ctx.strokeStyle = '#2e3a45';
  ctx.lineWidth = 3;
  ctx.strokeRect(cx - 27, 170, 54, 175);
  // Red bands, unless the middle one turned white.
  ctx.fillStyle = '#b3402e';
  ctx.fillRect(cx - 27, 200, 54, 24);
  if (!diffs.has(1)) ctx.fillRect(cx - 27, 250, 54, 24);
  ctx.fillRect(cx - 27, 305, 54, 24);
  // Gallery and lamp room.
  ctx.fillStyle = '#2e3a45';
  ctx.fillRect(cx - 34, 158, 68, 12);
  ctx.fillStyle = '#f7c948';
  ctx.fillRect(cx - 20, 138, 40, 20);
  ctx.strokeStyle = '#2e3a45';
  ctx.lineWidth = 3;
  ctx.strokeRect(cx - 20, 138, 40, 20);
  ctx.beginPath();
  ctx.moveTo(cx - 24, 138);
  ctx.lineTo(cx, 122);
  ctx.lineTo(cx + 24, 138);
  ctx.closePath();
  ctx.fillStyle = '#2e3a45';
  ctx.fill();
  // Soft beam of light over the water.
  ctx.fillStyle = 'rgba(247, 201, 72, 0.18)';
  ctx.beginPath();
  ctx.moveTo(cx - 18, 150);
  ctx.lineTo(cx + 180, 210);
  ctx.lineTo(cx + 180, 250);
  ctx.lineTo(cx - 18, 162);
  ctx.closePath();
  ctx.fill();
  // Flag on the roof, flying right unless the difference flips it.
  ctx.strokeStyle = '#2e3a45';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, 122);
  ctx.lineTo(cx, 96);
  ctx.stroke();
  ctx.fillStyle = '#b3402e';
  ctx.beginPath();
  if (diffs.has(2)) {
    ctx.moveTo(cx, 98);
    ctx.lineTo(cx - 26, 104);
    ctx.lineTo(cx, 112);
  } else {
    ctx.moveTo(cx, 98);
    ctx.lineTo(cx + 26, 104);
    ctx.lineTo(cx, 112);
  }
  ctx.closePath();
  ctx.fill();
  // Door and windows; the lower window glows when the difference is on.
  ctx.fillStyle = '#2e3a45';
  ctx.fillRect(cx - 10, 315, 20, 30);
  ctx.fillStyle = '#3d5a66';
  ctx.fillRect(cx - 10, 232, 20, 16);
  ctx.fillStyle = diffs.has(8) ? '#f7c948' : '#3d5a66';
  ctx.fillRect(cx - 10, 288, 20, 14);
  ctx.strokeStyle = '#2e3a45';
  ctx.lineWidth = 2;
  ctx.strokeRect(cx - 10, 232, 20, 16);
  ctx.strokeRect(cx - 10, 288, 20, 14);
}

function drawSailboat(ctx, diffs) {
  // Hull.
  ctx.fillStyle = '#7a4a2b';
  ctx.beginPath();
  ctx.moveTo(252, 408);
  ctx.lineTo(348, 408);
  ctx.lineTo(332, 432);
  ctx.lineTo(268, 432);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#2e3a45';
  ctx.lineWidth = 3;
  ctx.stroke();
  // Mast and sail: white with a red band, or all red.
  ctx.beginPath();
  ctx.moveTo(300, 408);
  ctx.lineTo(300, 268);
  ctx.stroke();
  ctx.fillStyle = diffs.has(3) ? '#b3402e' : '#fbf6ea';
  ctx.beginPath();
  ctx.moveTo(300, 272);
  ctx.lineTo(300, 400);
  ctx.lineTo(352, 400);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  if (!diffs.has(3)) {
    ctx.fillStyle = '#b3402e';
    ctx.beginPath();
    ctx.moveTo(300, 372);
    ctx.lineTo(344, 372);
    ctx.lineTo(352, 400);
    ctx.lineTo(300, 400);
    ctx.closePath();
    ctx.fill();
  }
  // Small jib.
  ctx.fillStyle = '#fbf6ea';
  ctx.beginPath();
  ctx.moveTo(296, 280);
  ctx.lineTo(296, 400);
  ctx.lineTo(258, 400);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawPier(ctx, diffs) {
  // Planks and posts.
  ctx.fillStyle = '#8a6a44';
  ctx.fillRect(0, 380, 250, 16);
  ctx.fillStyle = '#75582f';
  for (let x = 0; x < 250; x += 28) ctx.fillRect(x, 380, 3, 16);
  ctx.fillStyle = '#5d4526';
  for (const x of [20, 90, 160, 225]) ctx.fillRect(x - 5, 396, 10, 62);
  ctx.strokeStyle = '#2e3a45';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 380, 250, 16);
  // Crates: two always, a third when the difference is on.
  const crates = [
    { x: 132, y: 352, s: 28 },
    { x: 168, y: 356, s: 24 },
  ];
  if (diffs.has(6)) crates.push({ x: 204, y: 358, s: 22 });
  for (const crate of crates) {
    ctx.fillStyle = '#a97e4f';
    ctx.fillRect(crate.x, crate.y, crate.s, crate.s);
    ctx.strokeStyle = '#2e3a45';
    ctx.lineWidth = 2;
    ctx.strokeRect(crate.x, crate.y, crate.s, crate.s);
    ctx.beginPath();
    ctx.moveTo(crate.x, crate.y);
    ctx.lineTo(crate.x + crate.s, crate.y + crate.s);
    ctx.moveTo(crate.x + crate.s, crate.y);
    ctx.lineTo(crate.x, crate.y + crate.s);
    ctx.stroke();
  }
  // Rope coil, unless it vanished.
  if (!diffs.has(7)) {
    ctx.strokeStyle = '#c9a86a';
    ctx.lineWidth = 4;
    for (const r of [16, 11, 6]) {
      ctx.beginPath();
      ctx.arc(85, 398, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

export function drawPanel(ctx, diffs, seed) {
  const rng = sceneRandom(seed);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, 600, 600);
  ctx.clip();

  // Dawn sky.
  const sky = ctx.createLinearGradient(0, 0, 0, 345);
  sky.addColorStop(0, '#ffe3b3');
  sky.addColorStop(0.55, '#f6d9a8');
  sky.addColorStop(1, '#bcd9e8');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 345);

  // Sun, plain or rayed.
  ctx.fillStyle = '#f7c948';
  ctx.beginPath();
  ctx.arc(470, 105, 40, 0, Math.PI * 2);
  ctx.fill();
  if (diffs.has(0)) {
    ctx.strokeStyle = '#f7c948';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    for (let i = 0; i < 8; i += 1) {
      const angle = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(470 + Math.cos(angle) * 48, 105 + Math.sin(angle) * 48);
      ctx.lineTo(470 + Math.cos(angle) * 66, 105 + Math.sin(angle) * 66);
      ctx.stroke();
    }
  }

  // Clouds, one extra when the difference is on.
  drawCloud(ctx, 120, 70, 1);
  drawCloud(ctx, 250, 48, 0.8);
  drawCloud(ctx, 400, 190, 0.7);
  if (diffs.has(9)) drawCloud(ctx, 120, 70, 1.35);
  drawCloud(ctx, 540, 60, 0.7);

  // Gulls: five fixed spots with a seeded wobble; one flies away.
  const gullSpots = [[150, 150], [215, 105], [300, 90], [385, 140], [250, 185]];
  gullSpots.forEach(([gx, gy], index) => {
    if (index === 2 && diffs.has(4)) return;
    drawGull(ctx, gx + range(rng, -8, 8), gy + range(rng, -6, 6), 1);
  });

  // Distant headland.
  ctx.fillStyle = '#5d7d8c';
  ctx.beginPath();
  ctx.moveTo(0, 345);
  ctx.lineTo(0, 300);
  ctx.quadraticCurveTo(70, 282, 130, 305);
  ctx.quadraticCurveTo(190, 326, 250, 312);
  ctx.lineTo(250, 345);
  ctx.closePath();
  ctx.fill();

  // Sea.
  const sea = ctx.createLinearGradient(0, 345, 0, 600);
  sea.addColorStop(0, '#4d8b99');
  sea.addColorStop(1, '#1f4d5c');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 345, 600, 255);
  // Sun glitter on the water.
  ctx.fillStyle = 'rgba(247, 201, 72, 0.35)';
  for (let i = 0; i < 7; i += 1) {
    const w = 60 - i * 6;
    ctx.fillRect(470 - w / 2, 360 + i * 30, w, 5);
  }
  // Wave strokes.
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 14; i += 1) {
    const y = 370 + i * 16;
    const x = range(rng, 20, 520);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 18, y - 5, x + 38, y);
    ctx.stroke();
  }

  drawLighthouse(ctx, diffs);
  drawPier(ctx, diffs);
  drawSailboat(ctx, diffs);

  // Rowboat.
  ctx.fillStyle = '#4a6b52';
  ctx.beginPath();
  ctx.moveTo(420, 500);
  ctx.lineTo(480, 500);
  ctx.lineTo(470, 516);
  ctx.lineTo(430, 516);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#2e3a45';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Buoy: red and white, or green and white.
  ctx.fillStyle = diffs.has(5) ? '#2f7d5b' : '#b3402e';
  ctx.beginPath();
  ctx.moveTo(330, 448);
  ctx.lineTo(346, 448);
  ctx.lineTo(352, 478);
  ctx.lineTo(324, 478);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fbf6ea';
  ctx.fillRect(328, 458, 20, 8);
  ctx.strokeStyle = '#2e3a45';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(338, 448);
  ctx.lineTo(338, 436);
  ctx.stroke();

  // Ink frame, like a sketchbook page.
  ctx.strokeStyle = '#2e3a45';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, 596, 596);
  ctx.restore();
}
