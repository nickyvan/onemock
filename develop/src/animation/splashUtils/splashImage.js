import * as PIXI from 'pixi.js';
class splashImage extends PIXI.Container {
  constructor(path,myScene){
    super();
    this._step = 0;
    this._rad = Math.PI/180;
    this._span = 360/6;
    this._myScene = myScene;
    this._sprite = new PIXI.Sprite(PIXI.Texture.fromImage(path));
    this._maskSpr = new PIXI.Graphics();
    
    this.addChild(this._sprite);
    this.addChild(this._maskSpr);
    
    this._maskSpr.y = window.innerHeight/2;
    this._sprite.mask = this._maskSpr;

    this.x = window.innerWidth/2;
    this.y = window.innerHeight/2;

    this.alpha = 0;
    this._blurFilter = new PIXI.filters.BlurFilter();
    this._blurFilter.blur = 40;
    this.filters = [this._blurFilter];

    this.reset();
    
  }

  onSceneChange = (current_scene) => {
    
    if (this._myScene === current_scene) {
      // this.reset();
      this.carcPosition();
      //-  console.log('show' + this._myScene);
      this._isShow = true;
      this._isAnimate = true;
    } else {
      this._isShow = false;
      this._isAnimate = true;
    }
  }
  
  reset = () => {
    this.scale.x = this.scale.y = 1;
    this._maskSpr.clear();
    this._step = 0;
  }

  update = (move_pattern):void => {
    this.carcPosition();
    if (this._isShow) {
      this.showCarc();
      if (!this._isAnimate) return;
      switch(move_pattern) {
        case 1 :
          this.ovalChange();
        break;
        case 2 :
          this.blindChange();
        break;
        case 3 :
          this.ovalChange();
        break;
        case 4 :
          this._maskSpr.scale.x = -1;
          this.roundChange();
        break;
      }
    } else {
      if (!this._isAnimate) return;
      this.hideCarc();
    }
  }

  carcPosition = ():void => {
    this._sprite.pivot = new PIXI.Point(this._sprite._texture._frame.width/2, this._sprite._texture._frame.height/2);
    this._sprite.height = window.innerHeight;
    this._sprite.scale.set(this._sprite.scale.y)

    this._maskSpr.x = this._maskSpr.y = 0;
    this._maskSpr.scale.x = this._maskSpr.scale.y = 1;
    this.x = window.innerWidth /2;
    this.y = window.innerHeight/2;

  }

  showCarc = ():void => {
    this.alpha += (1-this.alpha)/10;
    this.scale.x += 0.0005;
    this.scale.y = this.scale.x;
    this._blurFilter.blur += (0 - this._blurFilter.blur)/5;
  }

  hideCarc = ():void => {
    this.alpha += (0-this.alpha)/20;
    this.scale.x += (1.2 - this.scale.x)/20;
    this.scale.y = this.scale.x;
    this._blurFilter.blur += (20 - this._blurFilter.blur)/5;
    if(this.alpha<0.1){
      this.reset();
    }
  }

  ovalChange = ():void => {
    this._step += (1000 - this._step)/20;
    this._maskSpr.clear();
    this._maskSpr.beginFill(0x000000, 1);
    this._maskSpr.drawCircle(0, 0, this._step);
    this._maskSpr.endFill();

    if (Math.abs(1000 - this._step) < 0.5) {
      this._isAnimate = false;
    }
  }
  
  blindChange = ():void => {
    var _span = window.innerWidth/20;
    this._step += 6;

    this._maskSpr.clear();
    this._maskSpr.beginFill(0x000000, 1);

    var i:number = 0;
    for (i=0; i<20; i++) {
      this._maskSpr.drawRect(-window.innerWidth/2 + _span*i, -window.innerHeight/2, this._step, window.innerHeight);
    }

    this._maskSpr.endFill();

    if (Math.abs(_span - this._step) < 0) {
      this._isAnimate = false;
    }
  }

  roundChange = ():void => {
    this._step += 2;

    this._maskSpr.clear();
    this._maskSpr.beginFill(0xaaaaaa);

    var i:number = 0;
    var k:number = 0;

    for (i=0; i<=this._span; i++) {
      this._maskSpr.moveTo(0,0);

      for (k=0; k<this._step; k++) {
        var _tDeg = this._span * i + k;
        var _gotoX = 1000 * Math.sin(_tDeg * this._rad);
        var _gotoY = 1000 * Math.cos(_tDeg * this._rad);
        this._maskSpr.lineTo(_gotoX, _gotoY);
      }
      this._maskSpr.lineTo(0,0);
    }
    this._maskSpr.endFill();

    if (this._step >= this._span * 2) {
      this._isAnimate = false;
    }
  }
}

export default splashImage;