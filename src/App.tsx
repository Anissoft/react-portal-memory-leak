import React, { Suspense } from "react";
import { createPortal, render, unmountComponentAtNode } from "react-dom";
import "./styles.css";

const Component = React.lazy(() => import("./Component"));

export default function App() {
  const [windowOpened, setWindowOpened] = React.useState(false);
  const [open, setOpen] = React.useState<
    | "none"
    | "portal-in-window"
    | "portal-embedded"
    | "react-tree-in-window"
    | "react-tree-embedded"
  >("none");
  const win = React.useRef<Window | null>(null);
  const root = React.useRef<HTMLDivElement | null>(null);
  const embeddedRef = React.useRef<HTMLDivElement>(null);

  const openDetachedWindow = React.useCallback(
    (url: string, onClose?: () => void) => {
      win.current = window.open(url, "_blank", "width=320,height=320");
      root.current = document.createElement("div");
      root.current.id = "root";
      win.current?.document.body.appendChild(root.current);
      win.current?.addEventListener("pagehide", () => {
        if (onClose) {
          onClose();
        }
        root.current = null;
        win.current = null;
        setWindowOpened(false);
      });
      setWindowOpened(true);
    },
    []
  );

  const closeDetachedWindow = React.useCallback(() => {
    win.current?.close();
  }, []);

  return (
    <div className="App">
      <h1>Memory leak in detached React portal</h1>
      <button
        onClick={() => {
          openDetachedWindow("");
          setOpen("portal-in-window");
        }}
      >
        OPEN WINDOW AND RENDER THROUGH PORTAL
      </button>
      <button
        onClick={() => {
          openDetachedWindow("", () => {
            if (!root.current) {
              return;
            }
            unmountComponentAtNode(root.current);
          });
          if (!root.current) {
            return;
          }
          render(
            <Suspense fallback={"...loading"}>
              <Component />
            </Suspense>,
            root.current
          );
          setOpen("react-tree-in-window");
        }}
      >
        OPEN WINDOW AND RENDER INDEPENDED REACT DOM TREE
      </button>
      <button
        onClick={() => {
          closeDetachedWindow();
          setOpen("none");
        }}
      >
        CLOSE DETACHED WINDOW
      </button>
      <div style={{ height: 16 }}></div>
      <button
        onClick={() => {
          setOpen("portal-embedded");
        }}
      >
        RENDER THROUGH PORTAL HERE
      </button>
      <button
        onClick={() => {
          setOpen("none");
        }}
      >
        REMOVE EMBEDDED PORTAL
      </button>
      <div style={{ height: 16 }}></div>
      <button
        onClick={() => {
          if (!embeddedRef.current) {
            return;
          }
          render(
            <Suspense fallback={"...loading"}>
              <Component />
            </Suspense>,
            embeddedRef.current
          );
        }}
      >
        RENDER INDEPENDED REACT DOM TREE HERE
      </button>
      <button
        onClick={() => {
          if (!embeddedRef.current) {
            return;
          }
          unmountComponentAtNode(embeddedRef.current);
        }}
      >
        UNMOUNT INDEPENDED REACT DOM TREE HERE
      </button>
      <div style={{ height: 16 }}></div>
      <Suspense fallback={"...loading"}>
        {open === "portal-in-window" &&
          windowOpened &&
          win.current &&
          root.current &&
          createPortal(<Component />, root.current)}
        {open === "portal-embedded" &&
          embeddedRef.current &&
          createPortal(<Component />, embeddedRef.current)}
      </Suspense>
      <div ref={embeddedRef}></div>
    </div>
  );
}
