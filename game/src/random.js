// Seeded random numbers for Harbourlog: every decorative scatter in a scene
// comes from one of these, so the same seed always paints the same picture.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A number in [min, max) from the given generator.
export function range(rng, min, max) {
  return min + rng() * (max - min);
}

// One element of an array, chosen by the generator.
export function pick(rng, list) {
  return list[Math.floor(rng() * list.length)];
}

// A fresh generator for a scene, so the left and right panels of one scene
// scatter their decorations identically.
export function sceneRandom(seed) {
  return mulberry32(seed * 7919 + 13);
}
