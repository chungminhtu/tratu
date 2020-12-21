const fs = require("fs");
const path = require("path");
const wordInfo = require("./word-info");
const cow = require("cowsay");

function translate(word, cb) {
  return new Promise((res, rej) => {
    const readStream = fs.createReadStream(
      path.join(__dirname, "data", "av.txt"),
      {
        encoding: "utf-8",
      }
    );

    let wordsBuffer = [];
    readStream
      .on("data", (chunk) => {
        wordsBuffer.push(chunk);
      })
      .on("end", () => {
        const words = wordsBuffer.join().split("\n").slice(3);
        words.some((w, i) => {
          const targetWord = wordInfo(w, "word");
          if (!targetWord) {
            if (i === words.length - 1) {
              return res(
                cow.say({
                  text: "No Result!",
                  e: "XX",
                })
              );
            }
            return false;
          }
          if (targetWord[0].trim().toLowerCase() === word) {
            let text = "";
            wordInfo(w, "meaning").forEach((meaning) => {
              text += `- ${meaning.trim()}\n`;
            });
            return res(cow.say({ text }));
          }
        });
      });
  });
}

module.exports = { translate };
