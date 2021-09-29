import { ScrolledAndZoomedArea } from "./ScrolledAndZoomedArea";
import { ScrollBar, ScrollBarThumb } from "./scrollbars";
import { AreaRefProvider } from "./context";

export * from "./hooks";
export {
  useContainerRef,
  useThumbValues,
  useZoomAndScrollSpringProps,
} from "./context";

export const InfiniteArea = {
  Provider: AreaRefProvider,
  Root: ScrolledAndZoomedArea,
  ScrollBar,
  ScrollBarThumb,
};
