import BaseScene from "./BaseScene"
const PIPES_TO_RENDER = 4

class PlayScene extends BaseScene {

    constructor(config) {
        super("PlayScene", config)
        this.initialBirdPosition = { x: 40, y: 150 }

        this.bird = null
        this.pipes = null

        this.isPaused = false

        this.pipeHorizontalDistance = 0
        this.pipeVerticalDistanceRange = [100, 150]
        this.pipeHorizontalDistanceRange = [500, 600]
        this.flapVelocity = 250
        this.velocity = 200

        this.score = 0
        this.scoreText = ""


        this.currentDifficulty = "easy"
        this.difficulties = {
            "easy": {
                pipeHorizontalDistanceRange: [500, 600],
                pipeVerticalDistanceRange: [250, 300]
            },
            "normal": {
                pipeHorizontalDistanceRange: [400, 500],
                pipeVerticalDistanceRange: [200, 250]
            },
            "hard": {
                pipeHorizontalDistanceRange: [300, 400],
                pipeVerticalDistanceRange: [150, 200]
            },
        }
    }

    create() {
        this.currentDifficulty = "easy"
        super.create()
        this.createBird()
        this.createPipes()
        this.createPauseButton()
        this.createScore()
        this.createColliders()
        this.handleInputs()
        this.listenToEvents()

        this.anims.create({
            key: "fly",
            frames: this.anims.generateFrameNumbers('bird', { start: 8, end: 15 }),
            frameRate: 8,
            repeat: -1
        })

        this.bird.play('fly')
    }

    update() {
        this.checkGameStatus()
        this.recyclePipes()
    }

    listenToEvents() {
        if (this.pauseEvenet) return

        this.pauseEvenet = this.events.on("resume", () => {
            this.initialTime = 3;
            this.countDownText = this.add.text(...this.screenCenter, "Fly in : " + this.initialTime, this.fontOptions).setOrigin(0.5)

            this.timeEvent = this.time.addEvent({
                delay: 1000,
                callback: this.countDown,
                callbackScope: this,
                loop: true
            })
        })
    }

    countDown() {
        this.initialTime -= 1
        this.countDownText.setText("Fly in : " + this.initialTime)

        if (this.initialTime <= 0) {
            this.isPaused = false
            this.countDownText.setText("")
            this.physics.resume()
            this.timeEvent.remove()
        }
    }

    createBG() {
        this.add.image(0, 0, "sky-bg").setOrigin(0, 0);
    }

    createBird() {
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, "bird").setOrigin(0).setFlipX(true).setScale(2.5);

        this.bird.setBodySize(this.bird.width, this.bird.height - 8)
        this.bird.body.gravity.y = 400
        this.bird.setCollideWorldBounds(true)
    }

    createPipes() {
        this.pipes = this.physics.add.group()

        for (let i = 0; i < PIPES_TO_RENDER; i++) {
            const upperPipe = this.pipes.create(0, 0, "pipe").setImmovable(true).setOrigin(0, 1);

            const lowerPipe = this.pipes.create(0, 0, "pipe").setImmovable(true).setOrigin(0);

            this.placePipe(upperPipe, lowerPipe)
        }

        this.pipes.setVelocityX(-this.velocity)
    }

    createPauseButton() {
        this.isPaused = false
        const pauseButton = this.add.image(this.config.width - 10, this.config.height - 10, "pause").setInteractive().setScale(2).setOrigin(1)

        pauseButton.on("pointerdown", () => {
            this.isPaused = "ture"
            this.physics.pause()
            this.scene.pause()
            this.scene.launch("PauseScene")
        })

    }

    createColliders() {
        this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this)
    }

    handleInputs() {
        this.input.on("pointerdown", this.flap, this)
        this.input.keyboard.on("keydown-SPACE", this.flap, this)
    }

    createScore() {
        this.score = 0;
        const bestScoreText = localStorage.getItem("bestScore")
        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, { fontSize: "18px", fill: "#000" });

        this.add.text(16, 32, `Best Score: ${bestScoreText || 0}`, { fontSize: "18px", fill: "#000" });
    }

    checkGameStatus() {
        if (this.bird.getBounds().bottom >= this.config.height || this.bird.getBounds().top <= 0) {
            this.gameOver()
        }
    }

    placePipe(uPipe, lPipe) {

        const difficulty = this.difficulties[this.currentDifficulty]

        const rightMostX = this.getRightMostPipe()

        const pipeVerticalDistance = Phaser.Math.Between(...this.pipeVerticalDistanceRange);

        const pipeVerticalPosition = Phaser.Math.Between(0 + 20, this.config.height - 20 - pipeVerticalDistance);

        const pipeHorizontalDistance = Phaser.Math.Between(...difficulty.pipeHorizontalDistanceRange);

        uPipe.x = rightMostX + pipeHorizontalDistance
        uPipe.y = pipeVerticalPosition

        lPipe.x = uPipe.x
        lPipe.y = uPipe.y + pipeVerticalDistance

    }


    flap() {
        if (this.isPaused) return;
        this.bird.body.velocity.y = -this.flapVelocity
    }


    recyclePipes() {
        const tempPipes = []

        this.pipes.getChildren().forEach((pipe) => {
            if (pipe.getBounds().right <= 0) {
                tempPipes.push(pipe)
                if (tempPipes.length === 2) {
                    this.placePipe(...tempPipes)
                    this.increaseScore()
                    this.saveBestScore()
                    this.increaseDifficulty()
                }
            }
        })
    }

    increaseDifficulty() {
        if (this.score === 5) {
            this.currentDifficulty = "normal"
        }
        if (this.scale == 10) {
            this.currentDifficulty = "hard"
        }
    }

    getRightMostPipe() {
        let rightMostX = 0

        this.pipes.getChildren().forEach(function (pipe) {
            rightMostX = Math.max(pipe.x, rightMostX)
        })

        return rightMostX
    }

    saveBestScore() {
        const bestScoreText = localStorage.getItem("bestScore")
        const bestScore = bestScoreText ? parseInt(bestScoreText, 10) : 0

        if (this.score > bestScore) {
            localStorage.setItem("bestScore", this.score)
        }
    }

    gameOver() {
        this.physics.pause()
        this.bird.setTint(0xff0000)

        this.saveBestScore()

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.restart()
            },
            loop: false

        })
    }

    increaseScore() {
        this.score += 1
        this.scoreText.setText(`Score: ${this.score}`)


    }

}


export default PlayScene; 