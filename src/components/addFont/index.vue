<template>
  <div class="wroteFontDiv flex flex-down flex-item-center">
    <div class="tools flex flex-item-center flex-center">
      <div class="configs"></div>
    </div>
    <canvas
      ref="canvas"
      class="writeFont"
      width="400"
      height="400"
      style="border: 2px solid; cursor: crosshair"
      @mousedown="word?.mousedownEvent"
      @mousemove="word?.mousemoveEvent"
      @mouseup="word?.stopWriteEvent"
      @mouseout="word?.stopWriteEvent"
      @touchstart="word?.touchstartEvent"
      @touchmove="word?.touchmoveEvent"
      @touchend="word?.stopWriteEvent"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Word } from "@/types/FontCanvas";

export default defineComponent({
  name: "addFont",
  data() {
    return {
      configs: [{ open: true, info: "", value: null as any }],
      penSize: 5,
      ratio: window.devicePixelRatio || 1,
      canvasStyle: 400,
      canvas: null as HTMLCanvasElement | null,
      ctx: null as CanvasRenderingContext2D | null,
      word: null as Word | null,
    };
  },
  methods: {
    init() {
      if (this.canvas) {
        let ctx = (this.ctx = this.canvas.getContext("2d"));
        this.word = new Word(this.canvas, this.penSize, this.canvasStyle, ctx);
        Object.assign(window, { Word: this.word });
        if (ctx) {
          /* set 筆刷 */
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.strokeStyle = "black";
        }
      } else this.init();
    },
  },
  mounted() {
    this.canvas = this.$refs.canvas as HTMLCanvasElement | null;
    Object.assign(window, { T_canvas: this.canvas });
    this.init();
  },
  watch: {},
});
</script>

<style lang="scss" scoped>
.wroteFontDiv {
  // max-width: 30em;
  canvas.writeFont {
    border: 2px solid black;
  }
  .tools {
    width: 80%;
    justify-content: space-evenly;
  }
}
</style>
