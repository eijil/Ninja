
class Menu extends Phaser.State {

    constructor() {
        super();

    }

    create() {


        this.$roomList = $(".roomList");
        this.game.roomID = 0;
        this.game.player = '';
        this.ref = wilddog.sync().ref();

        // this.roomList();
        // this.JoinRoom();
        this.game.state.start('game');
        window.clearRoom = function(){
          wilddog.sync().ref().set({
            "00000":""
          });
        }
        window.onload= function(){
          console.log('xx');
          window.clearRoom();
        }
    }

    update() {

    }
    roomList() {
        var _this = this;
        var htmlList = '';
        this.ref.on("value", (snapshot) => {
            snapshot.forEach(function(data) {
                var roomID = data.key();
                var playerNum = data.numChildren();
                htmlList += `<li id="${roomID}">
                               <div>room: ${roomID}</div>
                               <div>player: ${playerNum}/2</div>
                            </li>`;
            })
            $(".roomList ul").html(htmlList);
            _this.$roomList.show();
        })

    }

    createRoom() {
    }
    startGame(){
      this.ref.off();
      this.$roomList.hide();
      this.game.state.start('game');
    }

    JoinRoom() {

        var _this = this;
        _this.$roomList.on('click', 'li', (e) => {
            var roomID = $(e.currentTarget).attr("id");
            _this.game.roomID = roomID;
            _this.ref.child(roomID).once('value').then((snapshot) => {
                let num = snapshot.numChildren();
                if(num == 0){
                  _this.ref.child(roomID).update({
                    "player1" : ""
                  })
                  _this.game.player = 'player1';
                  console.log('you are player1');
                  //进入游戏
                  _this.startGame();
                }
                if(num == 1){
                  if(_this.game.player != 'player1'){
                    _this.ref.child(roomID).update({
                      "player2" : ""
                    });
                    _this.game.player = 'player2';
                    console.log('you are player2');
                    //进入游戏
                    _this.startGame();
                  }else{
                    console.log('join fail');
                  }
                }
                if(num == 2){
                  console.log('join fail');
                }

            })

        })
    }
    //create some cool tweens and apply them to 'this.ready' and 'this.go'


}

export default Menu;
