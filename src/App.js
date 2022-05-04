import "./App.css";

import React, { useRef, useState } from "react";
import Picker from "emoji-picker-react";
import { characterBits } from "./CharacterBits";
import { Button, Form, Card, OverlayTrigger, Tooltip } from "react-bootstrap";

let firstInputChar = null;

const App = () => {
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [emojiPattern, setEmojiPattern] = useState("");
  const ref = useRef();
  const [copied, setCopied] = useState(false);
  const [textError, settextError] = useState(null);
  const [emojiError, setEmojiError] = useState(null);

  //Emoji Picker Handler
  const onEmojiClick = (event, emojiObject) => {
    if (emojiError) {
      setEmojiError(null);
    }
    console.log(emojiObject);
    setChosenEmoji(emojiObject);
  };

  //Input Changle Handler
  const onchangeHandler = (event) => {
    const value = event.target.value.trim();
    if (!firstInputChar) {
      if (textError) {
        settextError(null);
      }
      firstInputChar = value;
      setUserInput(value.toUpperCase());
      return;
    }
    if (!value) {
      firstInputChar = "";
      setUserInput("");
      return;
    }
    const currentInputlastChar = value.charCodeAt([value.length - 1]);

    if (
      ((currentInputlastChar >= 48 && currentInputlastChar <= 57) ||
        (currentInputlastChar >= 65 && currentInputlastChar <= 90) ||
        (currentInputlastChar >= 97 && currentInputlastChar <= 122) ||
        isNaN(currentInputlastChar)) &&
      isNaN(firstInputChar) === isNaN(value[value.length - 1])
    ) {
      if (textError) {
        settextError(null);
      }
      setUserInput(value.toUpperCase());
    } else {
      if (isNaN(firstInputChar) !== isNaN(value[value.length - 1])) {
        settextError("Enter either only Digits or only Characters!");
      }
      setUserInput((prev) => prev);
    }
  };

  const copyPatternHanlder = () => {
    setCopied(true);
    let data = ref.current.innerText;
    console.log(data);
    data = data.replace(/⬜/g, " " + " " + " ");
    // data.replace('   ', '      ');
    navigator.clipboard.writeText(data);
    // navigator.clipboard.writeText(data);
  };


  const getTransformedNum = (n) => {
    if (n < 1e4) return n;
    if (n >= 1e4 && n < 1e6) return Math.floor(n / 1e3) + "K";
    if (n >= 1e6 && n < 1e9) return Math.floor(n / 1e6) + "M";
    if (n >= 1e9 && n < 1e12) return Math.floor(n / 1e9) + "B";
    if (n >= 1e12) return Math.floor(n / 1e12) + "T";
  };

  // Form Submit Hanlder
  const generateEmojiPatternHandler = (event) => {
    event.preventDefault();
    if (!userInput) {
      settextError("Text must not be Empty!");
      return;
    } else {
      if (textError) {
        settextError(null);
      }
    }
    if (!chosenEmoji) {
      setEmojiError("Please Select Emoji!");
      return;
    } else {
      if (emojiError) {
        setEmojiError(null);
      }
    }

    if (copied) {
      setCopied(false);
    }

    const transformedInput = !isNaN(userInput) ? getTransformedNum(userInput) : userInput;

    let mergedArray = null;
    [...transformedInput].forEach((char, index) => {
      const currentBitPattent = characterBits[char];
      if (!mergedArray) {
        mergedArray = currentBitPattent;
      } else {
        mergedArray = mergedArray.map((bits, index) =>
          bits.concat(["  ", ...currentBitPattent[index]])
        );
      }
    });
    mergedArray = mergedArray.map((bits, index) => bits.concat(["\n"]));
    let actualPattern = "";
    mergedArray.forEach((bits) => {
      bits.forEach(
        (bit) =>
        (actualPattern +=
          // bit === 1 ? chosenEmoji.emoji : bit === 0 ? "⬜" : bit)
          // bit === 1 ? chosenEmoji.emoji : bit === 0 ? "ㅤ" : bit)
          // bit === 1 ? chosenEmoji.emoji : bit === 0 ? String.fromCharCode("U+2003") + String.fromCharCode("U+2003") + String.fromCharCode("U+2005") : bit)
          // bit === 1 ? chosenEmoji.emoji : bit === 0 ? "ㅤ " : bit)
          // bit === 1 ? chosenEmoji.emoji : bit === 0 ? "ㅤ " : bit)
          // bit === 1 ? chosenEmoji.emoji : bit === 0 ? " " + " " + " " : bit)
          // bit === 1 ? chosenEmoji.emoji : bit === 0 ? " " + " " + " " : bit)
          bit === 1 ? chosenEmoji.emoji : bit === 0 ? "⬜" : bit)
        // bit === 1 ? chosenEmoji.emoji : bit === 0 ? "       " : bit)
        // bit === 1 ? chosenEmoji.emoji : bit === 0 ? String.fromCharCode("&#8195;") + String.fromCharCode("&#8195;") : bit)
      );
    });
    setEmojiPattern(actualPattern);
  };

  return (
    <div className="App d-flex flex-column align-items-center">
      <div className="title-container mt-3 p-2">
        <h1>Emoji Pattern Generator</h1>
      </div>
      <div className="content-container mt-5 align-items-start">
        <Form
          noValidate
          onSubmit={generateEmojiPatternHandler}
          className="d-flex flex-column p-2 align-items-start form-container"
        >
          <Form.Group
            className="mb-3 w-100"
            controlId="exampleForm.ControlTextarea1"
          >
            <Form.Label className="me">
              <strong>Enter Text</strong>
            </Form.Label>
            <Form.Control
              type="text"
              required
              maxLength={isNaN(firstInputChar) ? 4 : 15}
              placeholder="Enter text..."
              onChange={onchangeHandler}
              value={userInput}
              className="w-100"
            />
            {textError && <small className="text-danger fw-bold">
              {textError}
            </small>}
          </Form.Group>
          <div className="emojiPicker-container text-center w-100">
            <Form.Label className="me text-start w-100">
              <strong>Select Emoji</strong>
            </Form.Label>
            <div className="picker__container w-100">
              <Picker onEmojiClick={onEmojiClick} />
              {chosenEmoji && (
                <span className="chosenEmoji mt-3 d-inline-block text-center">
                  <strong>You Selected:</strong> {chosenEmoji.emoji}
                </span>
              )}
            </div>
            {emojiError && <div className="text-start mt-2 fw-bold"><small className="text-danger">
              {emojiError}
            </small></div>}
          </div>
          <Button variant="primary" className="m-auto mt-3" type="submit">
            Generate Pattern
          </Button>
        </Form>

        {emojiPattern && (
          <Card className="output-container ms-5">
            <Card.Header className="d-flex justify-content-between">
              <h3 className="m-0">Pattern :</h3>
              <OverlayTrigger
                overlay={
                  <Tooltip id="tooltip-disabled">
                    {copied ? "Already Copied" : "Copy Pattern"}
                  </Tooltip>
                }
              >
                <span className="d-inline-block">
                  <Button
                    onClick={copyPatternHanlder}
                    variant="outline-success"
                    className="m-0"
                  >
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </span>
              </OverlayTrigger>
            </Card.Header>
            <Card.Body>
              <div className="text-center">
                <pre className="output" id="pattern-container" ref={ref}>
                  {emojiPattern}
                </pre>
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default App;
