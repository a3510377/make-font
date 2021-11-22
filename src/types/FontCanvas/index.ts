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
  constructor(
    public canvas: HTMLCanvasElement,
    public penSize: number = 3,
    public ctx?: CanvasRenderingContext2D | null
  ) {
    ctx ||= canvas.getContext("2d");
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
    event.preventDefault();
    let touch = event.targetTouches[0],
      offset = getOffset(this.canvas);
    let x = touch.pageX - offset.left,
      y = touch.pageY - offset.top;
    if (this.ctx) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
    }
  }
  /** 觸控移動事件 */
  touchmoveEvent(event: TouchEvent) {
    let touch = event.targetTouches[0],
      offset = getOffset(this.canvas);
    let x = touch.pageX - offset.left,
      y = touch.pageY - offset.top;
    if (this.ctx) {
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
    }
  }
  /** 停止寫入 */
  stopWriteEvent() {
    this.drawIng = false;
    this.timeout = window.setTimeout(() => {
      this.clearCanvas();
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
  /** 開始寫入 */
  private StartWrite(x: number, y: number) {
    clearTimeout(this.timeout);
    this.drawIng = true;
    if (this.ctx) {
      this.ctx.lineWidth = this.penSize;
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
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
    }
  }
}
