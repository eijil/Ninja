//Documentation for Phaser's (2.6.2) sprites:: phaser.io/docs/2.6.2/Phaser.Sprite.html
class Player extends Phaser.Sprite {

  //initialization code in the constructor
  constructor(game, x, y, key, frame) {

    super(game, x, y, key,frame);
    
    //出生位置;
    this.x = key == 'player1' : 100 : 800;

    //setup physics properties
    this.anchor.setTo(0.5, 0.5);
    this.game.physics.arcade.enableBody(this);
    this.body.collideWorldBounds = true;

    var run = this.animations.add('run', Phaser.Animation.generateFrameNames('run/', 1, 10, '', 4), 10, true, false);

    this.animations.add('dead', Phaser.Animation.generateFrameNames('dead/', 1, 10, '', 4), 10, true, false);
    this.animations.add('attack', Phaser.Animation.generateFrameNames('attack/', 1, 10, '', 4), 10, true, false);
    this.animations.add('dead', Phaser.Animation.generateFrameNames('dead/', 1, 10, '', 4), 10, true, false);
    this.animations.add('idle', Phaser.Animation.generateFrameNames('idle/', 1, 10, '', 4), 10, true, false);
    this.animations.add('jump', Phaser.Animation.generateFrameNames('jump/', 1, 10, '', 4), 10, true, false);
    this.animations.add('jump_attack', Phaser.Animation.generateFrameNames('jump_attack/', 1, 10, '', 4), 10, true, false);
    this.animations.add('jump_throw', Phaser.Animation.generateFrameNames('jump_throw/', 1, 10, '', 4), 10, true, false);
    this.animations.add('slice', Phaser.Animation.generateFrameNames('slice/', 1, 10, '', 4), 10, true, false);
    this.animations.add('throw', Phaser.Animation.generateFrameNames('throw/', 1, 10, '', 4), 10, false, false);

    this.weapon;
    this.weaponsArray = [];
    this.weaponTime = 0;
    this.weapons = this.game.add.group();
    this.weapons.enableBody = true;
    this.weapons.physicsBodyType = Phaser.Physics.ARCADE;
    this.weapons.createMultiple(30, 'kunai');
    this.weapons.setAll('anchor.x', 0.8);
    this.weapons.setAll('anchor.y', 0.5);
    this.weapons.setAll('outOfBoundsKill', true);
    this.weapons.setAll('checkWorldBounds', true);


    this.stickAngle;
    this.stickDirect;


  }
  fire(){
    //console.log(this);
    this.animations.play('throw');

    if(this.game.time.now > this.weaponTime){

      this.weapon = this.weapons.getFirstExists(false);
      this.weapon.body.allowGravity = false;
      this.weaponDiffTime = 300;
      if(this.weapon){
        this.weapon.reset(this.x,this.y);
        this.weapon.angle = 180;
        this.game.physics.arcade.velocityFromAngle(this.weapon.angle,400,this.weapon.body.velocity);
        ;
        this.weaponTime = this.game.time.now + this.weaponDiffTime;
      }
    }
  }
  jump(){

  }

  collisionHandler(weapon,player){
    weapon.kill();
    player.frameName = 'jump_throw/0003';
  }




}

export default Player;
