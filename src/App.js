import "./App.css";

import React, { useRef, useState } from "react";
import Picker from "emoji-picker-react";
// import Emoji from 'react-emoji-render';
import { characterBits } from "./CharacterBits";
import { Button, Form, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
// import 'emoji-mart/css/emoji-mart.css'
// import { Picker } from 'emoji-mart';

let firstInputChar = null;

const App = () => {
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [emojiPattern, setEmojiPattern] = useState("");
  const ref = useRef();
  const [copied, setCopied] = useState(false);
  const [validated, setValidated] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    console.log(emojiObject);
    setChosenEmoji(emojiObject);
  };

  const onchangeHandler = (event) => {
    const value = event.target.value.trim();
    if (!firstInputChar) {
      firstInputChar = value;
      console.log("first character");
      setUserInput(value.toUpperCase());
      return;
    }
    if (!value) {
      firstInputChar = "";
      setUserInput("");
      return;
    }
    console.log("after first");
    const currentInputlastChar = value.charCodeAt([value.length - 1]);
    console.log(
      "isSame" + firstInputChar,
      "=",
      value[value.length - 1],
      " ",
      isNaN(firstInputChar) == isNaN(value[value.length - 1])
    );
    if (
      ((currentInputlastChar >= 48 && currentInputlastChar <= 57) ||
        (currentInputlastChar >= 65 && currentInputlastChar <= 90) ||
        (currentInputlastChar >= 97 && currentInputlastChar <= 122) ||
        isNaN(currentInputlastChar)) &&
      isNaN(firstInputChar) == isNaN(value[value.length - 1])
    ) {
      setUserInput(value.toUpperCase());
      console.log("valid");
    } else {
      setUserInput((prev) => prev);
      console.log("invalid");
    }
  };

  const copyPatternHanlder = () => {
    setCopied(true);
    let data = ref.current.innerText;
    data = data.replace(/\u2B1C/g, "      ");
    // data.replace('   ', '      ');
    console.log("text", ref.current.innerText);
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

  const generateEmojiPatternHandler = (event) => {
    event.preventDefault();
    if (event.target.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    if (copied) {
      setCopied(false);
    }
    if (!chosenEmoji) {
      alert("please choose Emoji!");
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
        mergedArray = mergedArray.map((bits, index) =>
          bits.concat([0, ...currentBitPattent[index]])
        );
      }
    });
    mergedArray = mergedArray.map((bits, index) => bits.concat(["\n"]));
    let actualPattern = "";
    mergedArray.forEach((bits) => {
      bits.forEach(
        (bit) =>
          (actualPattern +=
            bit === 1 ? chosenEmoji.emoji : bit === 0 ? "⬜" : bit)
      );
      // bits.forEach(bit => actualPattern += (bit === 1 ? chosenEmoji.emoji : (bit === 0 ? "ㅤ " : bit)))
    });
    console.log(actualPattern);
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
          validated={validated}
          onSubmit={generateEmojiPatternHandler}
          className="d-flex flex-column p-2 align-items-start text-container"
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
              maxLength={4}
              placeholder="Numbers Only..."
              onChange={onchangeHandler}
              value={userInput}
              className="w-100"
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid state.
            </Form.Control.Feedback>
          </Form.Group>
          <div className="emojiPicker-container text-center w-100">
            <Form.Label className="me text-start w-100">
              <strong>Select Emoji</strong>
            </Form.Label>
            <div className="picker__container w-100">
              <Picker onEmojiClick={onEmojiClick} />
              {chosenEmoji ? (
                <span className="chosenEmoji mt-3 d-inline-block text-center">
                  <strong>You Selected:</strong> {chosenEmoji.emoji}
                </span>
              ) : (
                <span className=" d-inline-block my-2">No emoji Chosen</span>
              )}
            </div>
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
                    variant="success"
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
