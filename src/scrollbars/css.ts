const VAR_SIZE = "infinite-area-scroll-size";
const VAR_MARGIN = "infinite-area-scroll-margin";
const VAR_CORNER = "infinite-area-scroll-corner-size";
const VAR_THUMB_MARGIN = "infinite-area-scroll-thumb-margin";

const cssVar = (name: string, fallback?: string) =>
  fallback == null ? `var(--${name})` : `var(--${name}, ${fallback})`;

export const cssScrollSize = cssVar(VAR_SIZE, "8px");
export const cssScrollMargin = cssVar(VAR_MARGIN, "0px");
export const cssScrollCorner = `calc(${cssVar(
  VAR_CORNER,
  cssScrollSize
)} + ${cssScrollMargin})`;

export const cssThumbMargin = cssVar(VAR_THUMB_MARGIN, "0px");

export const getCssThumbPosition = (pos: string) =>
  `calc(${pos} + ${cssThumbMargin})`;
export const getCssThumbSize = (size: string) =>
  `calc(${size} - 2 * ${cssThumbMargin})`;
