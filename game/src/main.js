// Harbourlog — bootstrap and state machine. The game runs on one canvas:
// a title page, a scene map, five spot-the-difference scenes, a scene-end
// card and a victory page. Two panels sit side by side in every scene: the
// morning sketch on the left, drawn plain, and the evening sketch on the
// right, drawn with all ten differences applied. Found differences are
// ringed in gold on both panels.
import { SCENES, allDiffs } from './scenes.js';
import { PANEL_LEFT, PANEL_RIGHT, PANEL_SIZE, PANEL_TOP, hitTest, firstUnfound, diffScreenPosition } from './differences.js';
import { SoundBank } from './audio.js';
import { InputTracker, panelAt, CANVAS_WIDTH, CANVAS_HEIGHT } from './input.js';
import {
  HINT_BUTTON, MUTE_BUTTON, drawHeader, drawFooter, drawPanelLabels,
  drawFoundMarkers, drawHintPulse, drawWrongMark, drawCursor, pointInRect,
} from './hud.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const statusLine = document.getElementById('status');
const sounds = new SoundBank();
const BEST_KEY = 'harbourlog-best';

const state = {
  screen: 'title',
  sceneIndex: 0,
  found: new Set(),
  score: 0,
  sceneScore: 0,
  streak: 0,
  bestStreak: 0,
  attempts: 0,
  hintsLeft: 3,
  timeLeft: 150,
  timeLimit: 150,
  muted: false,
  hint: null,
  wrongMark: null,
  shakeUntil: 0,
  completeAt: 0,
  timedOut: false,
  sceneResults: [],
  best: 0,
};

try {
  state.best = Number(window.localStorage.getItem(BEST_KEY) ?? 0) || 0;
} catch {
  state.best = 0;
}

function currentScene() {
  return SCENES[state.sceneIndex];
}

function saveBest() {
  if (state.score > state.best) {
    state.best = state.score;
    try {
      window.localStorage.setItem(BEST_KEY, String(state.best));
    } catch {
      // A private window or a blocked store: the best score just lives here.
    }
  }
}

function startScene(index) {
  const scene = SCENES[index];
  state.sceneIndex = index;
  state.found = new Set();
  state.score = index === 0 ? 0 : state.score;
  state.sceneScore = 0;
  state.streak = 0;
  state.attempts = 0;
  state.hintsLeft = 3;
  state.timeLimit = scene.timeLimit;
  state.timeLeft = scene.timeLimit;
  state.hint = null;
  state.wrongMark = null;
  state.completeAt = 0;
  state.timedOut = false;
  state.screen = 'playing';
  announce(`${scene.name}. Find 10 differences. ${scene.timeLimit} seconds.`);
}

function endScene(timedOut) {
  const scene = currentScene();
  state.timedOut = timedOut;
  let timeBonus = 0;
  if (!timedOut) {
    timeBonus = Math.round(state.timeLeft) * 5;
    state.score += timeBonus;
    state.sceneScore += timeBonus;
  }
  state.sceneResults.push({
    name: scene.name,
    found: state.found.size,
    attempts: state.attempts,
    timeLeft: Math.max(0, Math.round(state.timeLeft)),
    score: state.sceneScore,
    timedOut,
  });
  state.completeAt = 0;
  state.screen = 'sceneEnd';
  saveBest();
  sounds.fanfare(false);
  announce(timedOut ? `Time up on ${scene.name}.` : `${scene.name} complete. Score ${state.score}.`);
}

function showVictory() {
  state.screen = 'victory';
  saveBest();
  sounds.fanfare(true);
  announce(`Logbook complete. Total score ${state.score}.`);
}

function nextScene() {
  if (state.sceneIndex + 1 < SCENES.length) startScene(state.sceneIndex + 1);
  else showVictory();
}

function useHint() {
  if (state.screen !== 'playing' || state.hintsLeft <= 0 || state.completeAt) return;
  const index = firstUnfound(currentScene().diffs, state.found);
  if (index < 0) return;
  state.hintsLeft -= 1;
  state.hint = { index, startedAt: performance.now() };
  sounds.hint();
}

