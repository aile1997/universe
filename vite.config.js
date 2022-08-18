const path = require('path')
const resolve = (dir) => path.join(__dirname, dir)
const isProduction = process.env.NODE_ENV === 'production'

import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  alias: {
    '@': resolve('src'),
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    https: false,
    proxy: {},
  },
  build: {
    assetsDir: 'static',
    // rollupOptions: {},

    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    brotliSize: false, // 默认为 true
  },
  base: isProduction ? './' : '',
})
