import React, { useMemo } from "react";
import { SpringValue, to } from "@react-spring/web";
import useResizeObserver from "use-resize-observer";
import { AreaSpringValues } from "../types";

type CalcProps = {
  minPosition: number | null;
  maxPosition: number | null;
  areaSize: number;
  areaPosition: SpringValue<number>;
  areaScale: SpringValue<number>;
};

const calcPosAndSize = ({
  minPosition,
  maxPosition,
  areaSize,
  areaPosition,
  areaScale,
}: CalcProps) => {
  const beforeDoesNotCover =
    minPosition == null
      ? 0
      : to([minPosition, areaPosition, areaScale], (min, pos, scale) => {
          return -Math.min(min * scale + pos, 0);
        });

  const afterDoesNotCover =
    maxPosition == null
      ? 0
      : to(
          [areaSize, maxPosition, areaPosition, areaScale],
          (area, max, pos, scale) => {
            const maxx = max * scale + pos;
            return Math.max(maxx - area, 0);
          }
        );

  const fullWidth = to(
    [beforeDoesNotCover, areaSize, afterDoesNotCover],
    (before, area, after) => before + area + after
  );

  const pos = to([beforeDoesNotCover, fullWidth], (before, fw) => before / fw);
  const size = to([areaSize, fullWidth], (area, fw) => area / fw);

  return [pos, size] as const;
};

export type Boundaries = {
  minX: number | null;
  maxX: number | null;
  minY: number | null;
  maxY: number | null;
};

export const useGetThumbContextValues = (
  containerRef: React.RefObject<HTMLElement>,
  { left, top, scale }: AreaSpringValues,
  { minX, maxX, minY, maxY }: Boundaries
) => {
  const rect = useResizeObserver({ ref: containerRef });

  const [xPos, width] = calcPosAndSize({
    minPosition: minX,
    maxPosition: maxX,
    areaSize: rect.width || 1,
    areaPosition: left,
    areaScale: scale,
  });

  const [yPos, height] = calcPosAndSize({
    minPosition: minY,
    maxPosition: maxY,
    areaSize: rect.height || 1,
    areaPosition: top,
    areaScale: scale,
  });

  return useMemo(
    () => ({
      xPos,
      width,
      yPos,
      height,
    }),
    [height, width, xPos, yPos]
  );
};