function markAt(x, y) {
  if (state.screen !== 'playing' || state.completeAt) return false;
  const panel = panelAt(x, y);
  if (!panel) return false;
  const scene = currentScene();
  state.attempts += 1;
  const hit = hitTest(scene.diffs, state.found, panel.x, panel.y);
  if (hit >= 0) {
    state.found.add(hit);
    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    const gained = 100 + (state.streak - 1) * 10;
    state.score += gained;
    state.sceneScore += gained;
    sounds.found();
    announce(`Found ${scene.diffs[hit].name}. ${scene.diffs.length - state.found.size} left.`);
    if (state.found.size === scene.diffs.length) {
      state.completeAt = performance.now() + 900;
    }
    return true;
  }
  state.streak = 0;
  state.timeLeft = Math.max(0, state.timeLeft - 5);
  state.wrongMark = { x, y, at: performance.now() };
  state.shakeUntil = performance.now() + 250;
  sounds.wrong();
  announce('Not a difference. Five seconds lost.');
  return false;
}

function announce(text) {
  if (statusLine.textContent !== text) statusLine.textContent = text;
}

function toggleMute() {
  state.muted = !state.muted;
  sounds.setMuted(state.muted);
}

// --- Screens ---------------------------------------------------------------

function roundRectPath(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawPaperBackground() {
  ctx.fillStyle = '#efe6d0';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawTitle(now) {
  drawPaperBackground();
  // A row of miniature scenes along the bottom, like pages of the logbook.
  SCENES.forEach((scene, i) => {
    const x = 110 + i * 216;
    const y = 560;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(0.3, 0.3);
    scene.draw(ctx, new Set(), scene.seed);
    ctx.restore();
    ctx.fillStyle = '#1d2b33';
    ctx.font = '700 13px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${scene.number}. ${scene.name}`, x + 90, y + 200);
  });

  ctx.textAlign = 'center';
  ctx.fillStyle = '#1d2b33';
  ctx.font = '800 92px Georgia, serif';
  ctx.fillText('HARBOURLOG', 640, 210);
  ctx.font = 'italic 26px Georgia, serif';
  ctx.fillStyle = '#5c6a70';
  ctx.fillText('the keeper\u2019s logbook \u2014 spot what changed', 640, 258);
  ctx.font = '20px Georgia, serif';
  ctx.fillStyle = '#1d2b33';
  ctx.fillText('5 scenes  \u00b7  50 differences  \u00b7  hints, streaks and a ticking clock', 640, 320);
  ctx.font = '18px Georgia, serif';
  ctx.fillStyle = '#5c6a70';
  ctx.fillText('Compare the morning sketch with the evening sketch. Circle every change.', 640, 352);
  const blink = 0.6 + 0.4 * Math.sin(now / 350);
  ctx.globalAlpha = blink;
  ctx.font = '700 24px Georgia, serif';
  ctx.fillStyle = '#a33b1f';
  ctx.fillText('Click or press Enter to open the logbook', 640, 440);
  ctx.globalAlpha = 1;
  ctx.font = '16px Georgia, serif';
  ctx.fillStyle = '#5c6a70';
  ctx.fillText('Mouse to mark  \u00b7  Arrow keys + Enter work too  \u00b7  H hint  \u00b7  M sound', 640, 500);
  if (state.best > 0) {
    ctx.fillStyle = '#b0701a';
    ctx.font = '700 18px Georgia, serif';
    ctx.fillText(`Best logbook score: ${state.best.toLocaleString('en-US')}`, 640, 532);
  }
}

function drawMap(now) {
  drawPaperBackground();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#1d2b33';
  ctx.font = '800 44px Georgia, serif';
  ctx.fillText('Choose a page', 640, 80);
  ctx.font = 'italic 18px Georgia, serif';
  ctx.fillStyle = '#5c6a70';
  ctx.fillText('Every page is open. Press 1\u20135, or click a card.', 640, 112);

  SCENES.forEach((scene, i) => {
    const x = 24 + i * 248;
    const y = 150;
    const w = 232;
    const h = 480;
    ctx.save();
    ctx.fillStyle = '#f7efdd';
    roundRectPath(x, y, w, h, 14);
    ctx.fill();
    ctx.strokeStyle = '#2e3a45';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.translate(x + 8, y + 10);
    ctx.scale(0.36, 0.36);
    scene.draw(ctx, new Set(), scene.seed);
    ctx.restore();

    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#1d2b33';
    ctx.font = '700 17px Georgia, serif';
    ctx.fillText(scene.name, x + w / 2, y + 250);
    ctx.font = '15px Georgia, serif';
    ctx.fillStyle = '#b0701a';
    ctx.fillText('\u2605'.repeat(scene.difficulty) + '\u2606'.repeat(5 - scene.difficulty), x + w / 2, y + 280);
    ctx.fillStyle = '#5c6a70';
    ctx.font = '14px Georgia, serif';
    ctx.fillText(`${scene.diffs.length} differences`, x + w / 2, y + 306);
    ctx.fillText(`${Math.floor(scene.timeLimit / 60)}:${String(scene.timeLimit % 60).padStart(2, '0')} on the clock`, x + w / 2, y + 330);
    const result = state.sceneResults.find((r) => r.name === scene.name);
    if (result) {
      ctx.fillStyle = '#1e7d4f';
      ctx.font = '700 15px Georgia, serif';
      ctx.fillText(`Done: ${result.found}/10 \u00b7 ${result.score} pts`, x + w / 2, y + 360);
    }
    ctx.font = 'italic 13px Georgia, serif';
    ctx.fillStyle = '#5c6a70';
    wrapText(scene.note, x + 16, y + 392, w - 32, 18);
    ctx.font = '700 15px Georgia, serif';
    ctx.fillStyle = '#a33b1f';
    ctx.fillText(`Press ${scene.number}`, x + w / 2, y + 452);
    ctx.restore();
  });

  ctx.textAlign = 'center';
  ctx.fillStyle = '#5c6a70';
  ctx.font = '16px Georgia, serif';
  ctx.fillText('Esc returns to the title page', 640, 700);
}

function wrapText(text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let cy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x + maxWidth / 2, cy);
      line = word;
      cy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x + maxWidth / 2, cy);
}

