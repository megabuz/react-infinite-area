import React, { useRef } from "react";
import { useSpring } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import { Point } from "../types";
import { convertPointToContainerBoundaries } from "../utils";

export function useScrollAndZoom<T extends HTMLElement>(
  containerRef: React.RefObject<T>,
  { minScale = 0.1, maxScale }: { minScale?: number; maxScale?: number }
) {
  const [springProps, setSpring] = useSpring(() => ({
    left: 0,
    top: 0,
    scale: 1,

    config: {
      mass: 0.1,
      tension: 280,
      friction: 20,
      clamp: true,
    },
  }));

  const initialPinchPos = useRef<Point>([0, 0]);

  const scaleBounds = {
    min: minScale,
  } as { min?: number; max?: number };

  if (maxScale != null) {
    scaleBounds.max = maxScale;
  }

  useGesture(
    {
      onPinchStart: ({ origin }) => {
        initialPinchPos.current = convertPointToContainerBoundaries(
          containerRef,
          origin
        );
      },
      onPinch: ({ event, offset: [newScale], origin, memo }) => {
        event.preventDefault();

        const ds = newScale / springProps.scale.get() - 1;
        const dx = (initialPinchPos.current[0] - springProps.left.get()) * ds,
          dy = (initialPinchPos.current[1] - springProps.top.get()) * ds;

        const scaledX = springProps.left.get() - dx;
        const scaledY = springProps.top.get() - dy;

        const convOrigin = convertPointToContainerBoundaries(
          containerRef,
          origin
        );

        let tickX = 0;
        let tickY = 0;
        if (memo != null) {
          tickX = memo[0] - convOrigin[0];
          tickY = memo[1] - convOrigin[1];
        }

        setSpring.set({
          left: scaledX - tickX,
          top: scaledY - tickY,
          scale: newScale,
        });

        return convOrigin;
      },
      onWheel: ({ event, offset: [x, y] }) => {
        // do not go back in browser history
        event.preventDefault();
        setSpring.start({ left: -x, top: -y });
      },
    },
    {
      target: containerRef,
      eventOptions: {
        passive: false,
      },
      wheel: {
        from: () => [-springProps.left.get(), -springProps.top.get()],
      },
      pinch: {
        scaleBounds,
      },
    }
  );
  return [springProps, setSpring] as const;
}
