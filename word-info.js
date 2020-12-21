const regexs = {
  word: /(?:[\w\- ])+(?=##)/,
  type: /(?<=\*).*?(?=\|)/g,
  pronounciation: /(?<=\[).*?(?=\])/g,
  meaning: /(?<=\-).*?(?=\||\[)|(?<=\-).*/g,
  subWord: /(?<=\*).*(?=\[)|(?<=\*).*(?=\*)|(?<=\*).*/g
};

function wordInfo(word, type) {
  return word.match(regexs[type]);
}

module.exports = wordInfo;
