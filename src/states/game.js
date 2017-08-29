import Player from '../prefabs/player';

class Game extends Phaser.State {

  constructor() {
    super();
    this.ground;
    //当前玩家
    this.player1 = null;
    //其它玩家
    this.player2 = null;
    this.gameStart = false;
    this.synced = true;
    this.playerX = 0;
    this.uploadTime;
    this.ping;
  }
  init  () {

    this.physics.startSystem(Phaser.Physics.ARCADE);
    //this.game.world.enableBody = true;
    this.game.physics.arcade.gravity.y = 400;

    if(!this.game.roomID){
      console.log('error')
      return;
    }

    // console.log(this.currentPlayer);
    this.otherPlayer = this.game.player == 'player1' ? 'player2' : 'player1';
    this.ref = wilddog.sync().ref(this.game.roomID);

    //监听
    this.currentPlayerRef = this.ref.child(this.game.player);
    this.oterhPlayRef = this.ref.child(this.otherPlayer);

  }

  create() {
    //Fade In
    this.camera.flash('#000000');
    //this.ground = this.game.add.tileSprite(0, this.game.height - 40, this.game.width, 40, 'ground');
    //this.game.physics.arcade.enableBody(this.ground);
    //this.ground.body.collideWorldBounds = true;
    this.stage.backgroundColor = '#124184';

    this.player1 = new Player(this.game,0,0,this.game.player);
    window.player1 = this.player1;
    var playerText = this.game.add.text(0, -this.player1.height/2, 'me', { fill: '#000', fontSize: '15px' });
    playerText.anchor.set(0.5);
    this.player1.addChild(playerText);
    this.game.add.existing(this.player1);
    this.game.camera.follow(this.player1);
    this.waitText = this.add.text(this.game.world.centerX-20,10,"等待其它玩家加入..",{fill:'#ffffff','font':'16px'});
    this.createJoystick();
    this.updateOtherPlayer();
  }


  updateOtherPlayer(){
    var _this = this;
    this.oterhPlayRef.on('value',function(snap){

        if(snap.val() !=null){
          if(!_this.gameStart)
            _this.player2 = new Player(_this.game,0,0,_this.otherPlayer);
            _this.game.add.existing(_this.player2);
            _this.gameStart = true;
          }
          //updatePos
          var posx = snap.child('x').val();
          var angle = snap.child('angle').val();
          var action = snap.child('action').val();
          var direct = snap.child('direct').val();
          var state = snap.child('state').val();
          if(posx != null){
            _this.playerX = posx;
          }
          if(angle != null){
            _this.player2.stickAngle = angle;
          }
          if(direct!=null){
             _this.player2.stickDirect = direct;
            if(direct == 'left'){
              _this.player2.scale.x = -1;
            }else{
              _this.player2.scale.x = 1;
            }
          }
          
          if(state){
            _this.player2.isRun  = state.isRun;
            _this.player2.isFire = state.isFire;
            if(action == 'fire'){
              _this.player2.fire();
            }
            if(action == 'jump'){
              _this.player2.jump();
            }
          }


    })
  }

  //摇杆
  createJoystick() {
    let _this = this;
    let x = 100,
        y = this.world.height - 100;

    this.gamepad = this.game.plugins.add(Phaser.Plugin.VirtualGamepad);
    this.joystick = this.gamepad.addJoystick(100, this.game.height-200, 1.1, 'gamepad');


    this.fireButton = this.game.add.button(this.game.width - 100,this.game.height - 150,'buttonFire',this.player1.fire,this.player1);
    this.jumpButton = this.gamepad.addButton(this.game.width - 150, this.game.height - 200, 1.0, 'buttonJump');
    this.jumpButton.onInputDown.add(this.player1.jump,this.player1);
  }
  //game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);

  bulletsCollisionHandler(player,bullte){
    bullte.kill()
    player.frameName = 'jump_throw/0003';

  }

  update() {



    var _this = this;
    //this.game.physics.arcade.collide(_this.player1, _this.ground);

    //跟新玩家2位置
    if(this.player2 ){
      console.log(this.playerX)
      this.player2.body.velocity.x = this.playerX;
      // this.player2.y = this.playerData.y;
    }
    //console.log(this.joystick.properties.deltaX);

    if(this.joystick.properties.inUse){


      this.player1.isRun = true;
      this.player1.stickAngle = this.joystick.properties.angle;
      this.player1.body.velocity.x = this.joystick.properties.deltaX * this.player1.speed;

      //right
      if(this.joystick.properties.right == true && this.player1.stickDirect != 'right'){
        this.player1.stickDirect = 'right';
        this.player1.scale.x = 1;
      }
      //left
      if(this.joystick.properties.left == true && this.player1.stickDirect != 'left'){
        this.player1.stickDirect = 'left';
        this.player1.scale.x = -1;
      }
    }else{
      this.joystick.properties.deltaX = 0;
      this.player1.stickAngle = 0;
      this.player1.body.velocity.x = 0;
      this.player1.isRun = false;

    }
    //
    if(this.gameStart){
      this.waitText.visible = false;
    }

    if(this.player2){
      this.game.physics.arcade.overlap(_this.player1.weapon.bullets, _this.player2, _this.bulletsCollisionHandler, null, this);
      this.game.physics.arcade.overlap(_this.player2.weapon.bullets, _this.player1, _this.bulletsCollisionHandler, null, this);
    }

    //
    this.uploadPlayerInfo();
  }

  //上传信息到服务器
  uploadPlayerInfo(){
    var _this = this;

    if(this.synced){
        this.synced = false;
        this.uploadTime = this.game.time.now;
        this.currentPlayerRef.update({
          "x" : _this.joystick.properties.deltaX * _this.player1.speed,
          "angle": _this.player1.stickAngle,
          "direct":_this.player1.stickDirect,
          "action":_this.player1.action,
          "state":{
            "isFire" : _this.player1.isFire,
            "isRun"  : _this.player1.isRun,
            "isJump" : _this.player1.isJump
          }
        },function(){
          _this.synced = true;
          _this.ping = _this.game.time.now - _this.uploadTime;
        })
    }
  }



  onDisconnect(){


  }
  render(){
    // this.game.debug.bodyInfo(this.player1,32,32);
    //this.game.debug.body(this.player1);
    this.game.debug.text('ping:'+this.ping+'ms',32,32);
  }

  endGame() {
    this.game.state.start('gameover');
  }

}

export default Game;
