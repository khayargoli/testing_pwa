export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// used in reactions to moved the opened reaction first
export function moveReactionToFirst(arr, element) {
  const filterOutEl = arr.filter(e => parseInt(e.videoId) !== parseInt(element.videoId))
  return [element, ...filterOutEl]
}