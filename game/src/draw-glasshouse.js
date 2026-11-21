// Scene 3 — the botanical glasshouse. A glass dome full of leaves, orchids
// and butterflies, with sunbeams falling across the stone path. Difficulty 3:
// the changes hide inside the greenery, where one leaf looks like another.
import { sceneRandom, range } from './random.js';

export const DIFFS = [
  { x: 420, y: 180, r: 22, name: 'an extra butterfly appeared' },
  { x: 150, y: 300, r: 24, name: 'an orchid turned white' },
  { x: 480, y: 380, r: 26, name: 'the cactus grew a third arm' },
  { x: 280, y: 450, r: 26, name: 'the watering can lost its rose' },
  { x: 90, y: 150, r: 20, name: 'a vine leaf went missing' },
  { x: 300, y: 120, r: 30, name: 'a glass pane cracked' },
  { x: 200, y: 470, r: 24, name: 'a flowerpot turned blue' },
  { x: 380, y: 90, r: 26, name: 'a sunbeam faded away' },
  { x: 330, y: 540, r: 16, name: 'an extra pebble on the path' },
  { x: 520, y: 300, r: 26, name: 'a fern frond bent the other way' },
];

function drawLeaf(ctx, x, y, angle, length, colour) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(length * 0.4, -length * 0.28, length, 0);
  ctx.quadraticCurveTo(length * 0.4, length * 0.28, 0, 0);
  ctx.fill();
  ctx.restore();
}