function drawGame(now) {
  drawPaperBackground();
  const scene = currentScene();
  ctx.save();
  if (now < state.shakeUntil) {
    ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8);
  }
  ctx.save();
  ctx.translate(PANEL_LEFT.x, PANEL_TOP);
  scene.draw(ctx, new Set(), scene.seed);
  ctx.restore();
  ctx.save();
  ctx.translate(PANEL_RIGHT.x, PANEL_TOP);
  scene.draw(ctx, allDiffs(scene), scene.seed);
  ctx.restore();
  ctx.restore();

  drawFoundMarkers(ctx, scene.diffs, state.found, now / 1000);
  if (state.hint) {
    const age = (now - state.hint.startedAt) / 1000;
    if (age < 3) drawHintPulse(ctx, scene.diffs[state.hint.index], age / 3);
    else state.hint = null;
  }
  if (state.wrongMark) {
    const age = (now - state.wrongMark.at) / 1000;
    if (age < 0.6) drawWrongMark(ctx, state.wrongMark, age);
    else state.wrongMark = null;
  }
  drawPanelLabels(ctx, scene);
  drawHeader(ctx, state, scene);
  drawFooter(ctx, state);
  drawCursor(ctx, input.cursor);
}

function drawOverlayCard(title, lines, buttons) {
  ctx.save();
  ctx.fillStyle = 'rgba(29, 43, 51, 0.55)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  const x = 320;
  const y = 170;
  const w = 640;
  const h = 460;
  ctx.fillStyle = '#f7efdd';
  roundRectPath(x, y, w, h, 16);
  ctx.fill();
  ctx.strokeStyle = '#2e3a45';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#1d2b33';
  ctx.font = '800 38px Georgia, serif';
  ctx.fillText(title, 640, y + 62);
  ctx.font = '18px Georgia, serif';
  ctx.fillStyle = '#5c6a70';
  let cy = y + 108;
  for (const line of lines) {
    ctx.fillText(line, 640, cy);
    cy += 32;
  }
  for (const button of buttons) {
    ctx.fillStyle = '#1d2b33';
    roundRectPath(button.x, button.y, button.w, button.h, 10);
    ctx.fill();
    ctx.fillStyle = '#f7efdd';
    ctx.font = '700 17px Georgia, serif';
    ctx.fillText(button.label, button.x + button.w / 2, button.y + 34);
  }
  ctx.restore();
}

