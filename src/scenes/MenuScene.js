import Phaser from "phaser";

class MenueScene extends Phaser.Scene {
    constructor(config) {
        super("MenuScene");
        this.config = config;
    }

    create() {
        this.createBG()
        this.scene.start("PlayScene", this.config)
    }

    createBG() {
        this.add.image(0, 0, "sky-bg").setOrigin(0, 0);
    }
}


export default MenueScene;