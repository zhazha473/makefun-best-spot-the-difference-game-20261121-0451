// Scene 4 — the clockmaker's workshop. A wall of clocks, a bench of gears
// and the tick of a dozen pendulums. Difficulty 4: the changes are small
// hands, chains and numerals, easy to walk straight past.
import { sceneRandom, range } from './random.js';

export const DIFFS = [
  { x: 150, y: 140, r: 36, name: 'the wall clock jumped five minutes' },
  { x: 300, y: 130, r: 22, name: 'the cuckoo came out' },
  { x: 200, y: 482, r: 24, name: 'a gear vanished from the bench' },
  { x: 430, y: 300, r: 26, name: 'the pendulum swung the other way' },
  { x: 520, y: 420, r: 26, name: 'the bench lamp switched on' },
  { x: 330, y: 500, r: 20, name: 'a screwdriver handle turned blue' },
  { x: 90, y: 262, r: 22, name: 'an extra book on the shelf' },
  { x: 540, y: 90, r: 18, name: 'a star appeared in the window' },
  { x: 380, y: 205, r: 20, name: 'the pocket watch lost its chain' },
  { x: 480, y: 140, r: 20, name: 'a clock numeral changed' },
];

function drawClockFace(ctx, x, y, r, hourAngle, minuteAngle, numeral) {
  ctx.fillStyle = '#fbf6ea';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2e2a26';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#2e2a26';
  ctx.font = `700 ${Math.round(r * 0.34)}px Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(numeral, x, y - r * 0.55);
  ctx.fillText('VI', x, y + r * 0.55);
  ctx.fillText('III', x + r * 0.55, y);
  ctx.fillText('IX', x - r * 0.55, y);
  ctx.strokeStyle = '#2e2a26';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(hourAngle) * r * 0.5, y + Math.sin(hourAngle) * r * 0.5);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(minuteAngle) * r * 0.8, y + Math.sin(minuteAngle) * r * 0.8);
  ctx.stroke();
  ctx.fillStyle = '#b3402e';
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawGear(ctx, x, y, r, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2;
    const tx = x + Math.cos(angle) * (r + 7);
    const ty = y + Math.sin(angle) * (r + 7);
    ctx.rect(tx - 4, ty - 4, 8, 8);
  }
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fbf6ea';
  ctx.beginPath();
  ctx.arc(x, y, r * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2e2a26';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
}

export function drawPanel(ctx, diffs, seed) {
  const rng = sceneRandom(seed);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, 600, 600);
  ctx.clip();

  // Warm wooden wall.
  ctx.fillStyle = '#8a6a44';
  ctx.fillRect(0, 0, 600, 600);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
  for (let y = 0; y < 600; y += 60) ctx.fillRect(0, y, 600, 3);
  ctx.fillStyle = '#5d4526';
  ctx.fillRect(0, 430, 600, 170);

  // Window with night sky, and a star that can appear.
  ctx.fillStyle = '#1b2340';
  ctx.fillRect(500, 40, 80, 110);
  ctx.strokeStyle = '#2e2a26';
  ctx.lineWidth = 3;
  ctx.strokeRect(500, 40, 80, 110);
  ctx.beginPath();
  ctx.moveTo(540, 40);
  ctx.lineTo(540, 150);
  ctx.moveTo(500, 95);
  ctx.lineTo(580, 95);
  ctx.stroke();
  ctx.fillStyle = '#f7efdd';
  ctx.beginPath();
  ctx.arc(520, 60, 12, 0, Math.PI * 2);
  ctx.fill();
  if (diffs.has(7)) {
    ctx.fillStyle = '#f7c948';
    ctx.beginPath();
    ctx.moveTo(540, 78);
    ctx.lineTo(542, 84);
    ctx.lineTo(548, 84);
    ctx.lineTo(543, 88);
    ctx.lineTo(545, 94);
    ctx.lineTo(540, 90);
    ctx.lineTo(535, 94);
    ctx.lineTo(537, 88);
    ctx.lineTo(532, 84);
    ctx.lineTo(538, 84);
    ctx.closePath();
    ctx.fill();
  }

  // Shelf with books, one extra when the difference is on.
  ctx.fillStyle = '#5d4526';
  ctx.fillRect(40, 280, 180, 12);
  const bookColours = ['#b3402e', '#2f7d5b', '#3d6f9e', '#c98a1b'];
  const bookCount = diffs.has(6) ? 5 : 4;
  for (let i = 0; i < bookCount; i += 1) {
    ctx.fillStyle = bookColours[i % 4];
    ctx.fillRect(52 + i * 30, 238 - (i === 4 ? 8 : 0), 24, 42 + (i === 4 ? 8 : 0));
    ctx.strokeStyle = '#2e2a26';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(52 + i * 30, 238 - (i === 4 ? 8 : 0), 24, 42 + (i === 4 ? 8 : 0));
  }

  // The big wall clock: 3:00, or 3:05 when the difference is on.
  const minuteAngle = diffs.has(0) ? -Math.PI / 2 + (5 / 60) * Math.PI * 2 : -Math.PI / 2;
  drawClockFace(ctx, 150, 140, 62, 0, minuteAngle, 'XII');

  // Cuckoo clock: the bird stays in, or pops out.
  ctx.fillStyle = '#6b4a2a';
  ctx.beginPath();
  ctx.moveTo(300, 90);
  ctx.lineTo(340, 90);
  ctx.lineTo(340, 150);
  ctx.lineTo(320, 170);
  ctx.lineTo(300, 150);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#2e2a26';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#fbf6ea';
  ctx.beginPath();
  ctx.arc(320, 122, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = '#2e2a26';
  ctx.beginPath();
  ctx.moveTo(320, 122);
  ctx.lineTo(320, 132);
  ctx.stroke();
  if (diffs.has(1)) {
    ctx.fillStyle = '#b3402e';
    ctx.beginPath();
    ctx.ellipse(320, 116, 9, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(328, 112);
    ctx.lineTo(336, 110);
    ctx.lineTo(329, 117);
    ctx.closePath();
    ctx.fill();
  }
  // Pendulum weights under the cuckoo clock.
  ctx.strokeStyle = '#2e2a26';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(312, 170);
  ctx.lineTo(312, 200);
  ctx.moveTo(328, 170);
  ctx.lineTo(328, 190);
  ctx.stroke();

  // Small round clock: its top numeral is XII, or VII.
  drawClockFace(ctx, 480, 140, 34, -1.2, 0.8, diffs.has(9) ? 'VII' : 'XII');

  // Grandfather clock with a swinging pendulum.
  ctx.fillStyle = '#5d3a22';
  ctx.fillRect(400, 200, 60, 230);
  ctx.strokeStyle = '#2e2a26';
  ctx.lineWidth = 3;
  ctx.strokeRect(400, 200, 60, 230);
  ctx.fillStyle = '#fbf6ea';
  ctx.beginPath();
  ctx.arc(430, 235, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#2e2a26';
  ctx.beginPath();
  ctx.arc(430, 235, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2e2a26';
  ctx.lineWidth = 2;
  const swing = diffs.has(3) ? 0.35 : -0.35;
  ctx.beginPath();
  ctx.moveTo(430, 270);
  ctx.lineTo(430 + Math.sin(swing) * 60, 270 + Math.cos(swing) * 60);
  ctx.stroke();
  ctx.fillStyle = '#c98a1b';
  ctx.beginPath();
  ctx.arc(430 + Math.sin(swing) * 60, 270 + Math.cos(swing) * 60, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2e2a26';
  ctx.stroke();

  // Pocket watch hanging from a nail, chain or no chain.
  ctx.fillStyle = '#c98a1b';
  ctx.beginPath();
  ctx.arc(380, 205, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2e2a26';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#fbf6ea';
  ctx.beginPath();
  ctx.arc(380, 205, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = '#2e2a26';
  ctx.beginPath();
  ctx.moveTo(380, 205);
  ctx.lineTo(380, 196);
  ctx.moveTo(380, 205);
  ctx.lineTo(388, 209);
  ctx.stroke();
  if (!diffs.has(8)) {
    ctx.beginPath();
    ctx.moveTo(380, 187);
    ctx.lineTo(380, 160);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(380, 156, 4, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Workbench.
  ctx.fillStyle = '#a97e4f';
  ctx.fillRect(0, 440, 600, 22);
  ctx.fillStyle = '#8a6a44';
  ctx.fillRect(0, 462, 600, 138);
  ctx.strokeStyle = '#2e2a26';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 440, 600, 22);

  // Gears on the bench: three always, a fourth spot empty when the difference is on.
  drawGear(ctx, 120, 482, 20, '#c98a1b');
  drawGear(ctx, 165, 495, 14, '#8a8a8a');
  if (!diffs.has(2)) drawGear(ctx, 200, 482, 16, '#b3402e');
  drawGear(ctx, 430, 495, 14, '#8a8a8a');

  // Tools: a hammer and a screwdriver whose handle can turn blue.
  ctx.fillStyle = '#5d4526';
  ctx.fillRect(280, 480, 6, 44);
  ctx.fillStyle = '#8a8a8a';
  ctx.fillRect(268, 472, 30, 14);
  ctx.strokeStyle = '#2e2a26';
  ctx.lineWidth = 2;
  ctx.strokeRect(268, 472, 30, 14);
  ctx.fillStyle = diffs.has(5) ? '#3d6f9e' : '#b3402e';
  ctx.fillRect(322, 486, 16, 34);
  ctx.fillStyle = '#c8c8c8';
  ctx.fillRect(325, 470, 10, 18);
  ctx.strokeStyle = '#2e2a26';
  ctx.strokeRect(322, 486, 16, 34);

  // Bench lamp: off, or glowing.
  ctx.strokeStyle = '#2e2a26';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(520, 520);
  ctx.lineTo(520, 460);
  ctx.lineTo(545, 440);
  ctx.stroke();
  if (diffs.has(4)) {
    ctx.fillStyle = 'rgba(247, 201, 72, 0.3)';
    ctx.beginPath();
    ctx.arc(548, 438, 34, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = diffs.has(4) ? '#f7c948' : '#3d5a66';
  ctx.beginPath();
  ctx.moveTo(540, 424);
  ctx.lineTo(566, 424);
  ctx.lineTo(560, 446);
  ctx.lineTo(546, 446);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#2e2a26';
  ctx.fillRect(505, 516, 30, 8);

  // A few screws scattered on the bench.
  ctx.fillStyle = '#8a8a8a';
  for (let i = 0; i < 5; i += 1) {
    const sx = range(rng, 60, 560);
    const sy = range(rng, 545, 575);
    ctx.beginPath();
    ctx.arc(sx, sy, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = '#2e2a26';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, 596, 596);
  ctx.restore();
}