const SCENE_END_NEXT = { x: 390, y: 520, w: 200, h: 52, label: 'Next scene (N)' };
const SCENE_END_RETRY = { x: 690, y: 520, w: 200, h: 52, label: 'Retry (R)' };

function drawSceneEnd() {
  const scene = currentScene();
  const result = state.sceneResults[state.sceneResults.length - 1];
  const accuracy = state.attempts === 0 ? 0 : Math.round((state.found.size / state.attempts) * 100);
  const lines = state.timedOut
    ? [
        `${scene.name} — the clock ran out.`,
        `You found ${state.found.size} of ${scene.diffs.length} differences.`,
        `Accuracy ${accuracy}%  \u00b7  Scene score ${state.sceneScore}`,
        'Try again, or move on — the logbook keeps your score either way.',
      ]
    : [
        `${scene.name} — every change found.`,
        `Time left ${Math.max(0, Math.round(state.timeLeft))}s  \u00b7  time bonus ${Math.round(state.timeLeft) * 5}`,
        `Accuracy ${accuracy}%  \u00b7  Best streak \u00d7${state.bestStreak}`,
        `Scene score ${state.sceneScore}  \u00b7  Total ${state.score}`,
      ];
  drawGame(performance.now());
  const buttons = state.sceneIndex + 1 < SCENES.length
    ? [SCENE_END_NEXT, SCENE_END_RETRY]
    : [{ x: 490, y: 520, w: 300, h: 52, label: 'Finish the logbook (N)' }, SCENE_END_RETRY];
  drawOverlayCard(state.timedOut ? 'Time\u2019s up!' : 'Scene complete!', lines, buttons);
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#5c6a70';
  ctx.font = '15px Georgia, serif';
  ctx.fillText('Esc — back to the map', 640, 600);
  ctx.restore();
}

function drawVictory() {
  const lines = [
    `Total score ${state.score.toLocaleString('en-US')}${state.best > 0 ? `  \u00b7  Best ${state.best.toLocaleString('en-US')}` : ''}`,
    '',
  ];
  for (const result of state.sceneResults) {
    lines.push(`${result.name}: ${result.found}/10  \u00b7  ${result.score} pts${result.timedOut ? '  \u00b7  time ran out' : ''}`);
  }
  lines.push('', 'Every page of the logbook is closed. The harbour keeps its secrets — until tomorrow.');
  drawGame(performance.now());
  drawOverlayCard('The logbook is complete!', lines, [
    { x: 490, y: 560, w: 300, h: 52, label: 'Play again (R)' },
  ]);
}

// --- Input wiring ----------------------------------------------------------

