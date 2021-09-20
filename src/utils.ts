import React from "react";
import { Point } from "./types";

export function convertPointToContainerBoundaries<T extends HTMLElement>(
  containerRef: React.RefObject<T>,
  pagePoint: Point
) {
  const bbox = containerRef.current?.getBoundingClientRect();
  // scroll should be 0, but anyway
  const scrollLeft = containerRef.current?.scrollLeft ?? 0;
  const scrollTop = containerRef.current?.scrollTop ?? 0;
  return [
    pagePoint[0] - (bbox?.left ?? 0) + scrollLeft,
    pagePoint[1] - (bbox?.top ?? 0) + scrollTop,
  ] as const;
}
