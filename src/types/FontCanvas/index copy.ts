import axios from "axios";

export class FontCanvas {
  canvas: HTMLCanvasElement | null;
  setSize: HTMLInputElement | null;
  showSize: HTMLParagraphElement | null;
  ctx?: CanvasRenderingContext2D | null;
  drawIng: boolean = false;
  timeOut?: number;
  x?: number[];
  y?: number[];
  w: {
    writing_guide: {
      writing_area_width: number;
      writing_area_height: number;
    };
    ink: Array<number[]>;
    language: string;
  } = {
    writing_guide: {
      writing_area_width: 0,
      writing_area_height: 0,
    },
    ink: [],
    language: "zh_TW",
  };
  constructor(dom: HTMLCanvasElement | null) {
    this.setSize = dom?.querySelector(".setPenSize .penSize") || null;
    this.showSize = dom?.querySelector(".setPenSize .showSize") || null;
    this.canvas = dom?.querySelector("canvas.writeFont") || null;
    this.ctx = this.canvas?.getContext("2d");
    // this.w.writing_guide

    if (this.canvas) this.init();
  }
  init() {
    if (this.ctx) {
      this.ctx.lineWidth = 5;
    }
    this.addEvent();
  }
  createRect(x: number, y: number, lineTo: boolean = true) {
    if (this.ctx) {
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
    }
    this.x?.push(x);
    this.y?.push(y);
  }
  addEvent() {
    if (this.canvas && this.setSize && this.showSize) {
      this.showSize.innerText = this.setSize.value;
      this.canvas.addEventListener(
        "mousedown",
        (event: MouseEvent) => {
          event.preventDefault();
          clearTimeout(this.timeOut);
          this.x = this.y = [];
          if (this.ctx) {
            this.ctx.lineWidth = parseInt(this.setSize?.value || "3");
            this.drawIng = true;
            let rect = this.canvas?.getBoundingClientRect();
            this.createRect(
              event.clientX - (rect?.left || 0),
              event.clientY - (rect?.top || 0),
              false
            );
          }
        },
        false
      );
      this.canvas.addEventListener("touchstart", (event: TouchEvent) => {
        event.preventDefault();
        clearTimeout(this.timeOut);
        this.x = this.y = [];
        if (this.ctx) {
          this.ctx.lineWidth = parseInt(this.setSize?.value || "3");
          this.drawIng = true;
          var touch = event.targetTouches[0];
          let rect = this.canvas?.getBoundingClientRect() || {
            left: 0,
            top: 0,
          };
          let win = this.canvas?.ownerDocument?.defaultView || {
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
      this.canvas.addEventListener(
        "mousemove",
        (event: MouseEvent) => {
          if (this.drawIng) {
            event.preventDefault();
            let rect = this.canvas?.getBoundingClientRect();
            this.createRect(
              event.clientX - (rect?.left || 0),
              event.clientY - (rect?.top || 0),
              true
            );
          }
        },
        false
      );
      this.canvas.addEventListener("touchmove", (event: TouchEvent) => {
        if (this.drawIng) {
          event.preventDefault();
          let touch = event.targetTouches[0];
          let rect = this.canvas?.getBoundingClientRect() || {
            left: 0,
            top: 0,
          };
          let win = this.canvas?.ownerDocument?.defaultView || {
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
          this.canvas?.addEventListener(
            event,
            this.stopWriting.bind(this),
            false
          )
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
  /**停止寫入時 */
  stopWriting() {
    if (this.drawIng) {
      this.drawIng = false;
      clearTimeout(this.timeOut);
      this.w.ink = [this.x || [], this.y || [], []];
      this.timeOut = window.setTimeout(() => {
        this.clearCanvas();
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
  /**更新顯示 */
  setSizeValue() {
    if (this.showSize && this.setSize)
      this.showSize.innerText = this.setSize.value;
  }
  /**清除 canvas */
  clearCanvas() {
    this.ctx?.clearRect(
      0,
      0,
      this.canvas?.width || 0,
      this.canvas?.height || 0
    );
  }
}
