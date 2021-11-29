import React, { useState } from "react";

export default function Component() {
  const [state, setState] = useState<HTMLElement[]>([]);
  const childs = React.useMemo(() => {
    return state.map((_, index) => <canvas key={index} />)
  }, [state]);


  React.useEffect(() => {
    console.log("start child");
    const interval = setInterval(() => {
      console.log("tick");
      setState((currentState) => {
        return [
          ...currentState,
          document.createElement('svg'),
        ];
      });
    }, 10);

    return () => {
      console.log("clear child");
      setState([]);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      style={{ width: 140, height: 140, padding: 80, backgroundColor: "pink" }}
    >
      <h5>Hello from detached Portal</h5>
      <h4>{state.length}</h4>
      {state.length > 0 ? state.map((_, index) => <img key={`i-${index}`} />) : null}
      {childs}
    </div>
  );
}
