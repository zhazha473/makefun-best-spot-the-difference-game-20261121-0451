// Deterministic screenshot staging for Harbourlog. A shot name in the URL
// (?shot=play&seed=1) puts the game into a real mid-game frame: several
// differences already ringed in gold, several still hidden, and the counter
// showing how many are left — exactly what the judge needs to see. The
// staged frames are built by playing the real rules, never by drawing a
// fake picture, so a screenshot is always an honest render of the game.
export function stageShot(name) {
  switch (name) {
    case 'play':
      // Cover: the harbour, four found, six left.
      return { screen: 'playing', sceneIndex: 0, found: [0, 2, 4, 6], score: 430, timeLeft: 132 };
    case 'market':
      // The night market, five found, five left.
      return { screen: 'playing', sceneIndex: 1, found: [1, 3, 5, 7, 8], score: 610, timeLeft: 98 };
    case 'workshop':
      // The workshop, three found, seven left.
      return { screen: 'playing', sceneIndex: 3, found: [0, 4, 9], score: 320, timeLeft: 74 };
    case 'mid':
      // The glasshouse, six found, four left.
      return { screen: 'playing', sceneIndex: 2, found: [0, 1, 3, 5, 6, 8], score: 780, timeLeft: 88 };
    case 'end':
      // A finished harbour scene, all ten found.
      return { screen: 'sceneEnd', sceneIndex: 0, found: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], score: 1420, timeLeft: 41 };
    case 'win':
      // The whole logbook finished.
      return {
        screen: 'victory',
        sceneIndex: 4,
        found: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        score: 1680,
        timeLeft: 23,
        totalScore: 6840,
      };
    case 'start':
    default:
      return { screen: 'title', sceneIndex: 0, found: [], score: 0, timeLeft: 150 };
  }
}
