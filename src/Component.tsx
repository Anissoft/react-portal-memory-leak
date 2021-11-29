import React, { useState } from "react";

export default function Component() {
  const [state, setState] = useState<React.ReactElement[]>([]);

  React.useEffect(() => {
    console.log("start child");
    const interval = setInterval(() => {
      console.log("tick");
      setState((currentState) => {
        const key = `img-${currentState.length + 1}`;
        return [
          ...currentState,
          <img key={key} src="" alt={key} />
        ];
      });
    }, 5);

    return () => {
      console.log("clear child");
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      style={{ width: 140, height: 140, padding: 80, backgroundColor: "pink" }}
    >
      <h5>Hello from detached Portal</h5>
      <h4>{state.length}</h4>
      {state}
    </div>
  );
}
