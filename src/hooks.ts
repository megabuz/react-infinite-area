import { useCallback } from "react";
import { useContainerRef, useZoomAndScrollSpringProps } from "./context";
import { Point } from "./types";
import { convertPointToContainerBoundaries } from "./utils";

export const useContainerPointTransform = () => {
  const [{ scale, left, top }] = useZoomAndScrollSpringProps();
  return useCallback(
    ([x, y]: Point) => {
      return [
        (x - left.get()) / scale.get(),
        (y - top.get()) / scale.get(),
      ] as [number, number];
    },
    [left, scale, top]
  );
};

export const usePagePointTransform = () => {
  const containerRef = useContainerRef();
  const areaTransform = useContainerPointTransform();
  return useCallback(
    (p: Point) => {
      const pointToArea = convertPointToContainerBoundaries(containerRef, p);
      return areaTransform(pointToArea);
    },
    [areaTransform, containerRef]
  );
};
