import BaseScene from "./BaseScene"

class MenueScene extends BaseScene {
    constructor(config) {
        super("MenuScene", config);
        this.menu = [
            { scene: "PlayScene", text: "Start Game" },
            { scene: "ScoreScene", text: "Scores" },
            { scene: null, text: "Exit" }
        ]
    }

    create() {
        super.create()
        this.createMenu(this.menu, this.setupMenuEvents.bind(this))
    }

    createBG() {
        this.add.image(0, 0, "sky-bg").setOrigin(0, 0);
    }

    setupMenuEvents(menuItem) {
        const textGO = menuItem.textGO
        textGO.setInteractive()

        textGO.on("pointerover", () => {
            textGO.setStyle({ fill: "#ff0" })
        })

        textGO.on("pointerout", () => {
            textGO.setStyle({ fill: "#fff" })
        })

        textGO.on("pointerup", () => {
            menuItem.scene && this.scene.start(menuItem.scene)

            if (menuItem.text === "Exit") {
                this.game.destroy(true)
            }
        })
    }

}


export default MenueScene;