import { SpringValue } from "@react-spring/web";

export type Point = readonly [number, number];

export type AreaSpringProps = {
  left: number;
  top: number;
  scale: number;
};

export type AreaSpringValues = {
  // eslint-disable-next-line no-unused-vars
  [K in keyof AreaSpringProps]: SpringValue<number>;
};
