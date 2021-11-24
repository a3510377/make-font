import axios from "axios";

export class Word {
  private drawIng: boolean = false;
  private timeout: number = -1;
  private WordInfo?: getWordInfo;
  private img: HTMLImageElement = new Image();
  constructor(
    public canvas: HTMLCanvasElement,
    public penSize: number = 3,
    public canvasSize: number,
    public ctx?: CanvasRenderingContext2D | null,
    public language: string = "zh_TW"
  ) {
    ctx ||= canvas.getContext("2d");
    this.init();
    let imgs: { [key: string]: string } = {};
    Object.keys(import.meta.glob("/src/assets/**")).map((_) => (imgs[_] = _));
    this.img.src = `${imgs["/src/assets/images/font/main.png"]}`;
    this.img.onload = () => {
      this.img.style.width = `${canvasSize}px`;
      this.img.style.height = `${canvasSize}px`;
      this.ctx?.drawImage(this.img, 0, 0, canvasSize, canvasSize);
    };
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
    let de = document.documentElement,
      box = this.canvas.getBoundingClientRect(),
      touch = event.changedTouches[0];
    this.StartWrite(
      touch.pageX - (box.left + window.pageXOffset - de.clientLeft),
      touch.pageY - (box.top + window.pageYOffset - de.clientTop)
    );
  }
  /** 觸控移動事件 */
  touchmoveEvent(event: TouchEvent) {
    clearTimeout(this.timeout);
    let de = document.documentElement,
      box = this.canvas.getBoundingClientRect(),
      touch = event.changedTouches[0];
    this.MoveWrite(
      touch.pageX - (box.left + window.pageXOffset - de.clientLeft),
      touch.pageY - (box.top + window.pageYOffset - de.clientTop)
    );
  }
  /** 停止寫入 */
  stopWriteEvent() {
    this.WordInfo?.splitStroke();
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
    this.ctx?.drawImage(this.img, 0, 0, this.canvasSize, this.canvasSize);
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
  setLineWidth(lineWidth: number) {
    this.penSize = lineWidth;
  }
  /** 開始寫入 */
  private StartWrite(x: number, y: number) {
    clearTimeout(this.timeout);
    if (!this.drawIng && this.ctx) {
      this.ctx.lineWidth = this.penSize;
      this.drawIng = true;
      this.WordInfo?.initXY();
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
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
    this.initXY();
    this.ink = [];
  }
  initXY() {
    this.x = this.y = [];
  }
  addXY(x: number, y: number) {
    this.x.push(x);
    this.y.push(y);
  }
  splitStroke() {
    this.ink.push([this.x, this.y, []]);
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
