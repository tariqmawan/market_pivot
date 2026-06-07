const mojibakePattern = /(?:Ã|Â|Ø|Ù|à¤|à¥|ðŸ|�|\uFFFD|Tr�duction|अनुवाद:)/;
const repeatedQuestionPattern = /\?{2,}/;
const inlineReplacementPattern = /[\p{L}]\?[\p{L}]/gu;

export function isBrokenTranslation(value: unknown): boolean {
  if (typeof value !== "string") return false;
  if (mojibakePattern.test(value) || repeatedQuestionPattern.test(value)) return true;
  return [...value.matchAll(inlineReplacementPattern)].length >= 2;
}
