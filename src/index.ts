import { ScrolledAndZoomedArea } from "./ScrolledAndZoomedArea";
import { ScrollBar, ScrollBarThumb } from "./scrollbars";
import { AreaRefProvider } from "./context";

export * from "./hooks";

export const InfiniteArea = {
  Provider: AreaRefProvider,
  Root: ScrolledAndZoomedArea,
  ScrollBar,
  ScrollBarThumb,
};
