<template>
  <WriteFont />
</template>

<script lang="ts">
import WriteFont from "@/components/addFont/index.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "HelloWorld",
  data() {
    return {};
  },
  components: {
    WriteFont,
  },
});
</script>

<style lang="scss">
@import "@/assets/scss/main.scss";
</style>