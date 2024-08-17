import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import fs from "fs";
import path from "path";

export default defineConfig({
   base: "../../.",
   plugins: [vue()],
   server: {
      https: {
         key: fs.readFileSync(
            path.resolve(__dirname, "./certificates/localhost-key.pem")
         ),
         cert: fs.readFileSync(
            path.resolve(__dirname, "./certificates/localhost.pem")
         ),
      },
   },
});