const input = new InputTracker(canvas, {
  onPress(x, y) {
    sounds.ensure();
    if (state.screen === 'title') {
      state.screen = 'map';
      sounds.click();
      return;
    }
    if (state.screen === 'map') {
      SCENES.forEach((scene, i) => {
        const card = { x: 24 + i * 248, y: 150, w: 232, h: 480 };
        if (pointInRect(x, y, card)) startScene(i);
      });
      return;
    }
    if (state.screen === 'playing') {
      if (pointInRect(x, y, HINT_BUTTON)) { useHint(); return; }
      if (pointInRect(x, y, MUTE_BUTTON)) { toggleMute(); return; }
      markAt(x, y);
      return;
    }
    if (state.screen === 'sceneEnd') {
      if (pointInRect(x, y, SCENE_END_NEXT)) { nextScene(); return; }
      if (pointInRect(x, y, SCENE_END_RETRY)) { startScene(state.sceneIndex); return; }
      return;
    }
    if (state.screen === 'victory') {
      if (pointInRect(x, y, { x: 490, y: 560, w: 300, h: 52 })) {
        state.sceneResults = [];
        state.score = 0;
        startScene(0);
      }
    }
  },
  onKey(key) {
    sounds.ensure();
    const lower = key.toLowerCase();
    if (lower === 'm') { toggleMute(); return; }
    if (state.screen === 'title') {
      if (key === 'Enter') { state.screen = 'map'; sounds.click(); }
      if (key >= '1' && key <= '5') startScene(Number(key) - 1);
      return;
    }
    if (state.screen === 'map') {
      if (key === 'Escape') { state.screen = 'title'; return; }
      if (key >= '1' && key <= '5') startScene(Number(key) - 1);
      return;
    }
    if (state.screen === 'playing') {
      if (lower === 'h') { useHint(); return; }
      if (lower === 'r') { startScene(state.sceneIndex); return; }
      if (key === 'Escape') { state.screen = 'map'; return; }
      return;
    }
    if (state.screen === 'sceneEnd') {
      if (lower === 'n') { nextScene(); return; }
      if (lower === 'r') { startScene(state.sceneIndex); return; }
      if (key === 'Escape') { state.screen = 'map'; return; }
      return;
    }
    if (state.screen === 'victory') {
      if (lower === 'r') {
        state.sceneResults = [];
        state.score = 0;
        startScene(0);
        return;
      }
      if (key === 'Escape') { state.screen = 'title'; }
    }
  },
});

// --- Main loop -------------------------------------------------------------

let lastNow = performance.now();

function frame(now) {
  const dt = Math.min(0.1, (now - lastNow) / 1000);
  lastNow = now;
  if (state.screen === 'playing') {
    if (state.completeAt && now >= state.completeAt) {
      endScene(false);
    } else if (!state.completeAt) {
      state.timeLeft -= dt;
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        endScene(true);
      }
    }
  }
  if (state.screen === 'title') drawTitle(now);
  else if (state.screen === 'map') drawMap(now);
  else if (state.screen === 'playing') drawGame(now);
  else if (state.screen === 'sceneEnd') drawSceneEnd();
  else if (state.screen === 'victory') drawVictory();
  requestAnimationFrame(frame);
}

// --- Screenshot staging ----------------------------------------------------

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot) {
  const staged = stageShot(shot);
  const scene = SCENES[staged.sceneIndex];
  state.sceneIndex = staged.sceneIndex;
  state.found = new Set(staged.found);
  state.score = staged.score;
  state.sceneScore = staged.score;
  state.timeLimit = scene.timeLimit;
  state.timeLeft = staged.timeLeft;
  state.streak = staged.found.length;
  state.attempts = staged.found.length;
  state.hintsLeft = 2;
  state.screen = staged.screen;
  if (staged.screen === 'sceneEnd') {
    state.sceneResults = [{
      name: scene.name,
      found: staged.found.length,
      attempts: staged.found.length,
      timeLeft: staged.timeLeft,
      score: staged.score,
      timedOut: false,
    }];
  }
  if (staged.screen === 'victory') {
    state.score = staged.totalScore;
    state.sceneResults = SCENES.map((s, i) => ({
      name: s.name,
      found: 10,
      attempts: 12 + i,
      timeLeft: 20 + i * 4,
      score: 1200 + i * 120,
      timedOut: false,
    }));
  }
}

// A small hook for the automated play-test: it reads the state and turns a
// difference index into canvas coordinates, so a test can click for real.
window.__harbourlog = {
  state,
  scenes: SCENES,
  screenPosition(index, side) {
    return diffScreenPosition(currentScene().diffs[index], side);
  },
  startScene,
  useHint,
  markAt,
};

requestAnimationFrame(frame);
