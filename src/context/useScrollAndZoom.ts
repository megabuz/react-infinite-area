import React, { useRef } from "react";
import { useSpring } from "@react-spring/web";
import { useGesture } from "react-use-gesture";
import { Point } from "../types";
import { convertPointToContainerBoundaries } from "../utils";

const ZOOM_FACTOR = 800;

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

  const mousePos = useRef<Point>([0, 0]);

  const distanceBounds = {
    min: (minScale - 1) * ZOOM_FACTOR,
  } as { min?: number; max?: number };

  if (maxScale != null) {
    distanceBounds.max = (maxScale - 1) * ZOOM_FACTOR;
  }

  useGesture(
    {
      onPinchStart: ({ origin }) => {
        mousePos.current = convertPointToContainerBoundaries(
          containerRef,
          origin
        );
      },
      onPinch: ({ event, offset: [z] }) => {
        event.preventDefault();
        const newScale = z / ZOOM_FACTOR + 1;

        const ds = newScale / springProps.scale.get() - 1;
        var dx = (mousePos.current[0] - springProps.left.get()) * ds,
          dy = (mousePos.current[1] - springProps.top.get()) * ds;

        setSpring.start({
          left: springProps.left.get() - dx,
          top: springProps.top.get() - dy,
          scale: newScale,
        });
      },
      onWheel: ({ event, movement: [x, y] }) => {
        // do not go back in browser history
        event.preventDefault();
        setSpring.start({ left: -x, top: -y });
      },
    },
    {
      domTarget: containerRef,
      eventOptions: {
        passive: false,
      },
      wheel: {
        initial: () => [-springProps.left.get(), -springProps.top.get()],
      },
      pinch: {
        distanceBounds,
      },
    }
  );
  return [springProps, setSpring] as const;
}
