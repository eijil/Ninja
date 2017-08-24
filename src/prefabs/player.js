//Documentation for Phaser's (2.6.2) sprites:: phaser.io/docs/2.6.2/Phaser.Sprite.html
class Player extends Phaser.Sprite {

  //initialization code in the constructor
  constructor(game, x, y, key, frame) {

    super(game, x, y, key,frame);

    //出生位置;
    this.x = key == 'player1' ? 100 : 800;

    //setup physics properties
    this.anchor.setTo(0.5, 0.5);

    this.game.physics.arcade.enableBody(this);
    this.body.collideWorldBounds = true;
    this.body.setSize(90,90);
    this.body.immovable = true;
    this.setAnimations();

    this.weapon = this.game.add.weapon(10,'kunai');
    this.weapon.trackSprite(this,10,10);
    this.weapon.bulletSpeed = 400;
    //子弹间隔时间
    this.weapon.fireRate = 600;
    this.weapon.bulletKillDistance = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.weapon.bullets.setAll('body.allowGravity',false);
    //fire callback
    var _this = this;
    this.weapon.onFire.add((bullet,weapon)=>{
      this.action = 'fire';
      this.isFire = true;
      setTimeout(function(){
        _this.isFire = false;
      },100)
    },this);

    this.speed = 200;
    this.stickAngle = 0;
    this.stickDirect = 'right';
    this.isJump = false;
    this.action = '';
    this.isDead = false;
    this.isFire = false;
    this.isRun = false;
  }

  setAnimations(){
    this.animations.add('run', Phaser.Animation.generateFrameNames('run/', 1, 10, '', 4), 10, true, false);
    this.animations.add('dead', Phaser.Animation.generateFrameNames('dead/', 1, 10, '', 4), 10, true, false);
    this.animations.add('attack', Phaser.Animation.generateFrameNames('attack/', 1, 10, '', 4), 10, true, false);
    this.animations.add('dead', Phaser.Animation.generateFrameNames('dead/', 1, 10, '', 4), 10, true, false);
    this.animations.add('idle', Phaser.Animation.generateFrameNames('idle/', 1, 10, '', 4), 10, true, false);
    this.animations.add('jump', Phaser.Animation.generateFrameNames('jump/', 1, 10, '', 4), 10, true, false);
    this.animations.add('jump_attack', Phaser.Animation.generateFrameNames('jump_attack/', 1, 10, '', 4), 10, false, false);
    this.jump_fire = this.animations.add('jump_throw', Phaser.Animation.generateFrameNames('jump_throw/', 1, 10, '', 4), 10, false, false);
    this.animations.add('slice', Phaser.Animation.generateFrameNames('slice/', 1, 10, '', 4), 10, true, false);
    this.aniFire = this.animations.add('throw', Phaser.Animation.generateFrameNames('throw/', 1, 10, '', 4), 10, false, false);
    this.aniFire.onComplete.add(function(){
      this.isFire = false;
    },this);
    this.jump_fire.onComplete.add(function(){
      this.isFire = false;
    },this);
  }

  fire(){
    //console.log(this);
    if(this.isJump){
      this.animations.play('jump_throw');
    }else{
      this.animations.play('throw');
    }

    this.weapon.fireAngle = this.stickAngle;
    if(this.stickDirect == 'left' && this.stickAngle == 0){
         this.weapon.fireAngle = -180;
    }
    this.weapon.fire();


  }
  jump(){
    let _this = this;
    if(!this.isJump){
      this.animations.play('jump');
      this.action = 'jump';
      setTimeout(function(){
        _this.action = '';
      },100)
      this.isJump = true;
      this.body.velocity.y = -250;
    }

  }


  collisionHandler(weapon,player){
    weapon.kill();
    player.frameName = 'jump_throw/0003';
  }
  update(){

    if(this.isRun && this.action !='run' && !this.isJump){
      this.isFire = false;
      this.animations.play('run');
      this.action ='run';
    }
    if(!this.isRun && !this.isFire && this.action != 'idle' && !this.isJump){
      this.animations.play('idle');
      this.action = 'idle'
    }
    //this.game.physics.arcade.collide(this, ground, boyDropToGroundHandle, null, this);
    if(this.body.onFloor()){
      this.isJump = false;
    }else{
      this.isJump = true;
    }

  }



}

export default Player;
