import React from "react";
import { animated } from "@react-spring/web";
import { useZoomAndScrollSpringProps } from "./context";

export const ScrolledAndZoomedArea: React.FC = ({ children }) => {
  const [{ scale, left, top }] = useZoomAndScrollSpringProps();
  return (
    <animated.div
      style={{
        position: "absolute",
        translateX: left,
        translateY: top,
        scale,
      }}
    >
      {children}
    </animated.div>
  );
};
