import './App.css';

import React, { useState } from 'react';
import Picker from 'emoji-picker-react';
// import Emoji from 'react-emoji-render';
import { characterBits } from './CharacterBits';
import { Button, Form, Card } from 'react-bootstrap';
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

  const generateEmojiPatternHandler = (event) => {
    event.preventDefault();
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
      <Form onSubmit={generateEmojiPatternHandler} className="d-flex flex-column align-items-center">
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label className='me'><strong>Enter Text</strong></Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="text..." onChange={onchangeHandler} value={userInput} style={{ resize: "none" }} />
        </Form.Group>
        <Button variant='primary' type='submit'>Generate Pattern</Button>
      </Form>
      <h3>Select Emoji</h3>
      <Picker onEmojiClick={onEmojiClick} />
      {chosenEmoji ? (
        <span className='chosenEmoji'><strong>You chose:</strong> {chosenEmoji.emoji}</span>
      ) : (
        <span>No emoji Chosen</span>
      )}
      {emojiPattern && (
        <Card>
          <Card.Header><h3>Pattern :</h3></Card.Header>
          <Card.Body>
            <div>
              <pre className='output'>{emojiPattern}</pre>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default App;
