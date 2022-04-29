import './App.css';

import React, { useRef, useState } from 'react';
import Picker from 'emoji-picker-react';
// import Emoji from 'react-emoji-render';
import { characterBits } from './CharacterBits';
import { Button, Form, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
// import 'emoji-mart/css/emoji-mart.css'
// import { Picker } from 'emoji-mart';

const App = () => {
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [emojiPattern, setEmojiPattern] = useState("");
  const ref = useRef();
  const [copied, setCopied] = useState(false);


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

  const copyPatternHanlder = () => {
    setCopied(true);
    let data = ref.current.innerText;
    data = data.replace(/\u2B1C/g, "      ");
    // data.replace('   ', '      ');
    console.log("text", ref.current.innerText);
    navigator.clipboard.writeText(data);
    // navigator.clipboard.writeText(data);
  }

  const getTransformedNum = (n) => {
    if (n < 1e4) return n;
    if (n >= 1e4 && n < 1e6) return Math.floor((n / 1e3)) + "K";
    if (n >= 1e6 && n < 1e9) return Math.floor((n / 1e6)) + "M";
    if (n >= 1e9 && n < 1e12) return Math.floor((n / 1e9)) + "B";
    if (n >= 1e12) return +(n / 1e12).toFixed(0) + "T";
  }

  const generateEmojiPatternHandler = (event) => {
    event.preventDefault();
    if (copied) {
      setCopied(false);
    }
    if (!chosenEmoji) {
      alert("please choose Emoji!");
      return;
    }
    if (!userInput) {
      alert("please enter text!");
      return;
    }

    const transformedInput = getTransformedNum(userInput);
    console.log("transformedInput", transformedInput);

    let mergedArray = null;
    // [...userInput].forEach((char, index) => {
    //   const currentBitPattent = characterBits[char];
    //   if (!mergedArray) {
    //     mergedArray = currentBitPattent;
    //   } else {
    //     mergedArray = mergedArray.map((bits, index) => bits.concat([0, ...currentBitPattent[index]]));
    //   }
    // });
    [...transformedInput].forEach((char, index) => {
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
      // bits.forEach(bit => actualPattern += (bit === 1 ? chosenEmoji.emoji : (bit === 0 ? "ㅤ " : bit)))
    });
    console.log(actualPattern);
    setEmojiPattern(actualPattern);
  }

  return (
    <div className='App d-flex flex-column align-items-center'>
      <div className='title-container mt-3'>
        <h1>Emoji Pattern Generator</h1>
      </div>
      <div className='content-container d-flex flex-row mt-5 align-items-start justify-content-between' style={{ gridGap: "50px" }}>
        <Form onSubmit={generateEmojiPatternHandler} className="d-flex flex-column align-items-start text-container">
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label className='me'><strong>Enter Text</strong></Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Numbers Only..." onChange={onchangeHandler} value={userInput} style={{ resize: "none" }} />
          </Form.Group>
          <Button variant='primary' type='submit'>Generate Pattern</Button>
        </Form>
        <div className='emojiPicker-container'>
          <h3>Select Emoji</h3>
          <Picker onEmojiClick={onEmojiClick} />
          {chosenEmoji ? (
            <span className='chosenEmoji mt-3 d-inline-block text-center'><strong>You chose:</strong> {chosenEmoji.emoji}</span>
          ) : (
            <span>No emoji Chosen</span>
          )}
        </div>
        {emojiPattern && (
          <Card className='output-container'>
            <Card.Header className='d-flex justify-content-between'>
              <h3 className='m-0'>Pattern :</h3>
              <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">{copied ? "Already Copied" : "Copy Pattern"}</Tooltip>}>
                <span className="d-inline-block">
                  <Button onClick={copyPatternHanlder} className='m-0'>
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </span>
              </OverlayTrigger>
            </Card.Header>
            <Card.Body>
              <div>
                <pre className='output' id="pattern-container" ref={ref}>{emojiPattern}</pre>
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default App;
