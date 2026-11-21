// Scene 2 — the night market. Lanterns, striped awnings, jars of spice and
// a cat asleep on a crate. Difficulty 2: the changes hide among the stalls'
// busy colours and repeated patterns.
import { sceneRandom, range } from './random.js';

export const DIFFS = [
  { x: 500, y: 80, r: 32, name: 'the moon turned crescent' },
  { x: 150, y: 212, r: 22, name: 'a lantern turned green' },
  { x: 300, y: 152, r: 30, name: 'an awning stripe changed colour' },
  { x: 382, y: 332, r: 22, name: 'an extra spice jar appeared' },
  { x: 520, y: 432, r: 26, name: 'the market cat wandered off' },
  { x: 240, y: 62, r: 16, name: 'a string-light bulb went dark' },
  { x: 122, y: 352, r: 24, name: 'a basket filled with fruit' },
  { x: 432, y: 102, r: 18, name: 'a bunting flag changed colour' },
  { x: 300, y: 205, r: 22, name: 'the stall sign changed its symbol' },
  { x: 200, y: 522, r: 20, name: 'a cobblestone changed shape' },
];

function drawLantern(ctx, x, y, s, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.ellipse(x, y, 15 * s, 19 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2e1f16';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.strokeStyle = 'rgba(247, 201, 72, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x - 10 * s, y - 6 * s);
  ctx.lineTo(x + 10 * s, y - 6 * s);
  ctx.moveTo(x - 10 * s, y + 6 * s);
  ctx.lineTo(x + 10 * s, y + 6 * s);
  ctx.stroke();
  ctx.fillStyle = '#f7c948';
  ctx.fillRect(x - 4 * s, y - 24 * s, 8 * s, 5 * s);
  ctx.beginPath();
  ctx.moveTo(x, y - 24 * s);
  ctx.lineTo(x, y - 34 * s);
  ctx.stroke();
}

function drawStall(ctx, x, awningA, awningB, diffStripe) {
  // Posts and counter.
  ctx.fillStyle = '#5d4526';
  ctx.fillRect(x + 6, 210, 10, 150);
  ctx.fillRect(x + 184, 210, 10, 150);
  ctx.fillStyle = '#8a6a44';
  ctx.fillRect(x, 330, 200, 30);
  ctx.strokeStyle = '#2e1f16';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, 330, 200, 30);
  // Striped awning.
  for (let i = 0; i < 5; i += 1) {
    let colour = i % 2 === 0 ? awningA : awningB;
    if (diffStripe && i === 2) colour = '#7a4a8a';
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.moveTo(x + i * 40, 150);
    ctx.lineTo(x + (i + 1) * 40, 150);
    ctx.lineTo(x + (i + 1) * 40 + 8, 185);
    ctx.lineTo(x + i * 40 + 8, 185);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = '#2e1f16';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, 148, 200, 4);
}

function drawJar(ctx, x, y, colour, h = 34) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.ellipse(x, y, 14, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2e1f16';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#d8cdb4';
  ctx.fillRect(x - 8, y - h / 2 - 6, 16, 7);
}

