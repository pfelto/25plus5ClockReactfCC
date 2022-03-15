import { useState, useEffect } from "react";

const sound = { src: "https://www.myinstants.com/media/sounds/beep.mp3" };

const STATUS = {
  IDLE: "IDLE",
  ACTIVE: "ACTIVE",
};

function LengthComponent({ status, title, length, handleClick }) {
  const isACTIVE = status === STATUS.ACTIVE;

  return (
    <div>
      <h2>{title}</h2>
      <button onClick={() => handleClick(-1, title)} disabled={isACTIVE}>
        decrement
      </button>
      {length}
      <button onClick={() => handleClick(1, title)} disabled={isACTIVE}>
        increment
      </button>
    </div>
  );
}

function SessionClock({ title, length }) {
  return (
    <div>
      <h2>{title}</h2>
      {length}
    </div>
  );
}

function App() {
  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [timer, setTimer] = useState({ id: "Session", length: 25 });
  const [status, setStatus] = useState(STATUS.IDLE);

  useEffect(() => {
    if (timer.length === -1) {
      if (timer.id === "Session") {
        setTimer({ id: "Break", length: breakLength });
      } else {
        setTimer({ id: "Session", length: sessionLength });
      }
    }
    if (timer.length > -1 && status !== STATUS.IDLE) {
      const timerId = setTimeout(() => {
        setTimer({ ...timer, length: timer.length - 1 });
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [timer, status, breakLength, sessionLength]);

  function handleClick(value, title) {
    if (title === "Session") {
      if (
        (sessionLength === 60 && value === 1) ||
        (sessionLength === 1 && value === -1)
      ) {
        return;
      }
      setSessionLength((sessionLength) => sessionLength + value);
      setTimer({ ...timer, length: sessionLength + value });
    } else {
      if (
        (breakLength === 60 && value === 1) ||
        (breakLength === 1 && value === -1)
      ) {
        return;
      }
      setBreakLength((breakLength) => breakLength + value);
      setTimer({ ...timer, length: breakLength + value });
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
        onClick={() => {
          if (status === STATUS.IDLE) setStatus(STATUS.ACTIVE);
          else setStatus(STATUS.IDLE);
        }}
      >
        {status === STATUS.IDLE ? "play" : "stop"}
      </button>
      <button
        onClick={() => {
          setSessionLength(25);
          setBreakLength(5);
          setTimer({ id: "Session", length: 25 });
          setStatus(STATUS.IDLE);
        }}
      >
        reset
      </button>
    </div>
  );
}

export default App;
