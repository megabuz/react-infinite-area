import React, { useContext, useRef } from "react";
import { animated } from "@react-spring/web";
import { useGesture } from "react-use-gesture";
import { useThumbValues, useZoomAndScrollSpringProps } from "../context";
import { cssThumbMargin, getCssThumbPosition, getCssThumbSize } from "./css";

export const ThubmOrientationContext = React.createContext<
  "vertical" | "horizontal"
>("horizontal");

type Props = Omit<JSX.IntrinsicElements["div"], "onClick">;

export const ScrollBarThumb: React.VFC<Props> = ({ style, ...props }) => {
  const orientation = useContext(ThubmOrientationContext);

  const ref = useRef<HTMLDivElement>(null);
  const { width, height, xPos, yPos } = useThumbValues();
  const [{ left, top }, api] = useZoomAndScrollSpringProps();

  const size = orientation === "horizontal" ? width : height;
  const position = orientation === "horizontal" ? xPos : yPos;

  const initialDragRef = useRef({
    position: 0,
    size: 1,
    contentPosition: 0,
  });

  const contentPosition = orientation === "horizontal" ? left : top;

  useGesture(
    {
      onDragStart: ({ event }) => {
        event.stopPropagation();
        initialDragRef.current = {
          position: position.get(),
          size: size.get(),
          contentPosition: contentPosition.get(),
        };
      },
      onDrag: ({ event, movement: [x, y] }) => {
        event.stopPropagation();
        const delta = orientation === "horizontal" ? x : y;
        const newPosition =
          initialDragRef.current.contentPosition -
          delta / initialDragRef.current.size;
        orientation === "horizontal"
          ? api.set({ left: newPosition })
          : api.set({ top: newPosition });
      },
    },
    {
      domTarget: ref,
    }
  );

  return (
    <animated.div
      {...props}
      ref={ref}
      data-orientation={orientation}
      onClick={(e) => {
        e.stopPropagation();
      }}
      style={
        orientation === "horizontal"
          ? {
              ...style,
              position: "absolute",
              left: position.to((val) => getCssThumbPosition(`${val * 100}%`)),
              width: size.to((val) => getCssThumbSize(`${val * 100}%`)),
              bottom: cssThumbMargin,
              top: cssThumbMargin,
              touchAction: "none",
            }
          : {
              ...style,
              position: "absolute",
              top: position.to((val) => getCssThumbPosition(`${val * 100}%`)),
              height: size.to((val) => getCssThumbSize(`${val * 100}%`)),
              left: cssThumbMargin,
              right: cssThumbMargin,
              touchAction: "none",
            }
      }
    />
  );
};
