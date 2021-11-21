<template>
  <div class="wroteFontDiv flex flex-down flex-item-center">
    <div class="tools flex flex-item-center flex-center">
      <div class="setPenSize flex">
        <p class="showSize"></p>
        <input type="range" class="penSize" min="2" max="30" value="3" />
      </div>
      <div class="configs" @mouseout="showConfigs = false">
        <h1 @click="showConfigs = !showConfigs">設定</h1>
        <div class="options" :class="{ showList: showConfigs }">
          <div
            v-for="config of configs"
            :key="config"
            :class="{ open: config.open }"
            @click="config.open = !config.open"
            v-text="(config.open ? '關閉' : '開啟') + config.info"
          ></div>
        </div>
      </div>
    </div>
    <canvas class="writeFont" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FontCanvas } from "@/types/FontCanvas";
export default defineComponent({
  name: "addFont",
  data() {
    return {
      configs: [
        {
          open: true,
          info: "",
        },
      ],
      showConfigs: false,
    };
  },
  mounted() {
    new FontCanvas(document.querySelector(".wroteFontDiv"));
  },
});
</script>

<style lang="scss" scoped>
.wroteFontDiv {
  // max-width: 30em;
  canvas.writeFont {
    width: 300px;
    height: 300px;
    border: 2px solid black;
  }
  .tools {
    width: 80%;
    justify-content: space-evenly;
  }
}
</style>
