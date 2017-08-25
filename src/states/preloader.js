class Preloader extends Phaser.State {

  constructor() {
    super();
    this.asset = null;
    this.ready = false;
  }

  preload() {
    //setup loading bar
    this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
    this.load.setPreloadSprite(this.asset);

    //Setup loading and its events
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.loadResources();
  }

  loadResources() {
    this.load.image('ground', 'assets/ground.jpg');
    this.load.image('kunai', 'assets/kunai.png');
    this.load.image('sky','assets/sky.png');
    this.load.atlasJSONHash('player1', 'assets/boy.png', 'assets/boy.json');
    //this.load.atlasJSONHash('player2', 'assets/girl.png', 'assets/girl.json');
    this.load.atlasJSONHash('player2', 'assets/boy.png', 'assets/boy.json');
    this.load.image('buttonFire','assets/transparentDark/transparentDark47.png');

    this.load.spritesheet('gamepad',
            'assets/gamepad/gamepad_spritesheet.png', 100, 100);
    this.load.image('buttonJump','assets/transparentDark/transparentDark43.png');
    this.load.image('buttonFire','assets/transparentDark/transparentDark05.png');


  }

  onLoadComplete() {
    this.game.state.start('menu');
  }
}

export default Preloader;
