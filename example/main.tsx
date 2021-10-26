import "./index.css";

import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useDrag } from "@use-gesture/react";
import { InfiniteArea, usePagePointTransform } from "../src";

const ITEM_SIZE = 100;

type Point = readonly [number, number];

type Item = {
  point: Point;
  color: string;
  text?: string;
};

const App: React.VFC = () => {
  const containerRef = useRef(null);
  const [items, setItems] = useState<Item[]>([
    {
      text: "Scroll and zoom",
      color: "lightgrey",
      point: [350, 50],
    },
  ]);

  const boundaries = calcBoundaries(items);
  const onNewItem = (i: Item) => setItems((current) => [...current, i]);
  return (
    <div className="wrapper">
      <InfiniteArea.Provider containerRef={containerRef} {...boundaries}>
        <div className="dragWrapper">
          <div>Drag items</div>
          <DraggableItem onNewItem={onNewItem} color="red" />
          <DraggableItem onNewItem={onNewItem} color="blue" />
          <DraggableItem onNewItem={onNewItem} color="green" />
        </div>
        <div ref={containerRef} className="container">
          <InfiniteArea.Root>
            {items.map(({ point, color, text }, index) => (
              <div
                key={index}
                className="item"
                style={{
                  left: point[0],
                  top: point[1],
                  backgroundColor: color,
                }}
              >
                {text}
              </div>
            ))}
          </InfiniteArea.Root>
          <InfiniteArea.ScrollBar
            orientation="horizontal"
            className="scrollbar"
          >
            <InfiniteArea.ScrollBarThumb className="thumb" />
          </InfiniteArea.ScrollBar>
          <InfiniteArea.ScrollBar orientation="vertical" className="scrollbar">
            <InfiniteArea.ScrollBarThumb className="thumb" />
          </InfiniteArea.ScrollBar>
        </div>
      </InfiniteArea.Provider>
    </div>
  );
};

type DraggableItemProps = {
  onNewItem: (i: Item) => void;
  color: string;
};

const DraggableItem = ({ onNewItem, color }: DraggableItemProps) => {
  const [tmpItem, setTmpItem] = useState<Point | null>(null);

  const converter = usePagePointTransform();
  const bindDrag = useDrag(({ xy, last }) => {
    if (last) {
      setTmpItem(null);
      // we convert page point to position inside area
      onNewItem({ point: converter(xy), color });
    } else {
      setTmpItem(xy);
    }
  });

  return (
    <>
      <div
        {...bindDrag()}
        className="drag"
        style={{ backgroundColor: color }}
      />
      {tmpItem != null ? (
        <div
          className="tmpItem"
          style={{
            left: tmpItem[0],
            top: tmpItem[1],
            backgroundColor: color,
            opacity: 0.7,
          }}
        />
      ) : null}
    </>
  );
};

const calcBoundaries = (items: Item[]) => {
  const minX =
    items.length === 0 ? null : Math.min(...items.map(({ point }) => point[0]));
  const maxX =
    items.length === 0
      ? null
      : Math.max(...items.map(({ point }) => point[0])) + ITEM_SIZE;
  const minY =
    items.length === 0 ? null : Math.min(...items.map(({ point }) => point[1]));
  const maxY =
    items.length === 0
      ? null
      : Math.max(...items.map(({ point }) => point[1])) + ITEM_SIZE;
  return { minX, minY, maxX, maxY };
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
