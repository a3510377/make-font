import axios from "axios";

const getOffset = (dom: Element | null) => {
  let rect = dom?.getBoundingClientRect(),
    win = dom?.ownerDocument?.defaultView || {
      pageXOffset: 0,
      pageYOffset: 0,
    };
  return {
    left: (rect?.left || 0) + win.pageXOffset,
    top: (rect?.top || 0) + win.pageYOffset,
  };
};

export class Word {
  private drawIng: boolean = false;
  private timeout: number = -1;
  private x: number[] = [];
  private y: number[] = [];
  private ink: number[][][] = [];
  constructor(
    public canvas: HTMLCanvasElement,
    public penSize: number = 3,
    public canvasSize: number,
    public ctx?: CanvasRenderingContext2D | null,
    public language: string = "zh_TW"
  ) {
    ctx ||= canvas.getContext("2d");
    this.init();
  }
  /** 滑鼠按下事件 */
  mousedownEvent(event: MouseEvent) {
    event.preventDefault();
    let rect = this.canvas.getBoundingClientRect();
    this.StartWrite(event.clientX - rect.left, event.clientY - rect.top);
  }
  /** 滑鼠移動事件 */
  mousemoveEvent(event: MouseEvent) {
    event.preventDefault();
    let rect = this.canvas.getBoundingClientRect();
    this.MoveWrite(event.clientX - rect.left, event.clientY - rect.top);
  }
  /** 觸控按下事件 */
  touchstartEvent(event: TouchEvent) {
    clearTimeout(this.timeout);
    event.preventDefault();
    this.drawIng = true;
    let touch = event.targetTouches[0],
      offset = getOffset(this.canvas);
    let x = touch.pageX - offset.left,
      y = touch.pageY - offset.top;
    if (this.ctx && this.drawIng) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.addXY(x, y);
    }
  }
  /** 觸控移動事件 */
  touchmoveEvent(event: TouchEvent) {
    clearTimeout(this.timeout);
    let touch = event.targetTouches[0],
      offset = getOffset(this.canvas);
    let x = touch.pageX - offset.left,
      y = touch.pageY - offset.top;
    if (this.ctx && this.drawIng) {
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.addXY(x, y);
    }
  }
  /** 停止寫入 */
  stopWriteEvent() {
    clearTimeout(this.timeout);
    if (this.drawIng) {
      this.ink.push([this.x, this.y, []]);
      this.x = this.y = [];
    }
    this.drawIng = false;
    this.timeout = window.setTimeout(() => {
      this.clearCanvas();
      this.finish();
    }, 2e3);
  }
  /** 清除畫布 */
  clearCanvas() {
    this.ctx?.clearRect(
      0,
      0,
      this.canvas?.width || 0,
      this.canvas?.height || 0
    );
  }
  addXY(x: number, y: number) {
    this.x.push(x);
    this.y.push(y);
  }
  /** 完成 */
  finish() {
    this.goGetFont();
  }
  /** setup */
  init() {
    this.clearCanvas();
    this.x = this.y = [];
  }
  goGetFont() {
    axios({
      ...this.goGetFontData(),
      method: "POST",
    })
      .then((res) => res.data)
      .then((data: any) => {
        this.x = this.y = [];
        console.log(this.x);

        console.log(data[1][0][1]);
      });
  }
  goGetFontData() {
    return {
      url: "https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8",
      headers: {
        "content-type": "application/json",
      },
      data: {
        options: "enable_pre_space",
        requests: [
          {
            writing_guide: {
              writing_area_width: this.canvasSize,
              writing_area_height: this.canvasSize,
            },
            ink: this.ink,
            language: this.language,
          },
        ],
      },
    };
  }
  /** 開始寫入 */
  private StartWrite(x: number, y: number) {
    clearTimeout(this.timeout);
    this.drawIng = true;
    if (this.ctx) {
      this.ctx.lineWidth = this.penSize;
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
    }
    this.addXY(x, y);
  }
  /** 移動 */
  private MoveWrite(x: number, y: number) {
    clearTimeout(this.timeout);
    if (this.ctx && this.drawIng) {
      this.ctx.lineWidth = this.penSize;
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.addXY(x, y);
    }
  }
}
