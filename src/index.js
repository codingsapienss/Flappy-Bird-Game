import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";
import MenueScene from "./scenes/MenuScene";
import PreloadScene from "./scenes/PreloadScene";

const WIDTH = 400
const HEIGHT = 300
const BIRD_POSITION = { x: WIDTH * 0.1, y: HEIGHT / 2 }

const SHARED_CONFIG = {
  width: 400,
  height: 300,
  startPosition: BIRD_POSITION
}

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics: {
    default: "arcade",
  },
  scene: [PreloadScene, new MenueScene(), new PlayScene(SHARED_CONFIG)]
}




new Phaser.Game(config)