export function drawPanel(ctx, diffs, seed) {
  const rng = sceneRandom(seed);
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, 600, 600);
  ctx.clip();

  // Night sky.
  const sky = ctx.createLinearGradient(0, 0, 0, 420);
  sky.addColorStop(0, '#1b2340');
  sky.addColorStop(1, '#3a2b52');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 420);
  // Stars.
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  for (let i = 0; i < 26; i += 1) {
    const sx = range(rng, 10, 590);
    const sy = range(rng, 10, 300);
    ctx.beginPath();
    ctx.arc(sx, sy, range(rng, 1, 2.4), 0, Math.PI * 2);
    ctx.fill();
  }
  // Moon: full, or a crescent.
  ctx.fillStyle = '#f7efdd';
  ctx.beginPath();
  ctx.arc(500, 80, 30, 0, Math.PI * 2);
  ctx.fill();
  if (diffs.has(0)) {
    ctx.fillStyle = '#1b2340';
    ctx.beginPath();
    ctx.arc(512, 72, 26, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bunting across the top.
  ctx.strokeStyle = '#d8cdb4';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 60);
  ctx.quadraticCurveTo(300, 130, 600, 60);
  ctx.stroke();
  const flagColours = ['#b3402e', '#f7c948', '#2f7d5b', '#3d6f9e'];
  for (let i = 0; i < 12; i += 1) {
    const fx = 25 + i * 48;
    const fy = 60 + Math.sin((fx / 600) * Math.PI) * 62;
    let colour = flagColours[i % 4];
    if (diffs.has(7) && i === 8) colour = '#e07020';
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.moveTo(fx - 11, fy);
    ctx.lineTo(fx + 11, fy);
    ctx.lineTo(fx, fy + 20);
    ctx.closePath();
    ctx.fill();
  }

  // String lights, one bulb dark when the difference is on.
  ctx.strokeStyle = '#d8cdb4';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.quadraticCurveTo(300, 78, 600, 30);
  ctx.stroke();
  for (let i = 0; i < 10; i += 1) {
    const bx = 30 + i * 60;
    const by = 30 + Math.sin((bx / 600) * Math.PI) * 42;
    const dark = diffs.has(5) && i === 4;
    ctx.fillStyle = dark ? '#3a3a3a' : '#f7c948';
    ctx.beginPath();
    ctx.arc(bx, by + 8, 6, 0, Math.PI * 2);
    ctx.fill();
    if (!dark) {
      ctx.fillStyle = 'rgba(247, 201, 72, 0.25)';
      ctx.beginPath();
      ctx.arc(bx, by + 8, 13, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Cobblestones.
  ctx.fillStyle = '#4a4038';
  ctx.fillRect(0, 420, 600, 180);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.lineWidth = 2;
  for (let row = 0; row < 4; row += 1) {
    const y = 440 + row * 40;
    for (let col = 0; col < 8; col += 1) {
      const x = col * 78 + (row % 2) * 30 - 20;
      ctx.beginPath();
      ctx.ellipse(x, y, 34, 16, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  // One cobblestone changed shape: a square stone among the round ones.
  if (diffs.has(9)) {
    ctx.fillStyle = '#6b5a48';
    ctx.fillRect(178, 506, 44, 32);
    ctx.strokeStyle = '#2e1f16';
    ctx.strokeRect(178, 506, 44, 32);
  }

  // Three stalls.
  drawStall(ctx, 30, '#b3402e', '#f7efdd', false);
  drawStall(ctx, 200, '#2f7d5b', '#f7efdd', diffs.has(2));
  drawStall(ctx, 370, '#c98a1b', '#f7efdd', false);

  // Lanterns hanging from the first stall.
  drawLantern(ctx, 150, 212, 1, diffs.has(1) ? '#2f7d5b' : '#b3402e');
  drawLantern(ctx, 105, 218, 0.8, '#c98a1b');
  drawLantern(ctx, 450, 212, 1, '#b3402e');
  drawLantern(ctx, 520, 218, 0.85, '#f7c948');

  // Jars on the middle counter, one extra when the difference is on.
  drawJar(ctx, 250, 315, '#b3402e');
  drawJar(ctx, 285, 312, '#2f7d5b');
  drawJar(ctx, 320, 315, '#c98a1b');
  if (diffs.has(3)) drawJar(ctx, 382, 330, '#7a4a8a', 26);
  drawJar(ctx, 420, 315, '#3d6f9e');
  drawJar(ctx, 455, 312, '#b3402e');

  // Baskets on the first counter; one fills with fruit.
  for (const bx of [60, 105, 150]) {
    ctx.fillStyle = '#a97e4f';
    ctx.beginPath();
    ctx.ellipse(bx, 330, 20, 12, 0, 0, Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#2e1f16';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  if (diffs.has(6)) {
    ctx.fillStyle = '#c96a1b';
    for (const [fx, fy] of [[112, 318], [122, 314], [132, 318]]) {
      ctx.beginPath();
      ctx.arc(fx, fy, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#2f7d5b';
    ctx.beginPath();
    ctx.ellipse(122, 306, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Stall sign on the middle stall: a star, or a moon.
  ctx.fillStyle = '#f7efdd';
  ctx.fillRect(272, 190, 56, 30);
  ctx.strokeStyle = '#2e1f16';
  ctx.lineWidth = 2;
  ctx.strokeRect(272, 190, 56, 30);
  ctx.fillStyle = '#1b2340';
  if (diffs.has(8)) {
    ctx.beginPath();
    ctx.arc(300, 205, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f7efdd';
    ctx.beginPath();
    ctx.arc(303, 202, 7, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    for (let i = 0; i < 5; i += 1) {
      const angle = -Math.PI / 2 + (i * 4 * Math.PI) / 5;
      const px = 300 + Math.cos(angle) * 9;
      const py = 205 + Math.sin(angle) * 9;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }

  // Crates stacked at the right, with the cat asleep on top.
  ctx.fillStyle = '#a97e4f';
  ctx.fillRect(480, 420, 70, 44);
  ctx.fillRect(500, 380, 56, 40);
  ctx.strokeStyle = '#2e1f16';
  ctx.lineWidth = 2;
  ctx.strokeRect(480, 420, 70, 44);
  ctx.strokeRect(500, 380, 56, 40);
  if (!diffs.has(4)) {
    // A sleeping cat: a curled body, a head and two ears.
    ctx.fillStyle = '#2e2a26';
    ctx.beginPath();
    ctx.ellipse(528, 372, 26, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(550, 366, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(544, 360);
    ctx.lineTo(546, 350);
    ctx.lineTo(550, 358);
    ctx.moveTo(552, 358);
    ctx.lineTo(556, 350);
    ctx.lineTo(558, 360);
    ctx.fill();
  }

  ctx.strokeStyle = '#2e1f16';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, 596, 596);
  ctx.restore();
}
