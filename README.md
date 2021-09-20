# React-Infinite-Area

React Inifinte Area is an infinite scrollable and zoomable component.

Scrollbars only have a position style, you can use any solution for the presentation styling.

## Installation

```
npm i -S react-infinite-area
```

## Usage

There are several components need to be placed. See full example and detailed explanation below.

```jsx
import { InfiniteArea } from "react-infinite-area";

function App() {
  const ref = useRef(null);
  // you know better how to calculate boundaries of items in the area
  const { minX, minY, maxX, maxY } = useMyOwnCustomBoundariesCalc();
  return (
    <InfiniteArea.Provider
      containerRef={ref}
      minX={minX}
      minY={minY}
      maxX={maxX}
      maxY={maxY}
    >
      <div ref={ref}>
        <InfiniteArea.Root>Content</InfiniteArea.Root>
        <InfiniteArea.ScrollBar orientation="horizontal">
          <InfiniteArea.ScrollBarThumb />
        </InfiniteArea.ScrollBar>
        <InfiniteArea.ScrollBar orientation="vertical">
          <InfiniteArea.ScrollBarThumb />
        </InfiniteArea.ScrollBar>
      </div>
    </InfiniteArea.Provider>
  );
}
```

### Container

First of all, you will need a container for the scrollable area.

```jsx
const ref = useRef(null);

return <div ref={ref} />;
```

_🔥 be careful! react-infinite-area will add below css to container_

```css
 {
  position: relative;
  overflow: hidden;
  touch-action: none;
  overscroll-behavior: none;
}
```

### Provider and scrollable area

Second you need to calculate boundaries of the content inside scrollable area, wrap the container with `InfiniteArea.Provider` and add `InfiniteArea.Root` with your content inside.

_We delegate this logic to developers as sometimes it can be easier and faster to calculate it manually_

```jsx
const { minX, minY, maxX, maxY } = useMyOwnCustomBoundariesCalc();
return (
  <InfiniteArea.Provider
    containerRef={ref}
    minX={minX}
    minY={minY}
    maxX={maxX}
    maxY={maxY}
  >
    <div ref={ref}>
      <InfiniteArea.Root>Content</InfiniteArea.Root>
    </div>
  </InfiniteArea.Provider>
);
```

On this step you should be able to use mouse wheel and pinch to scroll and zoom

### Scrollbars

Finally you need to add scrollbar on **the same level** as `InfiniteArea.Root` and style it according to your design

```jsx
<div ref={ref}>
  <InfiniteArea.Root>Content</InfiniteArea.Root>
  <InfiniteArea.ScrollBar orientation="horizontal">
    <InfiniteArea.ScrollBarThumb />
  </InfiniteArea.ScrollBar>
  <InfiniteArea.ScrollBar orientation="vertical">
    <InfiniteArea.ScrollBarThumb />
  </InfiniteArea.ScrollBar>
</div>
```

💅 `ScrollBar` and `ScrollBarThumb` components accept the `className` props. The positions for scroll bars and thumbs are predefined.

You can use css variables to control position:

- `--infinite-area-scroll-size` defines the width of the horizontal scroll bar and the height of the vertical scroll bar (8px by default);
- `--infinite-area-scroll-margin` specifies margin from the edges of the container (0px by default);
- `--infinite-area-scroll-corner-size` controls padding from the corner between the scroll bars to prevent overlap (--infinite-area-scroll-size by default);
- `--infinite-area-scroll-thumb-margin` specifies thumbs margins from scrollbars edges (0px by default);

Orientation of scroll bars is exposed as `data-orientation` attribute to both components.

## Available hooks

_You can use hooks in components inside `InfiniteArea.Provider`_

- `useInfiniteAreaPagePointRemap` returns a function that converts `[x, y]` position from the page coordinates to the coordinates of the local area in accordance with scrolling and zooming.

- `useInfiniteAreaContainerPointRemap` is the same but instead of page coordinates it remapes unscrolled, unzoomed container coordinates
