import Player from '../prefabs/player';

class Game extends Phaser.State {

  constructor() {
    super();
    this.isJump = false;
    this.ground;
    this.player1 = null;
    this.player2 = null;
    this.gameStart = false;
    this.synced = true;
    this.action = '';
    this.playerData;
  }
  init  () {

    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.world.enableBody = true;
    this.game.physics.arcade.gravity.y = 600;

    this.game.player = 'player1';
    this.game.roomdID = '000000';

    // console.log(this.currentPlayer);
    this.otherPlayer = this.game.player == 'player1' ? 'player2' : 'player1';


    //this.ref = wilddog.sync().ref(this.game.roomID);
    if(this.game.player == ''){
      console.log('error');
    }
    // this.currentPlayerRef = this.ref.child(this.game.player);
    // this.oterhPlayRef = this.ref.child(this.otherPlayer);
    
  }

  create() {

    this.ground = this.game.add.tileSprite(0, this.game.height - 40, this.game.width, 40, 'ground');
    this.ground.body.collideWorldBounds = true;
    this.stage.backgroundColor = '#124184';
    this.player1 = new Player(this.game,100,this.world.height - 80,this.game.player);
    this.game.add.existing(this.player1);
    this.createJoystick();


    //this.server();
  }

  server(){
    var _this = this;
    this.updateOtherPlayer();
  }

  updateOtherPlayer(){
    var _this = this;
    this.oterhPlayRef.on('value',function(snap){
        console.log(snap.val());
        // console.log(_this.gameStart);
        if(snap.val() !=null){
          if(!_this.gameStart)
            _this.player2 = _this.createPlayer(_this.otherPlayer);
            _this.gameStart = true;
          }
          //updatePos
          var pos = snap.child('pos').val();
          var action = snap.child('action').val();
          if(pos != null){
            _this.playerData = pos;

          }
          if(action !=null){
            switch (action) {
              case 'r-run':
                _this.player2.animations.play('run');
                _this.player2.scale.setTo(1,1);
                break;
              case 'l-run':
                _this.player2.animations.play('run');
                _this.player2.scale.setTo(-1,1);
                break;
              default:
                _this.player2.animations.play('idle');
            }
          }

    })
  }

  createPlayer(key){

    var player;
    var x = 100;
    var y = this.world.height - 80;
    if(key == 'player2'){
      x = 800;
    }
    player  = this.add.sprite(x,y,key);
    //player.height = 50;
    player.body.collideWorldBounds = true;
    player.animations.add('idle', Phaser.Animation.generateFrameNames('idle/', 1, 10, '', 4), 10, true, false);
    player.animations.add('run', Phaser.Animation.generateFrameNames('run/', 1, 10, '', 4), 10, true, false);

    return player;
  }

  //摇杆
  createJoystick() {
    let _this = this;
    let x = 100,
        y = this.world.height - 100;
    this.stick = this.game.plugins.add(Phaser.Plugin.VirtualJoystick);
    this.stick.init(x,y,100,80);
    this.stick.start();
    this.stick.onStartDrag = function(){
      _this.player1.animations.play('run');

    }
    this.stick.onMove = function(){
      if(Math.abs(this.angle) < 90 && Math.abs(this.angle)!= 0){
        _this.player1.scale.setTo(1,1);
        _this.action = 'r-run';
        _this.player1.stickDirect = 'right';

      }
      if(Math.abs(this.angle) > 90 && Math.abs(this.angle)!= 0){
        _this.player1.scale.setTo(-1,1);
        _this.action = 'l-run';
        _this.player1.stickDirect = 'left';
      }

      _this.player1.stickAngle = this.angle;

    }

    //
    //this.fireButton = this.game.add.button(this.game.width - 200,this.game.height - 200,'buttonFire',this.player1.fire,this);
    this.fireButton = this.game.add.button(this.game.width - 200,this.game.height - 200,'buttonFire',this.player1.fire,this.player1);
  }
  createJump(){
    this.jumpButton = this.game.add.button(500, 400, 'jump', this.jump, this);
    this.jumpButton.width = 50;
    this.jumpButton.height = 50;
  }
  fire(){

  }
  jump(){
    this.isJump = true;
    var jumptween = this.game.add.tween(this.player1).to( { y: "-" + 100 }, 1000, "Linear", true);

  }
  update() {

    var _this = this;

    // if(this.stick.force == 0){
    //   this.player1.animations.play('idle');
    // }
    this.player1.x += this.stick.force * 3 * this.stick.deltaX;
    if(this.player2 && this.playerData){
      this.player2.x += this.playerData.x;
    }



    //_this.uploadPlayerPos();
  }
  //更新当前玩家位置信息
  uploadPlayerPos(){
    var _this = this;
    if(this.synced){
        this.synced = false;
        this.currentPlayerRef.update({
          "pos":{
            "x":_this.stick.force * 3 * _this.stick.deltaX,
            "y":_this.player1.body.y
          },
          "action":_this.action
        },function(){
          _this.synced = true;
        })
    }
  }
  //获取对战玩家的位置
  updatePlayerPos(){
    //this.player1
  }

  jumpPlayer(){

  }
  onDisconnect(){


  }
  render(){

  }

  endGame() {
    this.game.state.start('gameover');
  }

}

export default Game;
