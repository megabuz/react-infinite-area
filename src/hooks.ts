import { useCallback } from "react";
import { useContainerRef, useZoomAndScrollSpringProps } from "./context";
import { Point } from "./types";
import { convertPointToContainerBoundaries } from "./utils";

export const useInfiniteAreaContainerPointRemap = () => {
  const [{ scale, left, top }] = useZoomAndScrollSpringProps();
  return useCallback(
    ([x, y]: Point) => {
      return [
        (x - left.get()) / scale.get(),
        (y - top.get()) / scale.get(),
      ] as const;
    },
    [left, scale, top]
  );
};

export const useInfiniteAreaPagePointRemap = () => {
  const containerRef = useContainerRef();
  const areaTransform = useInfiniteAreaContainerPointRemap();
  return useCallback(
    (p: Point) => {
      const pointToArea = convertPointToContainerBoundaries(containerRef, p);
      return areaTransform(pointToArea);
    },
    [areaTransform, containerRef]
  );
};
