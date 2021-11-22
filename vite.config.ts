import { defineConfig } from "vite";
import WindiCSS from "vite-plugin-windicss";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
const main = {
  plugins: [vue(), WindiCSS()],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "./src") }],
  },
  server: {
    port: 4000,
    open: true,
    cors: false,
  },
};
export default defineConfig(({ command, mode }) => {
  if (mode === "production") {
    return {
      ...main,
      base: "/make-font/",
    };
  } else {
    return {
      ...main,
      base: "/",
    };
  }
});
