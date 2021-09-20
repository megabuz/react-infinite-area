import React from "react";
import { useThumbValues, useZoomAndScrollSpringProps } from "../context";
import { cssScrollSize, cssScrollCorner, cssScrollMargin } from "./css";
import { ThubmOrientationContext } from "./ScrollBarThumb";

type ScrollProps = {
  orientation: "vertical" | "horizontal";
} & Omit<JSX.IntrinsicElements["div"], "onClick">;

export const ScrollBar: React.FC<ScrollProps> = ({
  orientation,
  children,
  style,
  ...props
}) => {
  const [{ left, top }, api] = useZoomAndScrollSpringProps();
  const contentPosition = orientation === "horizontal" ? left : top;

  const { xPos, yPos, width, height } = useThumbValues();
  const size = orientation === "horizontal" ? width : height;
  const position = orientation === "horizontal" ? xPos : yPos;

  return (
    <div
      {...props}
      data-orientation={orientation}
      style={
        orientation === "horizontal"
          ? {
              ...style,
              position: "absolute",
              left: cssScrollMargin,
              bottom: cssScrollMargin,
              height: cssScrollSize,
              right: cssScrollCorner,
              userSelect: "none",
            }
          : {
              ...style,
              position: "absolute",
              top: cssScrollMargin,
              right: cssScrollMargin,
              width: cssScrollSize,
              bottom: cssScrollCorner,
              userSelect: "none",
            }
      }
      onClick={(event) => {
        event.stopPropagation();
        const target = event.target as HTMLDivElement;
        const clickPosition =
          orientation === "horizontal"
            ? event.nativeEvent.offsetX
            : event.nativeEvent.offsetY;
        const fullSize =
          orientation === "horizontal"
            ? target.getBoundingClientRect().width
            : target.getBoundingClientRect().height;

        const isBefore = clickPosition <= position.get() * fullSize;
        const inThumb =
          !isBefore &&
          clickPosition <= (position.get() + size.get()) * fullSize;
        if (inThumb) {
          return;
        }
        const newPosition = isBefore
          ? contentPosition.get() + fullSize * 0.9
          : contentPosition.get() - fullSize * 0.9;

        orientation === "horizontal"
          ? api.set({ left: newPosition })
          : api.set({ top: newPosition });
      }}
    >
      <ThubmOrientationContext.Provider value={orientation}>
        {children}
      </ThubmOrientationContext.Provider>
    </div>
  );
};
