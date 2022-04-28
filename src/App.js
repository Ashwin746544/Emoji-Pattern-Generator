import './App.css';

import React, { useState } from 'react';
import Picker from 'emoji-picker-react';
// import Emoji from 'react-emoji-render';
import { characterBits } from './CharacterBits';
// import 'emoji-mart/css/emoji-mart.css'
// import { Picker } from 'emoji-mart';

const App = () => {
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [emojiPattern, setEmojiPattern] = useState("");


  const onEmojiClick = (event, emojiObject) => {
    console.log(emojiObject);
    setChosenEmoji(emojiObject);
  };

  const onchangeHandler = (event) => {
    const value = event.target.value.trim();
    const lastChar = value.charCodeAt([value.length - 1]);
    if ((lastChar >= 48 && lastChar <= 57) || (lastChar >= 65 && lastChar <= 90) || (lastChar >= 97 && lastChar <= 122) || isNaN(lastChar)) {
      setUserInput(value.toUpperCase());
    } else {
      setUserInput(prev => prev);
    }
  }

  const generateEmojiPatternHandler = () => {
    if (!chosenEmoji) {
      alert("please choose Emoji!");
      return;
    }
    if (!userInput) {
      alert("please enter text!");
      return;
    }
    let mergedArray = null;
    [...userInput].forEach((char, index) => {
      const currentBitPattent = characterBits[char];
      if (!mergedArray) {
        mergedArray = currentBitPattent;
      } else {
        mergedArray = mergedArray.map((bits, index) => bits.concat([0, ...currentBitPattent[index]]));
      }
    });
    mergedArray = mergedArray.map((bits, index) => bits.concat(["\n"]));
    let actualPattern = "";
    mergedArray.forEach(bits => {
      bits.forEach(bit => actualPattern += (bit === 1 ? chosenEmoji.emoji : (bit === 0 ? "⬜" : bit)))
    });
    console.log(actualPattern);
    setEmojiPattern(actualPattern);
  }

  return (
    <div className='App'>
      <h1>Emoji Pattern Generator</h1>
      <textarea placeholder='Enter Text' rows={5} cols={50} onChange={onchangeHandler} value={userInput}></textarea>
      <button onClick={generateEmojiPatternHandler}>Generate Pattern</button>
      <h3>Select Emoji</h3>
      <Picker onEmojiClick={onEmojiClick} />
      {chosenEmoji ? (
        <span className='chosenEmoji'><strong>You chose:</strong> {chosenEmoji.emoji}</span>
      ) : (
        <span>No emoji Chosen</span>
      )}
      {emojiPattern ? (
        <div>
          <h3>output : </h3>
          <pre className='output'>{emojiPattern}</pre>
        </div>
      ) : (
        <span>No pattern</span>
      )}
    </div>
  );
};

export default App;
