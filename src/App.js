import { useState, useEffect } from "react";

const STATUS = {
  IDLE: "IDLE",
  ACTIVE: "ACTIVE",
};

function LengthComponent({ status, title, length, handleClick }) {
  const isACTIVE = status === STATUS.ACTIVE;

  return (
    <div>
      <h2 id={`${title.toLowerCase()}-label`}>{title} Length</h2>
      <button
        id={`${title.toLowerCase()}-decrement`}
        onClick={() => handleClick(-1, title)}
        disabled={isACTIVE}
      >
        decrement
      </button>
      <p id={`${title.toLowerCase()}-length`}>{length}</p>
      <button
        id={`${title.toLowerCase()}-increment`}
        onClick={() => handleClick(1, title)}
        disabled={isACTIVE}
      >
        increment
      </button>
    </div>
  );
}

function SessionClock({ title, length }) {
  let minutes = Math.floor(length / 60);
  let seconds = length - minutes * 60;
  let formattedMin = ("0" + minutes).slice(-2);
  let formattedSeconds = ("0" + seconds).slice(-2);
  return (
    <div>
      <h2 id="timer-label">{title}</h2>
      <p id="time-left">
        {formattedMin}:{formattedSeconds}
      </p>
      <audio
        id="beep"
        src="https://www.myinstants.com/media/sounds/alarm.mp3"
      ></audio>
    </div>
  );
}

function App() {
  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [timer, setTimer] = useState({ id: "Session", length: 1500 });
  const [status, setStatus] = useState(STATUS.IDLE);

  useEffect(() => {
    if (timer.length === 0) {
      //play audio
      const sound = document.getElementById("beep");
      sound.currentTime = 0;
      sound.play();
      if (timer.id === "Session") {
        setTimer({ id: "Break", length: breakLength * 60 });
      } else {
        setTimer({ id: "Session", length: sessionLength * 60 });
      }
    }
    if (timer.length > 0 && status !== STATUS.IDLE) {
      const timerId = setTimeout(() => {
        setTimer({ ...timer, length: timer.length - 1 });
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [timer, status, breakLength, sessionLength]);

  function handleClick(value, title) {
    let newValue = value * 60;
    if (title === "Session") {
      if (
        (sessionLength === 60 && value === 1) ||
        (sessionLength === 1 && value === -1)
      ) {
        return;
      }
      setSessionLength((sessionLength) => sessionLength + value);
      if (timer.id === "Session") {
        setTimer({ ...timer, length: sessionLength * 60 + newValue });
      }
    } else {
      if (
        (breakLength === 60 && value === 1) ||
        (breakLength === 1 && value === -1)
      ) {
        return;
      }
      setBreakLength((breakLength) => breakLength + value);
      if (timer.id === "Break") {
        setTimer({ ...timer, length: breakLength * 60 + newValue });
      }
    }
  }

  return (
    <div>
      <h1>25 + 5 Clock</h1>
      <LengthComponent
        status={status}
        title="Break"
        length={breakLength}
        handleClick={handleClick}
      />
      <LengthComponent
        status={status}
        title="Session"
        length={sessionLength}
        handleClick={handleClick}
      />
      {status === STATUS.idle || timer.id === "Session" ? (
        <SessionClock title={timer.id} length={timer.length} />
      ) : (
        <SessionClock title={timer.id} length={timer.length} />
      )}
      <button
        id="start_stop"
        onClick={() => {
          if (status === STATUS.IDLE) setStatus(STATUS.ACTIVE);
          else setStatus(STATUS.IDLE);
        }}
      >
        {status === STATUS.IDLE ? "play" : "stop"}
      </button>
      <button
        id="reset"
        onClick={() => {
          //if audio is playing. Stop it and set currentTime to 0
          const sound = document.getElementById("beep");
          if (!sound.paused) {
            sound.pause();
            sound.currentTime = 0;
          }
          setSessionLength(25);
          setBreakLength(5);
          setTimer({ id: "Session", length: 25 * 60 });
          setStatus(STATUS.IDLE);
        }}
      >
        reset
      </button>
    </div>
  );
}

export default App;
