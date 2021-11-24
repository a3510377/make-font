<template>
  <div class="wroteFontDiv flex flex-down flex-item-center">
    <div class="tools flex flex-item-center flex-center">
      <div class="configs"></div>
    </div>
    <canvas
      ref="canvas"
      class="writeFont"
      :width="canvasSize"
      :height="canvasSize"
      :style="{ width: `${canvasStyle}px`, height: `${canvasStyle}px` }"
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
      penSize: 3,
      ratio: 1,
      canvasSize: Math.min(window.innerWidth * 0.9, 400),
      canvasStyle: 400,
      canvas: null as HTMLCanvasElement | null,
      ctx: null as CanvasRenderingContext2D | null,
      word: null as Word | null,
    };
  },
  methods: {
    init() {
      if (this.canvas) {
        this.ctx = this.canvas.getContext("2d");
        let ctx = this.ctx,
          dpr = window.devicePixelRatio || 1,
          rect = this.canvas.getBoundingClientRect();
        /* HiDPI */
        // this.ratio = window.devicePixelRatio * this.canvasStyle;
        console.log(this.ratio);

        /*  */
        this.word = new Word(this.canvas, this.penSize, this.canvasSize, ctx);
        Object.assign(window, { Word: this.word });
        if (ctx) {
          /* HiDPI */
          this.canvasSize = Math.min(rect.width * dpr, rect.height * dpr);
          ctx.scale(dpr, dpr);
          // ctx.setTransform(this.ratio, 0, 0, this.ratio, 0, 0);
          /* set 筆刷 */
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.strokeStyle = "black";
        }
      }
    },
  },
  mounted() {
    this.canvas = this.$refs.canvas as HTMLCanvasElement | null;
    this.init();
  },
  computed: {
    lang: function () {
      return localStorage.getItem("lang");
    },
  },
  watch: {
    canvasSize: function (e) {
      if (this.word) this.word.canvasSize = this.canvasSize;
    },
    lang: function (e) {
      console.log(e);
    },
  },
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
