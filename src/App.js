import React, { useState, useReducer, useEffect } from "react";

import AppDisplay from "./components/AppDisplay";
import useSwitch from "./hooks/switchHook";
import useKeyboardListeners from "./hooks/useKeyboardListeners";
import { updateCamera } from "./helpers/backendRequests";

const initArrowPressed = () => {
  return {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  };
};

const reducer = (state, action) => {
  if (state[action.key] === undefined) {
    return { ...state };
  }
  switch (action.type) {
    case "keyDown":
      return { ...state, [action.key]: true };
    case "keyUp":
      return { ...state, [action.key]: false };
    default:
      throw new Error("Invalid action type for the reducer");
  }
};

function App() {
  const [started, toggle, start] = useSwitch(false);
  const [cameraStreamLoading, setCameraStreamLoading] = useState(false);

  const [arrowPressed, dispatch] = useReducer(reducer, null, initArrowPressed);

  useKeyboardListeners(dispatch);

  useEffect(() => {
    (async () => {
      await updateCamera({ started });
    })();
  }, [started]);

  const handleOnOffClick = () => {
    toggle();
    setCameraStreamLoading(!started);
  };
  const handleStartClick = () => {
    start();
    setCameraStreamLoading(true);
  };
  const handleCameraStreamLoad = () => {
    setCameraStreamLoading(false);
  };
  return (
    <AppDisplay
      started={started}
      onOffClickHandler={handleOnOffClick}
      startClickHandler={handleStartClick}
      cameraStreamLoadHandler={handleCameraStreamLoad}
      cameraStreamLoading={cameraStreamLoading}
    />
  );
}

export default App;
