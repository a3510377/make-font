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
  private WordInfo?: getWordInfo;
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
    this.StartWrite(touch.pageX - offset.left, touch.pageY - offset.top);
  }
  /** 觸控移動事件 */
  touchmoveEvent(event: TouchEvent) {
    clearTimeout(this.timeout);
    let touch = event.targetTouches[0],
      offset = getOffset(this.canvas);
    this.MoveWrite(touch.pageX - offset.left, touch.pageY - offset.top);
  }
  /** 停止寫入 */
  stopWriteEvent() {
    if (this.drawIng) this.WordInfo?.splitStroke();
    this.timeout = window.setTimeout(() => {
      this.clearCanvas();
      this.WordInfo?.fetch()
        .then((res) => res.json())
        .then((data: any) => {
          this.WordInfo?.init();
          console.log(data[1][0][1]);
        });
    }, 2e3);
    this.drawIng = false;
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
  /** setup */
  init() {
    this.clearCanvas();
    this.WordInfo = new getWordInfo(
      this.canvasSize,
      this.canvasSize,
      this.language
    );
  }
  /** 開始寫入 */
  private StartWrite(x: number, y: number) {
    clearTimeout(this.timeout);
    if (!this.drawIng && this.ctx) {
      this.ctx.lineWidth = this.penSize;
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.drawIng = true;
      this.WordInfo?.addXY(x, y);
    }
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
      this.WordInfo?.addXY(x, y);
    }
  }
}

class getWordInfo {
  protected x: number[] = [];
  protected y: number[] = [];
  protected ink: number[][][] = [];
  constructor(
    protected width: number,
    protected height: number,
    public language = "zh_TW"
  ) {}
  init() {
    this.x = this.y = [];
    this.ink = [];
  }
  addXY(x: number, y: number) {
    this.x.push(x);
    this.y.push(y);
  }
  splitStroke() {
    this.ink.push([this.x, this.y, []]);
    this.x = this.y = [];
  }
  fetch() {
    return fetch(
      "https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          options: "enable_pre_space",
          requests: [
            {
              ink: this.ink,
              language: this.language,
              writing_guide: {
                writing_area_width: this.width,
                writing_area_height: this.height,
              },
            },
          ],
        }),
      }
    );
  }
}
