/**

A simple utility class to zoomify background image
@param container - HTMLElement
@param autoStop - Set true to stop automatically when use mouse out. false to control from outside
@returns IMagnifyImage */

import { IZoomifyImage } from './interfaces';

export class Zoomify implements IZoomifyImage {
  private imageUrl = '';
  private imageWidth = 0;
  private imageHeight = 0;
  private ratio = 0;
  private isLoaded = false;
  private autoStop: boolean;
  private imageSrc: HTMLImageElement;
  private container: HTMLElement;

  constructor(container: HTMLElement, autoStop = false) {
    this.container = container;
    this.autoStop = autoStop;
    const imageCss = window.getComputedStyle(container);

    if (imageCss.backgroundImage) {
      this.imageUrl = imageCss.backgroundImage.slice(4, -1).replace(/['"]/g, '');
    }

    this.imageSrc = new Image();
  }

  /**
   * static function to start zoomify immediately
   * @param container  - A html element where to load
   * @returns Promise<IZoomifyImage>
   */
  static run(container: HTMLElement): Promise<IZoomifyImage> {
    return new Promise(async (resolve) => {
      const zoomify = new Zoomify(container, true);
      await zoomify.start();
      resolve(zoomify);
    });
  }

  /**
   * Initialize image
   * @returns Promise<boolean>
   */
  init(): Promise<boolean> {
    return new Promise(resolve => {
      this.imageSrc.onload = () => {
        this.imageWidth = this.imageSrc.naturalWidth;
        this.imageHeight = this.imageSrc.naturalHeight;
        this.ratio = this.imageHeight / this.imageWidth;

        const percentage = this.ratio * 100 + '%';
        this.container.style.paddingBottom = percentage;
        this.isLoaded = true;
      };
      this.imageSrc.src = this.imageUrl;
      resolve(this.isLoaded);
    });
  }

  /**
   * Start zoomify. Useful method to control from outside
   */

  async start() {
    if (!this.isLoaded) {
      await this.init();
    }
    this.afterLoad();
  }

  /**
   * Stop zoomify. Useful to control from outside
   */
  stop(): void {
    this.reset();
    this.container.onmousemove = null;
    this.container.onmouseout = null;
  }

  private afterLoad() {
    this.container.style.cursor = 'crosshair';
    this.container.onmousemove = (ev) => this.move(ev, this.ratio, this.imageWidth);
    if (this.autoStop) {
      this.container.onmouseout = () => this.reset();
    }
  }

  private move(event: any, ratio: number, imageWidth: number) {
    const scrollLeft =
      this.container.scrollLeft > 0
        ? this.container.scrollLeft
        : this.container.parentElement && this.container.parentElement.scrollLeft > 0
          ? this.container.parentElement.scrollLeft
          : 0;
    const scrollTop =
      this.container.scrollTop > 0
        ? this.container.scrollTop
        : this.container.parentElement && this.container.parentElement.scrollTop > 0
          ? this.container.parentElement.scrollTop
          : 0;

    const boxWidth = this.container.clientWidth,
      x = event.pageX - this.container.offsetLeft,
      y = event.pageY - this.container.offsetTop,
      xPercent = (x + scrollLeft) / (boxWidth / 100) + '%',
      yPercent = (y + scrollTop) / ((boxWidth * ratio) / 100) + '%';

    Object.assign(this.container.style, {
      backgroundPosition: xPercent + ' ' + yPercent,
      backgroundSize: imageWidth + 'px',
    });
  }

  private reset() {
    Object.assign(this.container.style, {
      backgroundPosition: 'top',
      backgroundSize: 'cover',
      cursor: 'default',
    });
  }
}
