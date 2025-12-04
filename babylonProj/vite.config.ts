// vite.config.js
export default {
  server: {
    fs: {
      allow: ["../.."]
    }
  },
  optimizeDeps: {
    exclude: ["@babylonjs/havok", "@babylonjs/materials"]
  }
}
