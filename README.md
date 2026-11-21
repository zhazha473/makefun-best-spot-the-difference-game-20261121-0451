# HARBOURLOG: 5 Scenes, 50 Differences, One Keeper's Logbook

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/zhazha473/makefun-best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/zhazha473/makefun-best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

A quiet spot-the-difference game, built for [best-spot-the-difference-game-20261121-0451 on make.fun](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451).
The keeper of a small harbour sketched each place twice — once in the morning, once in the evening — and something changed between the two sketches. Find all ten changes on every page of the logbook.

## How to play

- Open `game/index.html` in a desktop browser (or run `node serve.ts` and
  open http://localhost:8080).
- Click a change on either picture, or move the crosshair with the arrow
  keys and mark with Enter.
- A right mark rings gold and adds 100 points, plus a streak bonus.
  A wrong click costs 5 seconds.
- `H` spends one of three hints per scene; `N` next scene; `R` retry;
  `1`–`5` pick a scene; `M` mute; `Esc` back to the map.
- Each scene has its own countdown — the bar under the counter shows it.

## The five scenes

1. The Harbour at Dawn — large, plain changes.
2. The Night Market — changes among the lanterns.
3. The Botanical Glasshouse — one leaf looks like another.
4. The Clockmaker's Workshop — small hands and numerals.
5. The Tide Pool — tiny changes in the repetition.

All art is drawn procedurally on canvas and all sound is synthesised with
Web Audio. No network, no external files: the game runs from its own
static files alone.