function drawButterfly(ctx, x, y, s, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.ellipse(x - 8 * s, y - 5 * s, 9 * s, 6 * s, -0.5, 0, Math.PI * 2);
  ctx.ellipse(x + 8 * s, y - 5 * s, 9 * s, 6 * s, 0.5, 0, Math.PI * 2);
  ctx.ellipse(x - 7 * s, y + 6 * s, 7 * s, 5 * s, 0.5, 0, Math.PI * 2);
  ctx.ellipse(x + 7 * s, y + 6 * s, 7 * s, 5 * s, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2e2a26';
  ctx.fillRect(x - 1.5 * s, y - 8 * s, 3 * s, 16 * s);
}

function drawOrchid(ctx, x, y, petalColour) {
  ctx.strokeStyle = '#2f5d3a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y + 40);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.fillStyle = petalColour;
  for (let i = 0; i < 5; i += 1) {
    const angle = -Math.PI / 2 + (i - 2) * 0.6;
    ctx.beginPath();
    ctx.ellipse(x + Math.cos(angle) * 14, y + Math.sin(angle) * 12, 10, 7, angle, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#f7c948';
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fill();
}

export function drawPanel(ctx, diffs, seed) {
  const rng = sceneRandom(seed);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, 600, 600);
  ctx.clip();

  // Pale sky seen through the glass.
  const sky = ctx.createLinearGradient(0, 0, 0, 420);
  sky.addColorStop(0, '#cfe8d8');
  sky.addColorStop(1, '#eef6e6');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 600);

  // Sunbeams: three shafts of light, one of which can fade away.
  ctx.fillStyle = 'rgba(247, 220, 120, 0.28)';
  const beams = [
    [60, 0, 120, 0, 220, 600, 130, 600],
    [240, 0, 300, 0, 400, 600, 310, 600],
    [360, 0, 410, 0, 520, 600, 440, 600],
  ];
  beams.forEach((beam, i) => {
    if (i === 2 && diffs.has(7)) return;
    ctx.beginPath();
    ctx.moveTo(beam[0], beam[1]);
    ctx.lineTo(beam[2], beam[3]);
    ctx.lineTo(beam[4], beam[5]);
    ctx.lineTo(beam[6], beam[7]);
    ctx.closePath();
    ctx.fill();
  });

  // The glass dome: an arch of panes with dark ribs.
  ctx.strokeStyle = '#3d5a66';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(20, 420);
  ctx.quadraticCurveTo(20, 60, 300, 60);
  ctx.quadraticCurveTo(580, 60, 580, 420);
  ctx.stroke();
  ctx.lineWidth = 2;
  for (let i = 1; i < 6; i += 1) {
    const t = i / 6;
    const x = 20 + 560 * t;
    const y = 420 - Math.sin(t * Math.PI) * 330;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(300 + (x - 300) * 0.55, 420);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(20, 240);
  ctx.quadraticCurveTo(300, 150, 580, 240);
  ctx.stroke();
  // A cracked pane, when the difference is on.
  if (diffs.has(5)) {
    ctx.strokeStyle = '#2e3a45';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(300, 100);
    ctx.lineTo(288, 122);
    ctx.lineTo(306, 134);
    ctx.lineTo(292, 152);
    ctx.lineTo(312, 166);
    ctx.moveTo(300, 100);
    ctx.lineTo(318, 118);
    ctx.lineTo(310, 140);
    ctx.stroke();
  }

  // Stone path.
  ctx.fillStyle = '#b8a888';
  ctx.beginPath();
  ctx.moveTo(230, 600);
  ctx.lineTo(270, 430);
  ctx.lineTo(330, 430);
  ctx.lineTo(370, 600);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#8a7a5c';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i += 1) {
    const y = 455 + i * 30;
    ctx.beginPath();
    ctx.moveTo(258 + i * 4, y);
    ctx.lineTo(342 - i * 4, y);
    ctx.stroke();
  }
  // Pebbles beside the path, one extra when the difference is on.
  ctx.fillStyle = '#8a7a5c';
  for (const [px, py, pr] of [[250, 560, 7], [352, 520, 6], [240, 500, 5], [365, 575, 7]]) {
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }
  if (diffs.has(8)) {
    ctx.beginPath();
    ctx.arc(330, 540, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  // Big monstera on the left.
  ctx.fillStyle = '#2f7d4f';
  for (const [lx, ly, la, ll] of [
    [90, 380, -0.9, 90], [130, 350, -0.5, 100], [70, 330, -1.3, 80],
    [160, 400, -0.2, 95], [110, 420, -1.7, 75],
  ]) {
    drawLeaf(ctx, lx, ly, la, ll, '#2f7d4f');
  }
  // Hanging vine: five leaves, one missing when the difference is on.
  ctx.strokeStyle = '#2f7d4f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(90, 60);
  ctx.quadraticCurveTo(110, 130, 85, 200);
  ctx.stroke();
  const vineLeaves = [[96, 90], [104, 125], [88, 150], [98, 180], [86, 205]];
  vineLeaves.forEach(([vx, vy], i) => {
    if (i === 2 && diffs.has(4)) return;
    drawLeaf(ctx, vx, vy, i % 2 === 0 ? 0.5 : -0.6, 26, '#3d8f5f');
  });

  // Fern on the right: fronds fanning out, one bent the other way.
  for (let i = 0; i < 6; i += 1) {
    const angle = -Math.PI / 2 + (i - 2.5) * 0.28;
    let bend = angle;
    if (diffs.has(9) && i === 4) bend = -Math.PI / 2 - 0.9;
    ctx.strokeStyle = '#3d8f5f';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(520, 420);
    ctx.quadraticCurveTo(520 + Math.cos(bend) * 50, 420 + Math.sin(bend) * 50, 520 + Math.cos(bend) * 105, 420 + Math.sin(bend) * 105);
    ctx.stroke();
  }

  // Orchids and the flowerpot.
  drawOrchid(ctx, 150, 300, diffs.has(1) ? '#fbf6ea' : '#d76a9e');
  drawOrchid(ctx, 185, 330, '#d76a9e');
  ctx.fillStyle = diffs.has(6) ? '#3d6f9e' : '#b3643a';
  ctx.beginPath();
  ctx.moveTo(180, 440);
  ctx.lineTo(220, 440);
  ctx.lineTo(212, 500);
  ctx.lineTo(188, 500);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#2e2a26';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#2f7d4f';
  for (let i = 0; i < 4; i += 1) drawLeaf(ctx, 200, 445, -1.2 + i * 0.5, 34, '#2f7d4f');

  // Cactus in a pot: two arms, or three.
  ctx.fillStyle = '#3d8f5f';
  ctx.beginPath();
  ctx.ellipse(480, 400, 16, 42, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(458, 380, 10, 22, 0.6, 0, Math.PI * 2);
  ctx.fill();
  if (diffs.has(2)) {
    ctx.beginPath();
    ctx.ellipse(502, 380, 10, 22, -0.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#b3643a';
  ctx.fillRect(458, 440, 44, 30);
  ctx.strokeStyle = '#2e2a26';
  ctx.lineWidth = 2;
  ctx.strokeRect(458, 440, 44, 30);

  // Watering can: the rose head on its spout can be missing.
  ctx.fillStyle = '#6b8a9e';
  ctx.beginPath();
  ctx.ellipse(280, 470, 42, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2e3a45';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(318, 460);
  ctx.lineTo(352, 440);
  ctx.stroke();
  if (!diffs.has(3)) {
    ctx.fillStyle = '#6b8a9e';
    ctx.beginPath();
    ctx.arc(356, 438, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(242, 448, 16, Math.PI * 0.6, Math.PI * 1.7);
  ctx.stroke();

  // Butterflies: two always, a third when the difference is on.
  drawButterfly(ctx, 250, 210, 1, '#e07020');
  drawButterfly(ctx, 540, 170, 0.9, '#7a4a8a');
  if (diffs.has(0)) drawButterfly(ctx, 420, 180, 1, '#c98a1b');

  // A few scattered leaves on the path.
  ctx.fillStyle = '#7a9e4f';
  for (let i = 0; i < 6; i += 1) {
    const lx = range(rng, 240, 360);
    const ly = range(rng, 460, 590);
    ctx.beginPath();
    ctx.ellipse(lx, ly, 8, 4, range(rng, 0, 3), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = '#2e3a45';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, 596, 596);
  ctx.restore();
}
