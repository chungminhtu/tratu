#!/usr/bin/env node

const yargs = require('yargs');
const fs = require('fs');
const path = require('path');
const wordInfo = require('./word-info');
const inquirer = require('inquirer');
const figlet = require('figlet');
const chalk = require('chalk');
const cow = require('cowsay');

const { argv } = yargs;
const word = argv._.join(' ').toLowerCase();

if (word !== '') {
  search(word);
  return;
}

figlet('TraTu', (err, text) => {
  if (err) text = '';
  console.log(text);
  prompt();
});

function prompt() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'word',
      message: 'Your word:',
    }
  ])
    .then(({ word }) => {
      if (word === '.exit') {
        console.log('Bye!');
        return;
      }
      return search(word, prompt);
    })
    .catch(e => {
      console.log(chalk.bgRed('There is an unexpected error! We sorry about that.'));
      return;
    });
}

function search(word, cb) {
  console.log(chalk.bgGreen(`Searching for ${word}...`));
  const readStream = fs.createReadStream(path.join(__dirname, 'data', 'av.txt'), {
    encoding: 'utf-8'
  });

  let wordsBuffer = [];
  readStream.on('data', chunk => {
    wordsBuffer.push(chunk);
  }).on('end', () => {
    const words = wordsBuffer.join().split('\n').slice(3);
    words.some((w, i) => {
      const targetWord = wordInfo(w, 'word');
      if (!targetWord) {
        if (i === words.length - 1) {
          console.log(
            cow.say({
              text: 'No Result!',
              e: 'XX'
            })
          );
          if (typeof cb === 'function') cb();
        }
        return false
      };
      if (targetWord[0].trim().toLowerCase() === word ) {
        let text = '';
        wordInfo(w, 'meaning').forEach(meaning => {
          text += `- ${meaning.trim()}\n`;
        });
        console.log(cow.say({ text }));
        if (typeof cb === 'function') cb();
        return true;
      }
    });
  });
}

