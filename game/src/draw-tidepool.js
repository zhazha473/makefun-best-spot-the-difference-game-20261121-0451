// Scene 5 — the tide pool. Rocks, shells, a crab and a starfish among the
// anemones at low tide. Difficulty 5: the changes are tiny — one shell
// turned around, one starfish with an extra arm — hidden in the repetition.
import { sceneRandom, range } from './random.js';

export const DIFFS = [
  { x: 180, y: 420, r: 26, name: 'a starfish grew a sixth arm' },
  { x: 300, y: 500, r: 22, name: 'a shell turned around' },
  { x: 430, y: 380, r: 26, name: 'the crab lost a claw' },
  { x: 90, y: 300, r: 22, name: 'an extra seaweed frond' },
  { x: 350, y: 250, r: 20, name: 'an extra fish in the pool' },
  { x: 500, y: 450, r: 22, name: 'an anemone turned orange' },
  { x: 250, y: 180, r: 18, name: 'an extra barnacle cluster' },
  { x: 120, y: 200, r: 26, name: 'a rock gained a white stripe' },
  { x: 380, y: 200, r: 16, name: 'a bubble rose above the pool' },
  { x: 520, y: 80, r: 26, name: 'an extra wave line' },
];

function drawStarfish(ctx, x, y, s, arms, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  for (let i = 0; i < arms; i += 1) {
    const angle = -Math.PI / 2 + (i / arms) * Math.PI * 2;
    const outerX = x + Math.cos(angle) * 26 * s;
    const outerY = y + Math.sin(angle) * 26 * s;
    const innerAngle = angle + Math.PI / arms;
    const innerX = x + Math.cos(innerAngle) * 10 * s;
    const innerY = y + Math.sin(innerAngle) * 10 * s;
    if (i === 0) ctx.moveTo(outerX, outerY);
    else ctx.lineTo(outerX, outerY);
    ctx.lineTo(innerX, innerY);
  }
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#8a3a20';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  for (let i = 0; i < arms; i += 1) {
    const angle = -Math.PI / 2 + (i / arms) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(x + Math.cos(angle) * 12 * s, y + Math.sin(angle) * 12 * s, 2.5 * s, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawShell(ctx, x, y, s, flipped) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flipped ? -1 : 1, 1);
  ctx.fillStyle = '#e8b4a0';
  ctx.beginPath();
  ctx.moveTo(0, -16 * s);
  ctx.quadraticCurveTo(18 * s, -12 * s, 16 * s, 6 * s);
  ctx.quadraticCurveTo(8 * s, 16 * s, 0, 16 * s);
  ctx.quadraticCurveTo(-8 * s, 16 * s, -16 * s, 6 * s);
  ctx.quadraticCurveTo(-18 * s, -12 * s, 0, -16 * s);
  ctx.fill();
  ctx.strokeStyle = '#8a5a44';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -14 * s);
  ctx.lineTo(0, 14 * s);
  ctx.moveTo(-8 * s, -10 * s);
  ctx.lineTo(-6 * s, 12 * s);
  ctx.moveTo(8 * s, -10 * s);
  ctx.lineTo(6 * s, 12 * s);
  ctx.stroke();
  ctx.restore();
}

