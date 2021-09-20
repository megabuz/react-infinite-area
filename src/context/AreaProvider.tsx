import { Interpolation, SpringRef, to } from "@react-spring/web";
import React, { useContext, useEffect } from "react";
import { AreaSpringProps, AreaSpringValues } from "../types";
import { useScrollAndZoom } from "./useScrollAndZoom";
import {
  Boundaries,
  useGetThumbContextValues,
} from "./useGetThumbContextValues";

const ContainerRefContext = React.createContext<React.RefObject<HTMLElement>>({
  current: null,
});

const ScrollablePropsContext = React.createContext<
  readonly [AreaSpringValues, SpringRef<AreaSpringProps>] | null
>(null);

const ScrollBarThumbsContext = React.createContext<{
  xPos: Interpolation<number, any>;
  width: Interpolation<number, any>;
  yPos: Interpolation<number, any>;
  height: Interpolation<number, any>;
}>({
  xPos: to([], () => 0),
  width: to([], () => 1),
  yPos: to([], () => 0),
  height: to([], () => 1),
});

type ProviderProps<T extends HTMLElement> = {
  containerRef: React.RefObject<T>;
} & Boundaries;

export function AreaRefProvider<T extends HTMLElement>({
  children,
  containerRef,
  ...boundaries
}: React.PropsWithChildren<ProviderProps<T>>) {
  useEffect(() => {
    const style = containerRef.current?.style;
    if (style != null) {
      style.position = "relative";
      style.overflow = "hidden";
      style.touchAction = "none";
      style.overscrollBehavior = "none";
    }
  }, [containerRef]);

  const springProps = useScrollAndZoom(containerRef);
  const thumbContextValues = useGetThumbContextValues(
    containerRef,
    springProps[0],
    boundaries
  );

  return (
    <ContainerRefContext.Provider value={containerRef}>
      <ScrollablePropsContext.Provider value={springProps}>
        <ScrollBarThumbsContext.Provider value={thumbContextValues}>
          {children}
        </ScrollBarThumbsContext.Provider>
      </ScrollablePropsContext.Provider>
    </ContainerRefContext.Provider>
  );
}

export const useZoomAndScrollSpringProps = () => {
  const result = useContext(ScrollablePropsContext);
  if (result == null) {
    throw new Error("You need to initialize containerRefProvider first");
  }
  return result;
};

export const useContainerRef = () => useContext(ContainerRefContext);
export const useThumbValues = () => useContext(ScrollBarThumbsContext);
