export interface IZoomifyImage {
  init: () => Promise<boolean>;
  start: () => Promise<void>;
  stop: () => void;
}