function drawAnemone(ctx, x, y, s, colour) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  for (let i = 0; i < 9; i += 1) {
    const angle = -Math.PI / 2 + (i - 4) * 0.22;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(
      x + Math.cos(angle) * 12 * s,
      y + Math.sin(angle) * 12 * s,
      x + Math.cos(angle) * 22 * s,
      y + Math.sin(angle) * 22 * s,
    );
    ctx.stroke();
  }
  ctx.fillStyle = '#7a4a2b';
  ctx.beginPath();
  ctx.ellipse(x, y + 4, 12 * s, 6 * s, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawFish(ctx, x, y, s, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.ellipse(x, y, 14 * s, 7 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 12 * s, y);
  ctx.lineTo(x - 20 * s, y - 7 * s);
  ctx.lineTo(x - 20 * s, y + 7 * s);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#2e2a26';
  ctx.beginPath();
  ctx.arc(x + 7 * s, y - 1 * s, 1.5 * s, 0, Math.PI * 2);
  ctx.fill();
}

export function drawPanel(ctx, diffs, seed) {
  const rng = sceneRandom(seed);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, 600, 600);
  ctx.clip();

  // Sand and the sea's edge at the top.
  ctx.fillStyle = '#e0c898';
  ctx.fillRect(0, 0, 600, 600);
  ctx.fillStyle = '#3d7f8c';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(600, 0);
  ctx.lineTo(600, 70);
  ctx.quadraticCurveTo(450, 95, 300, 72);
  ctx.quadraticCurveTo(150, 50, 0, 78);
  ctx.closePath();
  ctx.fill();
  // Wave lines in the sea, one extra when the difference is on.
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 3; i += 1) {
    const y = 22 + i * 18;
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.quadraticCurveTo(150, y - 8, 300, y);
    ctx.quadraticCurveTo(450, y + 8, 580, y);
    ctx.stroke();
  }
  if (diffs.has(9)) {
    ctx.beginPath();
    ctx.moveTo(380, 58);
    ctx.quadraticCurveTo(470, 50, 560, 58);
    ctx.stroke();
  }

  // Rocks around the pool.
  const rocks = [
    { x: 110, y: 210, rx: 70, ry: 46, c: '#8a8578' },
    { x: 480, y: 190, rx: 80, ry: 52, c: '#7a7568' },
    { x: 300, y: 130, rx: 55, ry: 34, c: '#9a9588' },
    { x: 60, y: 420, rx: 55, ry: 40, c: '#8a8578' },
    { x: 540, y: 420, rx: 60, ry: 44, c: '#7a7568' },
  ];
  for (const rock of rocks) {
    ctx.fillStyle = rock.c;
    ctx.beginPath();
    ctx.ellipse(rock.x, rock.y, rock.rx, rock.ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#5d584c';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  // A white stripe on one rock, when the difference is on.
  if (diffs.has(7)) {
    ctx.strokeStyle = '#fbf6ea';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(85, 185);
    ctx.quadraticCurveTo(120, 200, 155, 185);
    ctx.stroke();
  }
  // Barnacles: two clusters, a third when the difference is on.
  ctx.fillStyle = '#d8d2c2';
  const barnacleSpots = [[255, 165], [270, 195], [245, 185]];
  barnacleSpots.forEach(([bx, by], i) => {
    if (i === 2 && !diffs.has(6)) return;
    for (const [ox, oy] of [[0, 0], [9, 4], [-8, 6], [4, -7]]) {
      ctx.beginPath();
      ctx.arc(bx + ox, by + oy, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // The main pool: still water with a sandy bottom.
  const pool = ctx.createRadialGradient(300, 320, 40, 300, 320, 190);
  pool.addColorStop(0, '#7fc4c9');
  pool.addColorStop(1, '#3d8b99');
  ctx.fillStyle = pool;
  ctx.beginPath();
  ctx.ellipse(300, 320, 195, 150, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#5d8a8c';
  ctx.lineWidth = 3;
  ctx.stroke();
  // Light ripples.
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2;
  for (const [rx, ry, rr] of [[240, 300, 30], [360, 350, 38], [300, 260, 22]]) {
    ctx.beginPath();
    ctx.ellipse(rx, ry, rr, rr * 0.45, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Fish in the pool: two always, a third when the difference is on.
  drawFish(ctx, 250, 300, 1, '#e07020');
  drawFish(ctx, 380, 350, 0.9, '#c98a1b');
  if (diffs.has(4)) drawFish(ctx, 350, 250, 0.85, '#e07020');
  // A bubble above the pool, when the difference is on.
  if (diffs.has(8)) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(380, 200, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(372, 182, 5, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Seaweed: three fronds on the left, a fourth when the difference is on.
  ctx.strokeStyle = '#2f7d4f';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  const weeds = [
    [70, 340, 70, 260],
    [95, 345, 105, 255],
    [115, 340, 130, 270],
  ];
  if (diffs.has(3)) weeds.push([52, 335, 48, 265]);
  for (const [x1, y1, x2, y2] of weeds) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo((x1 + x2) / 2 + 12, (y1 + y2) / 2, x2, y2);
    ctx.stroke();
  }

  // Starfish: one plain, one that can grow a sixth arm.
  drawStarfish(ctx, 180, 420, 1, diffs.has(0) ? 6 : 5, '#e07020');
  drawStarfish(ctx, 420, 480, 0.8, 5, '#c96a8a');

  // Shells scattered on the sand, one turned around.
  drawShell(ctx, 300, 500, 1, diffs.has(1));
  drawShell(ctx, 210, 520, 0.8, false);
  drawShell(ctx, 400, 540, 0.9, false);
  drawShell(ctx, 480, 300, 0.7, false);

  // The crab, with two claws or one.
  ctx.fillStyle = '#b3402e';
  ctx.beginPath();
  ctx.ellipse(430, 380, 22, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#7a2818';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#b3402e';
  ctx.beginPath();
  ctx.arc(418, 362, 8, 0, Math.PI * 2);
  ctx.fill();
  if (!diffs.has(2)) {
    ctx.beginPath();
    ctx.arc(444, 362, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = '#b3402e';
  ctx.lineWidth = 3;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(430 + side * 20, 388);
    ctx.lineTo(430 + side * 34, 398);
    ctx.moveTo(430 + side * 18, 380);
    ctx.lineTo(430 + side * 32, 384);
    ctx.stroke();
  }
  ctx.fillStyle = '#2e2a26';
  ctx.beginPath();
  ctx.arc(422, 372, 2.5, 0, Math.PI * 2);
  ctx.arc(438, 372, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Anemones: pink, or orange when the difference is on.
  drawAnemone(ctx, 500, 450, 1, diffs.has(5) ? '#e07020' : '#d76a9e');
  drawAnemone(ctx, 150, 300, 0.8, '#d76a9e');
  drawAnemone(ctx, 250, 560, 0.9, '#7a4a8a');

  // Sand speckles.
  ctx.fillStyle = 'rgba(93, 88, 76, 0.5)';
  for (let i = 0; i < 40; i += 1) {
    ctx.beginPath();
    ctx.arc(range(rng, 10, 590), range(rng, 100, 590), range(rng, 1, 2.5), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = '#2e3a45';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, 596, 596);
  ctx.restore();
}
