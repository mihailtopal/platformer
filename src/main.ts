import Phaser from "phaser";
import "./style.css";
import { scenes } from "./scenes";

new Phaser.Game({
  width: 800,
  height: 700,
  scene: scenes,
  type: Phaser.AUTO,
  title: "My game",
  url: import.meta.env.URL || "",
  version: import.meta.env.VERSION || "0.0.1",
  backgroundColor: "#000",
  scale: {
    mode: Phaser.Scale.MAX_ZOOM,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  pixelArt: true,
  fps: {
    target: 60, // Общий целевой FPS для игры
    forceSetTimeOut: true, // Принудительно использовать setTimeout для обеспечения стабильности FPS
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 700, x: 0 },
      debug: false,
    },
  },
});
