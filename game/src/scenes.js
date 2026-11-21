// The five scenes of Harbourlog: the keeper's logbook holds one sketch-pair
// per place, each harder than the last. A scene is its name, its difficulty,
// its time limit, and the two functions that draw it and list its ten
// differences. The draw functions take a set of difference indices: the
// morning panel is drawn with none, the evening panel with all ten.
import { DIFFS as HARBOUR_DIFFS, drawPanel as drawHarbour } from './draw-harbour.js';
import { DIFFS as MARKET_DIFFS, drawPanel as drawMarket } from './draw-market.js';
import { DIFFS as GLASSHOUSE_DIFFS, drawPanel as drawGlasshouse } from './draw-glasshouse.js';
import { DIFFS as WORKSHOP_DIFFS, drawPanel as drawWorkshop } from './draw-workshop.js';
import { DIFFS as TIDEPOOL_DIFFS, drawPanel as drawTidepool } from './draw-tidepool.js';

export const SCENES = [
  {
    number: 1,
    id: 'harbour',
    name: 'The Harbour at Dawn',
    note: 'Large, plain changes — learn the hunt here.',
    difficulty: 1,
    timeLimit: 150,
    seed: 11,
    diffs: HARBOUR_DIFFS,
    draw: drawHarbour,
  },
  {
    number: 2,
    id: 'market',
    name: 'The Night Market',
    note: 'Changes hide among the lanterns and awnings.',
    difficulty: 2,
    timeLimit: 140,
    seed: 23,
    diffs: MARKET_DIFFS,
    draw: drawMarket,
  },
  {
    number: 3,
    id: 'glasshouse',
    name: 'The Botanical Glasshouse',
    note: 'One leaf looks like another. Look twice.',
    difficulty: 3,
    timeLimit: 130,
    seed: 37,
    diffs: GLASSHOUSE_DIFFS,
    draw: drawGlasshouse,
  },
  {
    number: 4,
    id: 'workshop',
    name: 'The Clockmaker\u2019s Workshop',
    note: 'Small hands, chains and numerals — walk past nothing.',
    difficulty: 4,
    timeLimit: 120,
    seed: 51,
    diffs: WORKSHOP_DIFFS,
    draw: drawWorkshop,
  },
  {
    number: 5,
    id: 'tidepool',
    name: 'The Tide Pool',
    note: 'Tiny changes in the repetition. The keeper\u2019s hardest page.',
    difficulty: 5,
    timeLimit: 110,
    seed: 67,
    diffs: TIDEPOOL_DIFFS,
    draw: drawTidepool,
  },
];

export function sceneById(id) {
  return SCENES.find((scene) => scene.id === id) ?? SCENES[0];
}

// A set holding every difference index of a scene, for the evening panel.
export function allDiffs(scene) {
  return new Set(scene.diffs.map((_, index) => index));
}
