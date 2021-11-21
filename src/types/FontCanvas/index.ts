import axios from "axios";

export class FontCanvas {
  dom: HTMLCanvasElement | null;
  setSize: HTMLInputElement | null;
  showSize: HTMLParagraphElement | null;
  ctx?: CanvasRenderingContext2D | null;
  drawIng: boolean = false;
  timeOut?: number;
  x?: number[];
  y?: number[];
  w: {
    ink: Array<number[]>;
  } = { ink: [] };
  constructor(dom: HTMLCanvasElement | null) {
    this.setSize = dom?.querySelector(".setPenSize .penSize") || null;
    this.showSize = dom?.querySelector(".setPenSize .showSize") || null;
    this.dom = dom?.querySelector("canvas.writeFont") || null;
    this.ctx = this.dom?.getContext("2d");

    if (this.dom) this.init();
  }
  init() {
    if (this.ctx) {
      this.ctx.lineWidth = 5;
    }
    this.addEvent();
  }
  createRect(x: number, y: number, lineTo: boolean = true) {
    if (lineTo) {
      this.ctx?.lineTo(x, y);
      this.ctx?.stroke();
    } else {
      this.ctx?.beginPath();
      this.ctx?.moveTo(x, y);
    }
    this.x?.push(x);
    this.y?.push(y);
  }
  addEvent() {
    if (this.dom && this.setSize && this.showSize) {
      this.showSize.innerText = this.setSize.value;
      this.dom.addEventListener(
        "mousedown",
        (event: MouseEvent) => {
          event.preventDefault();
          clearTimeout(this.timeOut);
          this.x = this.y = [];
          if (this.ctx) {
            this.ctx.lineWidth = parseInt(this.setSize?.value || "3");
            this.drawIng = true;
            let rect = this.dom?.getBoundingClientRect();
            this.createRect(
              event.clientX - (rect?.left || 0),
              event.clientY - (rect?.top || 0),
              false
            );
          }
        },
        false
      );
      this.dom.addEventListener("touchstart", (event: TouchEvent) => {
        event.preventDefault();
        clearTimeout(this.timeOut);
        this.x = this.y = [];
        if (this.ctx) {
          this.ctx.lineWidth = parseInt(this.setSize?.value || "3");
          this.drawIng = true;
          var touch = event.targetTouches[0];
          let rect = this.dom?.getBoundingClientRect() || { left: 0, top: 0 };
          let win = this.dom?.ownerDocument?.defaultView || {
            pageXOffset: 0,
            pageYOffset: 0,
          };
          this.createRect(
            touch.pageX - (rect.left + win.pageXOffset),
            touch.pageY - (rect.top + win.pageYOffset),
            false
          );
        }
      });
      this.dom.addEventListener(
        "mousemove",
        (event: MouseEvent) => {
          if (this.drawIng) {
            event.preventDefault();
            let rect = this.dom?.getBoundingClientRect();
            this.createRect(
              event.clientX - (rect?.left || 0),
              event.clientY - (rect?.top || 0),
              true
            );
          }
        },
        false
      );
      this.dom.addEventListener("touchmove", (event: TouchEvent) => {
        if (this.drawIng) {
          event.preventDefault();
          let touch = event.targetTouches[0];
          let rect = this.dom?.getBoundingClientRect() || { left: 0, top: 0 };
          let win = this.dom?.ownerDocument?.defaultView || {
            pageXOffset: 0,
            pageYOffset: 0,
          };
          this.createRect(
            touch.pageX - (rect.left + win.pageXOffset),
            touch.pageY - (rect.top + win.pageYOffset),
            true
          );
        }
      });
      "mouseup,mouseout,touchend"
        .replaceAll(" ", "")
        .split(",")
        .forEach((event) =>
          this.dom?.addEventListener(event, this.stopWriting.bind(this), false)
        );
      "mousedown,mousemove,mouseup,change,touchend,touchmove,touchstart"
        .replaceAll(" ", "")
        .split(",")
        .forEach((event) =>
          this.setSize?.addEventListener(
            event,
            this.setSizeValue.bind(this),
            false
          )
        );
    }
  }
  stopWriting() {
    if (this.drawIng) {
      this.drawIng = false;
      clearTimeout(this.timeOut);
      this.w.ink = [this.x || [], this.y || [], []];
      this.timeOut = window.setTimeout(() => {
        this.ctx?.clearRect(0, 0, this.dom?.width || 0, this.dom?.height || 0);
        // axios({
        //   url: "https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8",
        //   method: "POST",
        //   headers: {
        //     "content-type": "application/json",
        //   },
        //   data: { options: "enable_pre_space", requests: this.w },
        // }).then((data) => {});
      }, 2e3);
    }
  }
  setSizeValue() {
    if (this.showSize && this.setSize)
      this.showSize.innerText = this.setSize.value;
  }
}
