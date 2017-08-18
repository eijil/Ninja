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

    this.setAnimations();



    this.weapon = this.game.add.weapon(10,'kunai');
    this.weapon.trackSprite(this,10,10);
    this.weapon.bulletSpeed = 400;
    //子弹间隔时间
    this.weapon.fireRate = 600;
    this.weapon.bulletKillDistance = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.weapon.bullets.setAll('body.allowGravity',false);
    //fire callback
    this.weapon.onFire.add((bullet,weapon)=>{
      console.log('fire');
    })

    this.stickAngle = 0;
    this.stickDirect;


  }


  fire(){
    //console.log(this);
    this.animations.play('throw');
    this.weapon.fireAngle = this.stickAngle;
    if(this.stickDirect == 'left' && this.stickAngle == 0){
         this.weapon.fireAngle = -180;
    }
    this.weapon.fire()

  }
  jump(){

  }
  setAnimations(){
    this.animations.add('run', Phaser.Animation.generateFrameNames('run/', 1, 10, '', 4), 10, true, false);
    this.animations.add('dead', Phaser.Animation.generateFrameNames('dead/', 1, 10, '', 4), 10, true, false);
    this.animations.add('attack', Phaser.Animation.generateFrameNames('attack/', 1, 10, '', 4), 10, true, false);
    this.animations.add('dead', Phaser.Animation.generateFrameNames('dead/', 1, 10, '', 4), 10, true, false);
    this.animations.add('idle', Phaser.Animation.generateFrameNames('idle/', 1, 10, '', 4), 10, true, false);
    this.animations.add('jump', Phaser.Animation.generateFrameNames('jump/', 1, 10, '', 4), 10, true, false);
    this.animations.add('jump_attack', Phaser.Animation.generateFrameNames('jump_attack/', 1, 10, '', 4), 10, true, false);
    this.animations.add('jump_throw', Phaser.Animation.generateFrameNames('jump_throw/', 1, 10, '', 4), 10, true, false);
    this.animations.add('slice', Phaser.Animation.generateFrameNames('slice/', 1, 10, '', 4), 10, true, false);
    this.animations.add('throw', Phaser.Animation.generateFrameNames('throw/', 1, 10, '', 4), 10, false, false);
  }

  collisionHandler(weapon,player){
    weapon.kill();
    player.frameName = 'jump_throw/0003';
  }




}

export default Player;
