import "./App.css";

import React, { useRef, useState } from "react";
import Picker from "emoji-picker-react";
import { characterBits } from "./CharacterBits";
import { Overlay, Form, Card, OverlayTrigger, Tooltip } from "react-bootstrap";

let firstInputChar = null;

const App = () => {
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [emojiPatternForPage, setEmojiPatternForPage] = useState("");
  const [emojiPatternForTwitter, setEmojiPatternForTwitter] = useState("");
  const [copied, setCopied] = useState(false);
  const [textError, settextError] = useState(null);
  const [emojiError, setEmojiError] = useState(null);
  let textRef = useRef();
  const emojiPickerRef = useRef();


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
    navigator.clipboard.writeText(emojiPatternForTwitter);
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


    //for displaying in twitter
    let actualTwitterPattern = "";
    mergedArray.forEach(bits => {
      // eslint-disable-next-line no-useless-concat
      bits.forEach(bit => actualTwitterPattern += (bit === 1 ? chosenEmoji.emoji : (bit === 0 ? " " + " " + " " : bit)))
    });
    console.log(actualTwitterPattern);
    setEmojiPatternForTwitter(actualTwitterPattern);


    //for displaying on page
    let content = mergedArray.map(
      (bits, i) => {
        const firstRow = bits.map((bit, j) => <strong key={i + " " + j}>{bit === 1 ? chosenEmoji.emoji : (bit === 0 ? <span style={{ display: "inline-block", color: "red", width: "19.23px", height: "17px" }}></span> : bit)}</strong>);
        firstRow.concat(<br />);
        return firstRow;
      });
    setEmojiPatternForPage(content);
  }

  return (
    <div className="App d-flex flex-column align-items-center">
      <div className="title-container text-center p-2">
        <h1>Emoji Pattern Generator</h1>
      </div>
      <div className="content-container mt-5 align-items-start">
        <Form
          noValidate
          onSubmit={generateEmojiPatternHandler}
          className={`d-flex flex-column align-items-start form-container ${!emojiPatternForPage && "pattern-not-exist"}`}
        >
          <Form.Group
            className="mb-3 w-100"
            controlId="exampleForm.ControlTextarea1"
            style={{ paddingBottom: textError && "30px" }}
          >
            <Form.Label className="me">
              <strong>Enter Text</strong>
            </Form.Label>
            <Form.Control
              type="text"
              ref={textRef}
              required
              maxLength={isNaN(firstInputChar) ? 4 : 15}
              placeholder="Enter text..."
              onChange={onchangeHandler}
              value={userInput}
              className="w-100"
            />
            {/* {textError && <small className="text-danger fw-bold">
              {textError}
            </small>} */}
            <Overlay target={textRef.current} show={textError ? true : false} placement="bottom" className="bg-danger">
              {(props) => (
                <Tooltip id="overlay-example" {...props} className="custom-tooltip">
                  {textError}
                </Tooltip>
              )}
            </Overlay>

          </Form.Group>
          <div className="emojiPicker-container text-center w-100" style={{ paddingBottom: emojiError && "30px" }}>
            <Form.Label className="me text-start w-100">
              <strong>Select Emoji</strong>
            </Form.Label>
            <div className="picker__container w-100" ref={emojiPickerRef}>
              <Picker onEmojiClick={onEmojiClick} />
              {chosenEmoji && (
                <span className="chosenEmoji mt-3 d-inline-block text-center">
                  <strong>You Selected:</strong> {chosenEmoji.emoji}
                </span>
              )}
            </div>
            {/* {emojiError && <div className="text-start mt-2 fw-bold"><small className="text-danger">
              {emojiError}
            </small></div>} */}
            <Overlay target={emojiPickerRef.current} show={emojiError ? true : false} placement="bottom" className="bg-danger">
              {(props) => (
                <Tooltip id="overlay-example" {...props} className="custom-tooltip">
                  {emojiError}
                </Tooltip>
              )}
            </Overlay>
          </div>
          <button variant="primary" className="m-auto mt-3 generate-btn" type="submit">
            Generate Pattern
          </button>
        </Form>

        {emojiPatternForPage && (
          <Card className="output-container ms-5">
            <Card.Header className="d-flex justify-content-between output-header">
              <h3 className="m-0">Pattern :</h3>
              <OverlayTrigger
                overlay={
                  <Tooltip id="tooltip-disabled">
                    {copied ? "Already Copied" : "Copy Pattern"}
                  </Tooltip>
                }
              >
                <span className="d-inline-block">
                  <button
                    onClick={copyPatternHanlder}
                    className="m-0 copy-btn"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </span>
              </OverlayTrigger>
            </Card.Header>
            <Card.Body>
              <div className="text-center">
                <pre className={`output text-start mb-0 ${copied && "animate-pattern"}`} id="pattern-container">
                  {emojiPatternForPage}
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
