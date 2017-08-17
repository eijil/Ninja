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
    this.load.atlasJSONHash('player1', 'assets/boy.png', 'assets/boy.json');
    this.load.atlasJSONHash('player2', 'assets/girl.png', 'assets/girl.json');

    this.load.image('buttonFire','assets/flatLight/flatLight47.png');
    //this.load.atlas('arcade', 'assets/virtualjoystick/skins/arcade-joystick.png', 'assets/virtualjoystick/skins/arcade-joystick.json');

  }

  onLoadComplete() {
    this.game.state.start('menu');
  }
}

export default Preloader;
