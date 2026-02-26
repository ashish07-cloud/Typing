/**
 * PRODUCTION WORD GENERATOR
 * Balanced Mode — 70% Easy / 30% Medium
 * Optimized for smooth rhythm with slight difficulty.
 */

const WORD_POOL = [
  // Easy words (mostly ≤5 chars)
  "the","be","to","of","and","a","in","that","have","it","for","not","on",
  "with","as","you","do","at","this","but","his","by","from","they","we",
  "say","her","she","or","an","will","my","one","all","would","there",
  "their","is","are","was","were","me","what","so","up","out","if","about",
  "who","get","which","go","when","make","can","like","time","no","just",
  "him","know","take","into","your","good","some","could","them","see",
  "other","than","then","now","look","only","come","its","over","think",
  "also","back","after","use","two","how","our","work","first","well",
  "way","even","new","want","any","these","give","day","most",
  "us","man","find","here","thing","long","down","life","call","right",
  "move","try","leave","old","mean","keep","let","put","great","same",
  "group","begin","seem","help","talk","turn","start","show","hear",
  "play","run","small","set","end","why","while","feel","high",

  // Medium words (6–8 chars)
  "people","before","little","number","system","school","family",
  "public","during","around","change","follow","between",
  "another","through","without","example","country",
  "company","problem","program","question","support",
  "service","friend","market","result","reason"
];

/**
 * Fisher-Yates shuffle
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Generate words (70% Easy / 30% Medium)
 *
 * @param {number} limit
 * @param {string} language
 * @returns {string[]}
 */
export const generateWords = (limit = 25, language = "english") => {
  const easy = WORD_POOL.filter(w => w.length <= 5);
  const medium = WORD_POOL.filter(w => w.length > 5 && w.length <= 8);

  shuffle(easy);
  shuffle(medium);

  const result = [];
  let easyIndex = 0;
  let mediumIndex = 0;

  for (let i = 0; i < limit; i++) {
    const useMedium = Math.random() < 0.3; // 30% medium

    if (useMedium && medium.length > 0) {
      if (mediumIndex >= medium.length) {
        shuffle(medium);
        mediumIndex = 0;
      }
      result.push(medium[mediumIndex++]);
    } else {
      if (easyIndex >= easy.length) {
        shuffle(easy);
        easyIndex = 0;
      }
      result.push(easy[easyIndex++]);
    }
  }

  return result;
};