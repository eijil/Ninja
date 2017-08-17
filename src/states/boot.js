class Boot extends Phaser.State {

  constructor() {
    super();
  }

  preload() {
    this.load.image('preloader', 'assets/preloader.gif');
  }

  create() {

    this.game.scale.pageAlignHorizontally = true;

    //setup device scaling
    if (!this.game.device.desktop) {
      this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      // this.game.scale.maxWidth = 750;
      // this.game.scale.maxHeight = 1206;
      this.game.scale.forceOrientation(true);

    }
    this.initWilddog();
    this.game.state.start('preloader');
  }
  initWilddog(){

    var config = {
        authDomain: "jiel.wilddog.com",
        syncURL: "https://jiel.wilddogio.com"
    };
    wilddog.initializeApp(config);

  }


}

export default Boot;
