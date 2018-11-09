interface Window {
  webkitRequestAnimationFrame():void
  mozRequestAnimationFrame():void
  oRequestAnimationFrame():void
  msRequestAnimationFrame():void
  requestAnimFrame(_callback):any
  cancelAnimFrame(opt:any):void
  cancelRequestAnimationFrame():void
  webkitCancelAnimationFrame():void
  webkitCancelRequestAnimationFrame():void
  mozCancelAnimationFrame():void
  mozCancelRequestAnimationFrame():void
  msCancelAnimationFrame():void
  msCancelRequestAnimationFrame():void
  oCancelAnimationFrame():void
  oCancelRequestAnimationFrame():void
  fastClick():any
}

window.requestAnimFrame = (():any => {
  return window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback){
    window.setTimeout(callback, 1E3/60)
  }
})();

window.cancelAnimFrame = (():any => {
  return window.cancelAnimationFrame ||
  window.cancelRequestAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.webkitCancelRequestAnimationFrame ||
  window.mozCancelAnimationFrame ||
  window.mozCancelRequestAnimationFrame ||
  window.msCancelAnimationFrame ||
  window.msCancelRequestAnimationFrame ||
  window.oCancelAnimationFrame ||
  window.oCancelRequestAnimationFrame ||
  function(id) { window.clearTimeout(id); };
})();

$(document).ready(function() {
  new onemock.contents.index.Main();
});


module onemock.contents.index {
  export class EventDispatcher {
    public Dispatcher:any;
    constructor() {
      this.Dispatcher = $(window);
    }
  }

  export class Ease extends EventDispatcher {
    public static EaseOut      = 'easeOutSine';
    public static EaseOutCubic = 'easeOutCubic';
    public static Linear       = 'linear';
  }

  export class Event {
    public static CONTENTS_CHANGE:string = 'CONTENTS_CHANGE';
    public static OPEN_MODAL     :string = 'OPEN_MODAL';
    public static JAPAN_CAPTURE  :string = 'JAPAN_CAPTURE';
    public static OPEN_LINEUP  :string = 'OPEN_LINEUP';
    public static OPEN_HOWTO  :string = 'OPEN_HOWTO';
  }

  export class CONTENTS {
    public static SPLASH   :string = 'SPLASH';
    public static MEETS    :string = 'MEETS';
    public static SWING    :string = 'SWING';
    public static LINEUP   :string = 'LINEUP';
    public static NEWS     :string = 'NEWS';
    public static JAPAN    :string = 'JAPAN';
    public static QUALITY  :string = 'QUALITY';
    public static SCENE    :string = 'SCENE';
    public static HOWTO    :string = 'HOWTO';
    public static SHOW_ROOM:string = 'SHOW_ROOM';
    public static OTHER    :string = 'OTHER';
  }

  export class Main extends EventDispatcher {
    public static Stage:any;
    public static CURRENT_CONTENTS:string = '';
    public static CONTENTS_NUMBER:number = 0;

    constructor() {
      super();
      Main.Stage = $(window);
      var _self = this;

      var ua = navigator.userAgent;
      var _isSp = false;
      if((ua.indexOf('Android') > 0 && ua.indexOf('Mobile') == -1)){
        _isSp = true;
      } else if ((ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0)){
        _isSp = true;
      } else if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPad') > 0 || ua.indexOf('iPod') > 0){
        _isSp = true;
      }

      if (_isSp)  {
        location.href = (location.href + '/sp').split('//sp').join('/sp');
      }

      new UI() //-  fix
      new Splash(); //-  fix
      new Meets(); //-  fix
      new Swing(); //-  fix
      new Lineup(); //-  fix
      new News(); //-  fix
      new Japan(); //-  fix : text
      new Quality(); //-  fix
      // new DecorationPhoto($('#decoration_photo1'));  //-  fix
      // new DecorationPhoto($('#decoration_photo2'));  //-  fix
      new DecorationPhoto($('#decoration_photo3'));  //-  fix
      new Scenes(); //-  fix
      new Howto(); //-  fix
      new ShowRoom(); //-  fix
      new ModalColorList(); //-  fix
      new ModalLineup(); //-  fix
      new ModalHowto();
      new ContentsJadgement(); //-  fix
      new SectionWatcher(); //-  fix
      new BackgroundYoutube();

      Main.CURRENT_CONTENTS = CONTENTS.SPLASH;
      this.Dispatcher.trigger(Event.CONTENTS_CHANGE);
    }

    public static getVisible = (_target:any):boolean => {
      var _top = Main.Stage.scrollTop();
      var _bottom = _top + Main.Stage.height();

      if (_top < _target.offset().top + _target.height() && _bottom >= _target.offset().top) {
        return true;
      } else {
        return false;
      }
    }
  }

  export class BackgroundYoutube extends EventDispatcher {
    private _node:any;
    private _origin:any = {x:854, y:480};
    private _current:any = {x:854, y:480};
    constructor() {
      super();
      this._node = $('#background_youtube').find('iframe');
      this.Dispatcher.bind('resize', this.onResizeHD).trigger('resize');
    }

    onResizeHD = ():void => {
      this._current.x = this.Dispatcher.width();
      this._current.y = this._origin.y * this._current.x/this._origin.x;
      if (this._current.y < this.Dispatcher.height()) {
        this._current.y = this.Dispatcher.height();
        this._current.x = this._origin.x * this._current.y/this._origin.y;
      }


      var _gotoX = Math.floor((this.Dispatcher.width() - this._current.x)/2);
      var _gotoY = Math.floor((this.Dispatcher.height() - this._current.y)/2);

      this._node.css({left:_gotoX, top:_gotoY, width:this._current.x, height:this._current.y});
    }
  }

  export class UI extends EventDispatcher {
    private _logo:any;
    private _btnMenu:any;
    private _btnShop:any;

    constructor() {
      super();
      this._logo = $('#company_logo');
      this._logo.bind('click', this.gotoTop);
    }

    gotoTop = ():void => {
      $('html, body').animate({scrollTop:0}, 'slow');
    }
  }

  export class DecorationPhoto extends EventDispatcher {
    private _marginSpan:number = 0;
    private _photo:any;
    private _coreY:number = 0;
    private _style:any;

    constructor(public _target:any) {
      super();
      this._photo = this._target.find('.background');
      this._style = this._photo.get(0).style;
      this.Dispatcher.bind('scroll', this.onScrollHD);
    }

    onScrollHD = ():void => {
      var _show = Main.getVisible(this._target);
      if (!_show) return;

      this._coreY = this._target.offset().top;
      var _percentage = 1 - (this._coreY / (this.Dispatcher.scrollTop() + this.Dispatcher.height()));
      _percentage = Math.max(0, _percentage);

      this._style['background-position'] = '50% ' + (-400*_percentage)  + 'px';
    }
  }

  export class ContentsJadgement extends EventDispatcher {
    private _contentsTarget:any = [];
    private _contentsPositions:any = [];
    private _prevContents:string = "";
    private _prevNum:number = -1;

    constructor() {
      super();
      var _self = this;

      $('.contents_target').each(function() {
        _self._contentsTarget.push($(this));
      });

      this.Dispatcher.bind(Event.JAPAN_CAPTURE, this.onResizeHD);
      this.Dispatcher.bind('scroll', _.throttle(this.onScrollHD, 150)).trigger('scroll');

      setTimeout(function() {
        _self._prevNum = -1;
        _self.Dispatcher.trigger('scroll');
      }, 500);
    }

    onResizeHD = ():void => {
      this._contentsPositions = [];

      var i:number = 0;
      for(i=0; i<this._contentsTarget.length; i++) {
        this._contentsPositions.push(this._contentsTarget[i].offset().top);
      }
    }

    onScrollHD = ():void => {
      var _bottom = this.Dispatcher.scrollTop() + this.Dispatcher.height();
      var i:number = 0;

      for(i=this._contentsPositions.length-1; i>=0; i--) {
        if (_bottom-200 >= this._contentsPositions[i]) {
          if (this._prevNum === i)  return;
          this._prevNum = i;
          this.jadgeContentsChange(i);
          return;
        }
      }
    }

    jadgeContentsChange = (_num:number):void => {
      switch(_num) {
        case 0 :
          Main.CURRENT_CONTENTS = CONTENTS.SPLASH;
          Main.CONTENTS_NUMBER  = 0;
        break;
        case 1 :
          Main.CURRENT_CONTENTS = CONTENTS.MEETS;
          Main.CONTENTS_NUMBER  = 1;
        break;
        case 2 :
          Main.CURRENT_CONTENTS = CONTENTS.SWING;
          Main.CONTENTS_NUMBER  = 2;
        break;
        case 3 :
          Main.CURRENT_CONTENTS = CONTENTS.LINEUP;
          Main.CONTENTS_NUMBER  = 3;
        break;
        case 4 :
          Main.CURRENT_CONTENTS = CONTENTS.NEWS;
          Main.CONTENTS_NUMBER  = 4;
        break;
        case 5 :
          Main.CURRENT_CONTENTS = CONTENTS.JAPAN;
          Main.CONTENTS_NUMBER  = 5;
        break;
        case 6 :
          Main.CURRENT_CONTENTS = CONTENTS.QUALITY;
          Main.CONTENTS_NUMBER  = 6;
        break;
        case 7 :
          Main.CURRENT_CONTENTS = CONTENTS.SCENE;
          Main.CONTENTS_NUMBER  = 7;
        break;
        case 8 :
          Main.CURRENT_CONTENTS = CONTENTS.HOWTO;
          Main.CONTENTS_NUMBER  = 8;
        break;
        case 9 :
          Main.CURRENT_CONTENTS = CONTENTS.SHOW_ROOM;
          Main.CONTENTS_NUMBER  = 9;
        break;
        case 10 :
          Main.CURRENT_CONTENTS = CONTENTS.OTHER;
          Main.CONTENTS_NUMBER  = 10;
        break;
      }
      // console.log(Main.CURRENT_CONTENTS);
      this.Dispatcher.trigger(Event.CONTENTS_CHANGE);
    }
  }

  export class SectionWatcher extends EventDispatcher {
    private _targetSections:any = [];
    constructor() {
      super();
      var _self = this;
      $('.max_h').each(function() {
        _self._targetSections.push($(this));
      });
      this.Dispatcher.bind('resize', _.debounce(this.onResizeHD, 150)).trigger('resize');
    }

    onResizeHD = ():void => {
      var i:number = 0;
      var _height = this.Dispatcher.height();

      for(i=0; i<this._targetSections.length; i++) {
        this._targetSections[i].css({height:_height});
      }
    }
  }

  export class SplashEvent {
    public static SCENE_END:string = 'SCENE_END';
    public static SCENE_CHANGE:string = 'SCENE_CHANGE';
  }

  export class Splash extends EventDispatcher {
    public static CURRENT_SCENE:number = 0;
    public static MOVE_PATTERN:number = 0;
    public static STAGE_RECT = {x:0, y:0, width:0, height:0};

    private _myContents:string = CONTENTS.SPLASH;
    private _isShow:boolean = false;
    private _node:any;
    private _targetId:string = 'splash_stage';
    private _particleContainer:any;

    private _logoSpr:any;
    private _sceneCount:number = 150;


    private _stage:any;
    private _renderer:any;
    private _width:number = 640;
    private _height:number = 480;
    private _renderingTimer:any;

    private _catch:any = [];
    private _photo:any = [];
    private _particles:any = [];


    private _emitterX:number = 0;
    private _emitFlg:boolean = false;
    private _emitSpan:number = 0;
    private _emitCount:number = 0;

    constructor() {
      super();
      var _self = this;

      this._node = $('#splash_stage');
      this.setupCanvas();
      this.Dispatcher.bind('scroll', this.onScrollHD).trigger('scroll');
      this.Dispatcher.bind('resize', this.onResizeHD).trigger('resize');
    }

    setupCanvas = ():void => {
      PIXI.utils._saidHello = true;
      var rendererOptions = {
        antialias:false
      }

      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.indexOf('firefox') != -1) {
        this._renderer = new PIXI.CanvasRenderer(this._width, this._height);

      } else {
        this._renderer = PIXI.autoDetectRenderer(this._width, this._height);
      }
      this._renderer.backgroundColor = 0xffffff;
      this._stage = new PIXI.Container();

      document.getElementById(this._targetId).appendChild(this._renderer.view);

      this._particleContainer = new PIXI.ParticleContainer();
      this._stage.addChild(this._particleContainer);

      this._logoSpr = new PIXI.Sprite(PIXI.Texture.fromImage('img/splash/bg_splash.png'));
      this._stage.addChild(this._logoSpr);

      this._photo.push(new SplashImage('img/splash/chair1.png', 2));
      this._photo.push(new SplashImage('img/splash/chair2.png', 4));
      this._photo.push(new SplashImage('img/splash/chair3.png', 6));


      this._catch.push(new SplashCatch('img/splash/catch1.png', 1));
      this._catch.push(new SplashCatch('img/splash/catch2.png', 3));
      this._catch.push(new SplashCatch('img/splash/catch3.png', 5));

      var i:number = 0;
      for(i=0; i<this._photo.length; i++) {
        this._stage.addChild(this._photo[i]);
      }

      for(i=0; i<this._catch.length; i++) {
        this._stage.addChild(this._catch[i]);
      }

      this._renderer.render(this._stage);
    }

    onResizeHD = ():void => {
      Splash.STAGE_RECT.x = this.Dispatcher.width()/2;
      Splash.STAGE_RECT.y = this.Dispatcher.height()/2;
      Splash.STAGE_RECT.width = this.Dispatcher.width();
      Splash.STAGE_RECT.height = this.Dispatcher.height();
    }

    onScrollHD = ():void => {
      Main.getVisible(this._node) ? this.show() : this.hide();
    }

    show = ():void => {
      if (this._isShow) return;
      this._isShow = true;
      this._renderingTimer = window.requestAnimFrame(this.render);
    }

    hide = ():void => {
      if (!this._isShow) return;

      this._isShow = false;
      window.cancelAnimFrame(this._renderingTimer);
    }

    render = ():void => {
      this._sceneCount ++;

      this._logoSpr.pivot = new PIXI.Point(this._logoSpr.width/2, this._logoSpr.height/2);
      this._logoSpr.x = Splash.STAGE_RECT.width/2;
      this._logoSpr.y = Splash.STAGE_RECT.height/2;

      if (this._sceneCount > 250) {
        this._sceneCount = 1;
        Splash.CURRENT_SCENE ++;
        if (Splash.CURRENT_SCENE > 6)  Splash.CURRENT_SCENE = 1;
        if (Splash.CURRENT_SCENE%2 === 1)  Splash.MOVE_PATTERN ++;
        if (Splash.MOVE_PATTERN > 4)  Splash.MOVE_PATTERN = 1;

        if (Splash.CURRENT_SCENE%2 === 1) this.emit();
        //-  console.log('_sceneChange => ', Splash.CURRENT_SCENE, 'ptn =>', Splash.MOVE_PATTERN);

        this.Dispatcher.trigger(SplashEvent.SCENE_CHANGE);
      }

      //-  photo
      var i:number = 0;
      for(i=0; i<this._photo.length; i++) {
        this._photo[i].update();
      }

      //-  catch
      for(i=0; i<this._catch.length; i++) {
        this._catch[i].update();
      }

      for(i=this._particles.length-1; i>=0; i--) {
        this._particles[i].update();
        if (this._particles[i].life < 0)  {
          this._particleContainer.removeChild(this._particles[i]);
          this._particles[i].dispose();
          this._particles.splice(i, 1);
        }
      }

      //-  emitter
      if (this._emitFlg) {
        this._emitCount ++;
        this._emitterX += 40;

        if (this._emitCount > this._emitSpan) {
          for(i=0; i<20; i++) {
            this.addParticle();
          }
          this._emitSpan = Math.random()*2;
        }

        if (this._emitterX > Splash.STAGE_RECT.width) {
          this._emitFlg = false;
        }

      }

      if (this._renderer.width != Splash.STAGE_RECT.width || this._renderer.height != Splash.STAGE_RECT.height) {
        this._renderer.resize(Splash.STAGE_RECT.width, Splash.STAGE_RECT.height);
      }

      this._renderer.render(this._stage);
      this._renderingTimer = window.requestAnimFrame(this.render);
    }

    emit = ():void => {
      this._emitterX = -Splash.STAGE_RECT.width/2;
      this._emitFlg = true;
    }

    addParticle = ():void => {
      var _particle = new CatchParticle(this._emitterX);
      this._particles.push(_particle);
      this._particleContainer.addChild(_particle);
    }
  }

  export class CatchParticle extends PIXI.Sprite {
    public life:number;
    private _deg:number = 0;
    private _handle:number = 0;
    private _handleRatio:number = 0;
    private _handleStep:number = 0;
    private _spd:number = 0;
    private _targetSpd:number = 0;
    private _rad:number = Math.PI/180;

    constructor(public _x:number = 0) {
      super(PIXI.Texture.fromImage('img/particle.png'));

      this.scale.x = this.scale.y = Math.random();
      this.x = _x;
      this.y = Splash.STAGE_RECT.height/2;

      this._deg = Math.random() * 360;
      this.life = 100 + Math.random() * 100;
      this.cacheAsBitmap = true;

      this._spd = Math.random()*10;

      this.handleReset();
    }

    reset = ():void => {
      this._targetSpd = 2 + Math.random()*3;
      this._handle = (-10 + Math.random()* 20) * 0.2;
    }

    handleReset = ():void => {
      this._handleStep = 0;
      this._handleRatio = Math.random()*50;
      this.reset();
    }

    update = ():void => {
      this.life --;
      this._handleStep ++;
      if (this._handleStep > this._handleRatio) {
        this.handleReset();
      }
      this._spd += (this._targetSpd - this._spd)/5;

      this._deg += this._handle;
      this.scale.x = this.scale.y = this.life/200;
      this.x += this._spd * Math.sin(this._deg*this._rad);
      this.y += this._spd * Math.cos(this._deg*this._rad);
    }

    dispose = ():void => {
      this.cacheAsBitmap = null;
      this.texture = null;
    }
  }

  export class SplashCatch extends PIXI.Sprite {
    private _isShow :boolean = false;
    private _isAnimate:boolean = false;

    private _blurFilter:any;

    constructor(public _path:string = 'null', public _myScene:number = 0, public _mode:boolean = false) {
      super(PIXI.Texture.fromImage(_path));
      $(window).bind(SplashEvent.SCENE_CHANGE, this.onSceneChange);


      this.alpha = 0;
      this.scale.x = this.scale.y = 0.8;

      this._blurFilter = new PIXI.filters.BlurXFilter();
      this.filters = [this._blurFilter];
      this.reset();
    }

    onSceneChange = ():void => {
      if (this._myScene === Splash.CURRENT_SCENE) {
        this.reset();
        this._isShow = true;
        this._isAnimate = true;
      } else {
        this._isShow = false;
        this._isAnimate = true;
      }
    }

    reset = ():void => {
      if (!this._mode) {
        this.scale.x = this.scale.y = 0.7;
        this.alpha = 0;
        this._blurFilter.blur = 200;
      } else {
        this.scale.x = this.scale.y = 5;
        this.alpha = 0.05;
      }

      this.carcPosition();

    }

    update = ():void => {
      if (this._isShow) {
        if (!this._isAnimate) return;
        this.showCarc();
      } else {
        if (!this._isAnimate) return;
        this.hideCarc();
      }
    }

    showCarc = ():void => {
      if (!this._mode) {
        this.scale.x += 0.001;
        this.scale.y = this.scale.x;
        this.alpha += (1-this.alpha)/10;
      } else {
        this.scale.x -= 0.001;
        this.scale.y = this.scale.x;
        // this.alpha -= 0.01;
      }

      this._blurFilter.blur += (0 - this._blurFilter.blur)/10;
    }

    hideCarc = ():void => {
      if (!this._mode) {
        this.scale.x += (1.2 - this.scale.x)/10;
        this.scale.y = this.scale.x;
        this._blurFilter.blur += (100 - this._blurFilter.blur)/10;
      }
      this.alpha += (0-this.alpha)/10;

      if (Math.abs(0-this.alpha) < 0) {
        this._isAnimate = false;
      }
    }

    carcPosition = ():void => {
      if (!this._mode) {
        this.pivot = new PIXI.Point(this._texture._frame.width/2, this._texture._frame.height/2);
      } else {
        this.pivot = new PIXI.Point(this._texture._frame.width/2, this._texture._frame.height/2-20);
      }
      this.x = Splash.STAGE_RECT.width/2;
      this.y = Splash.STAGE_RECT.height/2;
    }
  }

  export class SplashImage extends PIXI.Container {
    private _sprite:any;
    private _maskSpr:any;
    private _deg:number = 0;
    private _span:number = 360/15;

    private _step:number = 0;
    private _rad:number = Math.PI/180;

    private _isShow:boolean = false;
    private _isAnimate:boolean = false;

    private _moveRatio:any = {x:0, y:0};

    private _maskParticles:any = [];
    private _maskContainer:any;

    private _blurFilter:any;

    constructor(public _path:string = 'null', public _myScene:number = 0) {
      super();


      this._sprite = new PIXI.Sprite(PIXI.Texture.fromImage(_path));
      this._maskSpr = new PIXI.Graphics();

      this.addChild(this._sprite);
      this.addChild(this._maskSpr);

      this._maskSpr.y = $(window).height()/2;
      this._sprite.mask = this._maskSpr;

      var _xCount = 0;
      var _yCount = 0;
      this.x = Splash.STAGE_RECT.width/2;
      this.y = Splash.STAGE_RECT.width/2;

      this.alpha = 0;
      this._blurFilter = new PIXI.filters.BlurFilter();
      this._blurFilter.blur = 40;
      this.filters = [this._blurFilter];


      this.reset();
      $(window).bind(SplashEvent.SCENE_CHANGE, this.onSceneChange);
    }

    onSceneChange = ():void => {
      if (this._myScene === Splash.CURRENT_SCENE) {
        this.reset();
        this.carcPosition();
        //-  console.log('show' + this._myScene);
        this._isShow = true;
        this._isAnimate = true;
      } else {
        this._isShow = false;
        this._isAnimate = true;
      }
    }

    reset = ():void => {
      this.scale.x = this.scale.y = 1;
      this._maskSpr.clear();
      this._step = 0;
      var i:number = 0;
      for (i=0; i<this._maskParticles.length; i++)  {
        this._maskParticles[i].scale.x = this._maskParticles[i].scale.y = 0;
      }
      this._moveRatio = {x:0, y:0};
    }

    update = ():void => {
      this.carcPosition();
      if (this._isShow) {
        this.showCarc();
        if (!this._isAnimate) return;

        switch(Splash.MOVE_PATTERN) {
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
      this._sprite.height = Splash.STAGE_RECT.height;
      this._sprite.scale.set(this._sprite.scale.y)

      this._maskSpr.x = this._maskSpr.y = 0;
      this._maskSpr.scale.x = this._maskSpr.scale.y = 1;
      this.x = Splash.STAGE_RECT.width /2;
      this.y = Splash.STAGE_RECT.height/2;


    }

    showCarc = ():void => {
      this.alpha += (1-this.alpha)/10;
      this.scale.x += 0.0005;
      this.scale.y = this.scale.x;
      // this.scale.x += (1 - this.scale.x)/10;
      // this.scale.y = this.scale.x;
      this._blurFilter.blur += (0 - this._blurFilter.blur)/5;
    }

    hideCarc = ():void => {
      this.alpha += (0-this.alpha)/20;
      this.scale.x += (1.2 - this.scale.x)/20;
      this.scale.y = this.scale.x;
      this._blurFilter.blur += (20 - this._blurFilter.blur)/5;
    }

    mulchOval = ():void => {
      this._moveRatio.x += 0.5;
      this._moveRatio.y = this._moveRatio.x;



      var i:number = 0;
      for (i=0; i<this._maskParticles.length; i++)  {

        if (this._maskParticles[i].myX <= this._moveRatio.x && this._maskParticles[i].myY <= this._moveRatio.y) {
          this._maskParticles[i].scale.x += (1-this._maskParticles[i].scale.x)/5;
          this._maskParticles[i].scale.y = this._maskParticles[i].scale.x;
        }
      }

    }

    blindChange = ():void => {
      var _span = Splash.STAGE_RECT.width/20;
      this._step += 6;

      this._maskSpr.clear();
      this._maskSpr.beginFill(0x000000, 1);

      var i:number = 0;
      for (i=0; i<20; i++) {
        this._maskSpr.drawRect(-Splash.STAGE_RECT.width/2 + _span*i, -Splash.STAGE_RECT.height/2, this._step, Splash.STAGE_RECT.height);
      }

      this._maskSpr.endFill();

      if (Math.abs(_span - this._step) < 0) {
        //-  console.log('end');
        this._isAnimate = false;
      }
    }

    ovalChange = ():void => {
      this._step += (1000 - this._step)/20;
      this._maskSpr.clear();
      this._maskSpr.beginFill(0x000000, 1);
      this._maskSpr.drawCircle(0, 0, this._step);
      this._maskSpr.endFill();

      if (Math.abs(1000 - this._step) < 0.5) {
        //-  console.log('end');
        this._isAnimate = false;
      }
    }

    roundChange = ():void => {
      //-  console.log('carc');
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
        //-  console.log('end');
        this._isAnimate = false;
      }
    }
  }


  export class Meets extends EventDispatcher {
    private _myContents:string = CONTENTS.MEETS;
    private _isShow:boolean = false;
    private _node:any;
    private _title:any;
    private _catch:any;
    private _text:any;
    private _photo:any;
    private _textCache:any = [];

    private _photoA:any;
    private _photoB:any;

    constructor() {
      super();
      var _self = this;

      this._node = $('#meets');
      this._title = this._node.find('h3');
      this._catch = this._node.find('.catch');
      this._text = this._node.find('.text');
      this._photo = this._node.find('.photo');

      this._photoA = $('#meets_photo_a');
      this._photoB = $('#meets_photo_b');

      this.Dispatcher.bind(Event.CONTENTS_CHANGE, this.onContentsChange);
    }

    onContentsChange = ():void => {
      var _isHide:boolean = false;
      if (Main.CONTENTS_NUMBER <= 0 || Main.CONTENTS_NUMBER >= 3) _isHide = true;

      _isHide ? this.hide() : this.show();
    }

    show = ():void => {
      if (this._isShow) return;
      this._isShow = true;

      this._title.velocity('stop').velocity({scale:1, opacity:1}, 600, Ease.EaseOut);
      this._catch.velocity('stop').velocity({scale:1, opacity:1}, 600, Ease.EaseOut);
      this._text.velocity('stop').velocity({translateX:0, opacity:1}, {duration:600, delay:400, easing:Ease.EaseOutCubic});
      this._photo.velocity('stop').velocity({scale:1, opacity:1}, {duration:600, delay:450});

      this._photoA.velocity("stop").velocity({translateY:0, opacity:1}, {duration:600, delay:750, easing:Ease.EaseOut});
      this._photoB.velocity("stop").velocity({translateY:0, opacity:1}, {duration:600, delay:950, easing:Ease.EaseOut});
    }

    hide = ():void => {
      if (!this._isShow)  return;
      this._isShow = false;

      this._title.velocity('stop').velocity({scale:0.5, opacity:0}, 300, Ease.EaseOut);
      this._catch.velocity('stop').velocity({scale:0.5, opacity:0}, 300, Ease.EaseOut);

      this._text.velocity('stop').velocity({translateX:100, opacity:0}, 300, Ease.EaseOut);
      this._photo.velocity('stop').velocity({scale:0.5, opacity:0}, 300, Ease.EaseOut);

      this._photoA.velocity("stop").velocity({translateY:100, opacity:0}, {duration:300, delay:0, easing:Ease.EaseOut});
      this._photoB.velocity("stop").velocity({translateY:100, opacity:0}, {duration:300, delay:0, easing:Ease.EaseOut});
    }
  }

  export class Swing extends EventDispatcher {
    private _myContents:string = CONTENTS.SWING;
    private _isShow:boolean = false;
    private _node:any;
    private _title:any;
    private _titleSpan:any = [];
    private _caption:any;
    private _textA:any;
    private _textB:any;
    private _swing:any;
    private _btn_material:any;

    private _leftSwing:any;
    private _rightSwing:any;

    private _renderingTimer:any;

    //-  childs
    private _photos:any = [];
    private _angleList:any;
    private _swingChair:any;

    constructor() {
      super();
      var _self = this;
      this._node = $('#swing');
      this._title = $('#swing_caption');
      this._caption = $('#swing_catch');

      this._textA = $('#swing_textA');
      this._textB = $('#swing_textB');

      this._swing = $('#swing_sub_caption');
      this._btn_material = $('#btn_material');

      this._leftSwing = $('#angle_list');
      this._rightSwing = $('#rotate_list');

      this._btn_material.bind('click', this.openModal);
      this._angleList = new AngleList();
      this._swingChair = new SwingChair();

      this.Dispatcher.bind(Event.CONTENTS_CHANGE, this.onContentsChange);

      this.firstHide();
    }

    firstHide = ():void => {
      this._title.velocity("stop").velocity({scale:0.5, opacity:0}, 0, Ease.EaseOutCubic);
      this._caption.velocity("stop").velocity({scale:0.5, opacity:0}, 0, Ease.EaseOutCubic);
      this._btn_material.velocity("stop").velocity({scale:0.5, opacity:0}, 0, Ease.EaseOutCubic);
      this._textA.velocity("stop").velocity({translateX:100, opacity:0}, {duration:0, easing:Ease.EaseOut});
      this._textB.velocity("stop").velocity({translateX:100, opacity:0}, {duration:0, easing:Ease.EaseOut});
      this._swing.velocity("stop").velocity({scale:2, opacity:0}, {duration:0, easing:Ease.EaseOut});
      this._leftSwing.velocity("stop").velocity({translateX:-200, opacity:0}, {duration:0, easing:Ease.EaseOut});
      this._rightSwing.velocity("stop").velocity({translateX:200, opacity:0}, {duration:0, easing:Ease.EaseOut});

      this._swingChair.hide();
      this._angleList.hide();
    }

    onContentsChange = ():void => {
      Main.CURRENT_CONTENTS === this._myContents ? this.show() : this.hide();
    }

    show = ():void => {
      if (this._isShow) return;
      this._isShow = true;


      this._swingChair.show();
      this._angleList.show();


      this._title.velocity("stop").velocity({scale:1, opacity:1}, 600, Ease.EaseOutCubic);
      this._caption.velocity("stop").velocity({scale:1, opacity:1}, 600, Ease.EaseOutCubic);
      this._btn_material.velocity("stop").velocity({scale:1, opacity:1}, 600, Ease.EaseOutCubic);
      this._textA.velocity("stop").velocity({translateX:0, opacity:1}, {delay:500, duration:500, easing:Ease.EaseOut});
      this._textB.velocity("stop").velocity({translateX:0, opacity:1}, {delay:600, duration:500, easing:Ease.EaseOut});
      this._swing.velocity("stop").velocity({scale:1, opacity:1}, {delay:400, duration:500, easing:Ease.EaseOut});
      this._leftSwing.velocity("stop").velocity({translateX:0, opacity:1}, {delay:500, duration:600, easing:Ease.EaseOut});
      this._rightSwing.velocity("stop").velocity({translateX:0, opacity:1}, {delay:500, duration:600, easing:Ease.EaseOut});
    }

    hide = ():void => {
      if (!this._isShow)  return;
      this._isShow = false;

      this._swingChair.hide();
      this._angleList.hide();

      var i:number = 0;
      for(i=0; i<this._titleSpan.length; i++) {
        this._titleSpan[i].velocity("stop").velocity({scale:2, opacity:0}, {delay:200 + 30*i, duration:500, easing:Ease.EaseOut});
      }
      this._title.velocity("stop").velocity({scale:0.5, opacity:0}, 600, Ease.EaseOutCubic);
      this._caption.velocity("stop").velocity({scale:0.5, opacity:0}, 600, Ease.EaseOutCubic);
      this._btn_material.velocity("stop").velocity({scale:0.5, opacity:0}, 600, Ease.EaseOutCubic);
      this._textA.velocity("stop").velocity({translateX:100, opacity:0}, {duration:500, easing:Ease.EaseOut});
      this._textB.velocity("stop").velocity({translateX:100, opacity:0}, {duration:500, easing:Ease.EaseOut});
      this._swing.velocity("stop").velocity({scale:2, opacity:0}, {duration:500, easing:Ease.EaseOut});
      this._leftSwing.velocity("stop").velocity({translateX:-200, opacity:0}, {duration:500, easing:Ease.EaseOut});
      this._rightSwing.velocity("stop").velocity({translateX:200, opacity:0}, {duration:500, easing:Ease.EaseOut});
    }

    openModal = ():void => {
      this.Dispatcher.trigger(Event.OPEN_MODAL);
    }
  }

  export class  SwingChair extends EventDispatcher {
    private _swingChair:any;
    private _currentAngle:number = 0;
    private _maxNumber:number = 0;

    private _isLeft:boolean = false;

    constructor() {
      super();
      this._swingChair = $('#swing_chair');
      this._swingChair.velocity({rotateZ:10}, 0);

    }

    doSwing = ():void => {
      var _gotoRotate:number = 0;
      this._isLeft = !this._isLeft;
      this._isLeft ? _gotoRotate = 1.5 :  _gotoRotate = -1.5;

      this._swingChair.velocity("stop").velocity({rotateZ:_gotoRotate}, 2000, 'easeInOutSine', this.doSwing);
    }

    show = ():void => {
      this.doSwing();
    }

    hide = ():void => {
      this._swingChair.velocity("stop");
    }
  }

  export class AngleList extends EventDispatcher {
    private _isShow:boolean = false;
    private _currentNum:number = 0;
    private _maxNumber:number = 0;
    private _list:any;
    private _angleArr:any = [];

    private _angleTimer:any;

    constructor() {
      super();
      this._list = $('#angle_list');
      var _self = this;
      this._list.find('li').each(function() {
        _self._angleArr.push($(this));
        $(this).css({opacity:0});
      });
      this._maxNumber = this._angleArr.length;
    }

    angleChange = ():void => {
      this._currentNum ++;
      if (this._currentNum >= this._maxNumber) {
        this._currentNum = 0;
      }
      this.doChange();
    }

    doChange = ():void => {
      var i:number = 0;

      for(i=0; i<this._maxNumber; i++) {
        var _gotoOpacity;
        i === this._currentNum ? _gotoOpacity = 1 : _gotoOpacity = 0;
        this._angleArr[i].velocity("stop").velocity({opacity:_gotoOpacity}, 2000, Ease.EaseOutCubic);
      }

      this._angleTimer = setTimeout(this.angleChange, 6000);
    }

    show = ():void => {
      this.doChange();
    }

    hide = ():void => {
      clearTimeout(this._angleTimer);
    }
  }

  export class Lineup extends EventDispatcher {
    private _myContents:string = CONTENTS.LINEUP;
    private _isShow:boolean = false;
    private _targets:any = [];
    private _currentIndex:number = 0;
    private _listItems:any = [];

    private _node:any;
    private _title:any;
    private _titleArr:any = [];
    private _caption:any;

    constructor() {
      super();
      var _self = this;
      var i:number = 0;

      this._node = $('#line_up');
      this._title = this._node.find('h3');
      this._caption = this._node.find('.catch');


      $('#lineup_view').find('li').each(function(i) {
        $(this).attr('data-index', i);
        _self._targets.push($(this));
      });


      for(i=0; i<this._targets.length; i++) {
        this._targets[i].hover(this.overHD, this.outHD);
        this._targets[i].bind('click', this.openDetail);
      }
      this.Dispatcher.bind(Event.CONTENTS_CHANGE, this.onContentsChange);
    }

    openDetail = (e):void => {
      ModalLineup.CHOOSE_NUM = Number($(e.currentTarget).attr('data-index'));
      ModalLineup.CHOOSE_IMAGE = e.currentTarget.getElementsByTagName("img")[0].getAttribute("src").replace(".jpg", "l.jpg");
      ModalLineup.SHOP_URL = e.currentTarget.dataset.url;
      this.Dispatcher.trigger(Event.OPEN_LINEUP);
    }

    onContentsChange = ():void => {
      Main.CURRENT_CONTENTS === this._myContents ? this.show() : this.hide();
    }

    show = ():void => {
      if (this._isShow) return;
      this._isShow = true;

      var i:number = 0;
      for(i=0; i<this._targets.length; i++) {
        this._targets[i].velocity('stop').velocity({scale:1, opacity:1}, {duration:300, delay:500+100*i, easing:Ease.EaseOutCubic});
      }

      this._title.velocity('stop').velocity({scale:1, opacity:1}, {duration:600, delay:500});
      this._caption.velocity('stop').velocity({scale:1, opacity:1}, {duration:600, delay:500});
    }


    hide = ():void => {
      if (!this._isShow)  return;
      this._isShow = false;

      var i:number = 0;
      for(i=0; i<this._targets.length; i++) {
        this._targets[i].velocity('stop').velocity({scale:0.5, opacity:0}, {duration:300, easing:Ease.EaseOutCubic});
      }

      this._title.velocity('stop').velocity({scale:1.2, opacity:0}, {duration:600});
      this._caption.velocity('stop').velocity({scale:1.2, opacity:0}, {duration:600});
    }

    overHD = (e):void => {
      var _target = $(e.currentTarget);
      this._currentIndex = Number(_target.attr('data-index'));
      this.expand();
    }

    outHD = (e):void => {
      var _target = $(e.currentTarget);
      this._currentIndex = -1;
      this.default();
    }

    expand = ():void => {
      var i:number = 0;
      for(i=0; i<this._targets.length; i++) {
        if (i === this._currentIndex) {
          this._targets[i].removeClass('other').find('img').css({filter:'none'}).velocity("stop").velocity({scale:1.05, opacity:1}, 400, Ease.EaseOut);
        } else {
          this._targets[i].addClass('other').find('img').css({filter:'gray'}).velocity("stop").velocity({scale:0.9, opacity:0.8}, 400, Ease.EaseOut);
        }
      }
    }

    default = ():void => {
      var i:number = 0;
      for(i=0; i<this._targets.length; i++) {
        this._targets[i].removeClass('other').find('img').css({filter:'none'}).velocity("stop").velocity({opacity:1, scale:1}, 400, Ease.EaseOut);
      }
    }
  }

  export class News extends EventDispatcher {
    private _myContents:string = CONTENTS.NEWS;
    private _node:any;
    private _slide:any;

    private _maxNews:number;
    private _currentNews:number;

    private _newsView:any;
    private _newsList:any;
    private _newsElem:any = [];

    private _btnPrev:any;
    private _btnNext:any;


    private _offsetCount:number = 0;
    private _offsetX:number;

    constructor() {
      super();
      var _self = this;
      this._node = $('#news');

      this._newsList = $('#news_list');
      this._newsView = $('#news_view');
      this._slide = $('#news_slide');

      this._btnPrev = $('#news_prev');
      this._btnNext = $('#news_next')

      var _height = 0;

      this._newsList.find('li').each(function(i) {
        $(this).attr('data-count', i);
        _height = Math.max($(this).outerHeight(), _height);
      });
      this._maxNews = this._newsList.find('li').length;
      this._currentNews = 0;

      //-  makeDummy
      var _forDummyL = this._newsList.clone();
      var _forDummyR = this._newsList.clone();
      this._newsView.append(_forDummyL);
      this._newsView.append(_forDummyR);


      var _refW = 680 * this._maxNews - 40;
      this._offsetX = -_refW;

      this._newsList.css({width:_refW});
      this._newsView.css({width:_refW*3 + 80, 'margin-left':this._offsetX});


      this._newsView.find('li').each(function() {
        _self._newsElem.push($(this));
      })

      this._btnPrev.bind('click', this.prevHD);
      this._btnNext.bind('click', this.nextHD);
      this.moveNews();
    }

    btnReset = ():void => {
      this._btnPrev.show();
      this._btnNext.show();
    }

    prevHD = ():void => {
      this._currentNews --;
      if (this._currentNews < 0) {
        this._currentNews = this._maxNews-1;
        var _x:any = this.getCurrent();
        _x += this._offsetX;
        this._newsView.css({'margin-left':  _x});
      }

      this.moveNews();
    }

    nextHD = ():void => {
      this._currentNews ++;

      if (this._currentNews >= this._maxNews) {
        this._currentNews = 0;
        var _x:any = this.getCurrent();
        _x -= this._offsetX;
        this._newsView.css({'margin-left':  _x});
      }

      this.moveNews();
    }

    getCurrent = ():number => {
      return Number(this._newsView.css('margin-left').replace('px', ''));
    }

    moveNews = ():void => {
      var _gotoX = this._offsetX + (-680 * this._currentNews) - 40;
      this._newsView.velocity('stop').velocity({'margin-left':_gotoX}, 500, Ease.EaseOut);


      var i:number = 0;
      for (i=0; i<this._newsElem.length; i++) {
        var _gotoOpacity = Number(this._newsElem[i].attr('data-count')) === this._currentNews ? 1 : 0.5;
        var _gotoScale = Number(this._newsElem[i].attr('data-count')) === this._currentNews ? 1 : 0.8;
        this._newsElem[i].velocity("stop").velocity({scale:_gotoScale, opacity:_gotoOpacity}, 500, Ease.EaseOutCubic);
      }
    }
  }

  export class Japan extends EventDispatcher {
    public static MODE:number = 0;
    private _myContents:string = CONTENTS.JAPAN;
    private _node:any;
    private _japanMap:any;
    private _japanContents:any;
    private _japanCaption:any;
    private _japanCaption_dummy:any;
    private _particleContaienr:any;
    private _refCanvas:any;
    private _refArr:any = [];
    private _prevHeight:number = 0;
    private _prevMode:number = 0;

    //- . . . . . . . . . . . . . . .  . . . PIXI <
    private _stage:any;
    private _renderer:any;

    private _particles:any = [];
    private _width:number = 640;
    private _height:number = 480;
    private _isWebGL:boolean = false;
    private _baseX:number = 0;
    private _center:any = {x:0, y:0};

    private _needsScroll:number = 0;

    private _deg:number = 0;

    private _isFix:boolean = false;
    private _isAbs:boolean = false;

    private _sectionPos:any = [];
    private _renderingTimer:any;
    private _isShow:boolean;

    constructor() {
      super();
      this._japanCaption = $('#japan_caption');
      this._japanCaption_dummy = $('#caption_dummy');
      this.getRefArr();
    }

    setUpJapanMap = ():void => {
      this._node = $('#japan');
      this._japanContents = $('#japan_contents');
      this._japanMap = $('#japan_map');

      PIXI.utils._saidHello = true;
      var rendererOptions = { antialias:false, resolution:1};

      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.indexOf('firefox') != -1) {
        this._renderer = new PIXI.CanvasRenderer(this._width, this._height, rendererOptions);
      } else {
        this._renderer = PIXI.autoDetectRenderer(this._width, this._height, rendererOptions);
      }
      this._renderer.backgroundColor = 0xffffff;

      document.getElementById('japan_map').appendChild(this._renderer.view);

      this._renderer.type === 1 ? this._isWebGL = true : this._isWebGL = false;
      this._stage = new PIXI.Container();
      this._particleContaienr = new PIXI.ParticleContainer(200000, {scale:true, alpha:true});
      this._stage.addChild(this._particleContaienr);

      this.Dispatcher.bind('scroll', this.onScrollHD).trigger('scroll');
      this.Dispatcher.bind('resize', _.debounce(this.onResizeHD, 150)).trigger('resize');

      this.addParticles();
      this._renderer.resize(this.Dispatcher.width(), 1050);
      this._renderer.render(this._stage);
    }

    onScrollHD = ():void => {
      if (!Main.getVisible(this._node)) {
        this.hide();
        return;
      }
      this.carc();
      this.show();
    }

    carc = ():void => {
      var _top = this.Dispatcher.scrollTop();
      var _center = _top + this.Dispatcher.height()/2;

      //-  down
      this._japanCaption.removeClass('active').removeClass('fix');
      this._japanCaption_dummy.removeClass('active').removeClass('fix');

      if (_center >= this._japanContents.offset().top + 140) {
        this._japanCaption.addClass('active');
        this._japanCaption_dummy.addClass('active');
      } else if (_center >= this._node.offset().top + 140) {
        this._japanCaption.removeClass('active').addClass('fix');
        this._japanCaption_dummy.removeClass('active');
      }
      if (this._prevMode === 2) {
        var _bottom = this.Dispatcher.scrollTop() + this.Dispatcher.height() - 700;
        var _contentsBottom = $('#japan').offset().top + $('#japan').outerHeight();
        var _ratio = Math.min(_bottom /_contentsBottom, 1);

        this._japanMap.css({bottom:700*(1-_ratio)});
      }

      if (_top > this._japanContents.offset().top - 700) {
        if (this._prevMode === 2) return;
        this._prevMode = 2;
        Japan.MODE = 2;
        this._japanMap.removeClass('fix').addClass('abs');
      } else if (_top > this._node.offset().top) {
        if (this._prevMode === 1) return;
        this._prevMode = 1;
        Japan.MODE = 1;
        this._japanMap.removeClass('abs').addClass('fix');
      } else {
        if (this._prevMode === 0) return;
        this._prevMode = 0;
        Japan.MODE = 0;
        this._japanMap.removeClass('abs').removeClass('fix');
      }


    }

    stateChange = (_num:number):void => {
      Japan.MODE = _num;
    }

    show = ():void => {
      if (this._isShow) return;
      this._isShow = true;
      this._renderer.render(this._stage);
      this._renderingTimer = window.requestAnimFrame(this.rendering);
      this.Dispatcher.trigger('resize');
    }

    hide = ():void => {
      if (!this._isShow)  return;
      this._isShow = false;

      this._japanCaption.removeClass('active').removeClass('fix');
      this._japanCaption_dummy.removeClass('active').removeClass('fix');

      window.cancelAnimFrame(this._renderingTimer);

      this._japanMap.removeClass('fix');
      this._japanMap.removeClass('abs');
    }

    rendering = ():void => {
      this._deg +=2;
      if (this._deg >= 360) this._deg = 0;

      var i = 0;
      for(i=0; i<this._particles.length; i++) {
        this._particles[i].update(this._baseX, this._center, this._deg);
      }

      this._renderer.render(this._stage);
      this._renderingTimer = window.requestAnimFrame(this.rendering);
    }

    onResizeHD = ():void => {
      this._prevHeight = this.Dispatcher.height()*3;
      this._node.css({height:this._prevHeight});
      this._baseX = (this.Dispatcher.width() - 876)/2;
      this._center.x = this.Dispatcher.width()/2;
      this._center.y = this.Dispatcher.height()/2;
      this.Dispatcher.trigger(Event.JAPAN_CAPTURE);

      var _gotoH = this.Dispatcher.height();
      _gotoH = Math.max(_gotoH, 1050);
      this._japanMap.css({height:_gotoH});
      if (this._renderer) this._renderer.resize(this.Dispatcher.width(), _gotoH);
    }

    addParticles = ():void => {
      var _x = 0;
      var _y = 0;
      var i = 0;

      var _max = 0;
      var _count = 0;

      for(_y = 0; _y < this._refArr.length; _y++) {
        for(_x=0; _x<this._refArr[_y].length; _x++) {
          if (this._refArr[_y][_x] == 255) {
            var _particle = new JapanParticle(_y, _x, this._isWebGL);
            this._particles.push(_particle);
            this._particleContaienr.addChild(_particle);
            _max ++;
          }
        }
      }

      var _span = 360/_max;
      var _randDeg = [];
      for (i=0; i<_max; i++) {
        _randDeg.push(_span * i);
      }
      this.shuffle(_randDeg);

      for (i=0; i<_max; i++) {
        this._particles[i].setDeg(_randDeg[i]);
      }
    }

    shuffle = (array):any => {
      var n = array.length, t, i;
      while (n) {
        i = Math.floor(Math.random() * n--);
        t = array[n];
        array[n] = array[i];
        array[i] = t;
      }
      return array;
    }

    getRefArr = ():void => {
      var _self = this;
      this._refCanvas = document.createElement("CANVAS");
      var _context = this._refCanvas.getContext("2d");

      var _image = new Image();
      _image.onload = function() {
        _self._refCanvas.width = _image.width;
        _self._refCanvas.height = _image.height;
        _context.drawImage(_image, 0, 0);

        var _xMax = _self._refCanvas.width;
        var _yMax = _self._refCanvas.height;


        var _loopMax = _xMax * _yMax;

        var _xCount = 0;
        var _yCount = 0;
        var i = 0;

        var returnArr = [];

        for(i=0; i<_loopMax; i++) {
          if (!returnArr[_xCount]) returnArr[_xCount] = [];

          returnArr[_xCount][_yCount] = _context.getImageData(_xCount, _yCount, 1, 1).data[2];
          _xCount ++;
          if (_xCount >= _xMax) {
            _xCount = 0;
            _yCount ++;
          }
        }
        _self._refArr = returnArr;
        _self.setUpJapanMap();
      }
      _image.src = 'img/carc_map.png';
    }
  }

  export class JapanParticle extends PIXI.Sprite {
    private _deg:number = 0;
    private _gotoX:number = 0;
    private _gotoY:number = 0;
    private _gotoAlpha:number = 1;

    private _xSpd:number = 1;
    private _ySpd:number = 1;
    private _scale:number = 1;
    private _rad:number = Math.PI/180;
    private _r:number = 0;

    private _degRatio:number;
    private _ease:number;

    constructor(public _x:number, public _y:number, public _isWebGL:boolean) {
      super(PIXI.Texture.fromImage('img/particle.png'));

      this._gotoX = Math.random() * $(window).width();
      this._gotoY = Math.random() * $(window).height();

      this.x = this._gotoX;
      this.y = this._gotoY;

      this.scale.set(this._scale);

      this._xSpd = -2 + Math.random() * 4;
      this._ySpd = -2 + Math.random() * 4;
      this._r = 300 + Math.random() * 15;

      this._degRatio = 0.1 + Math.random()*0.5;
      this._ease = 8 + Math.random()*8;
    }

    setDeg = (_deg:number):void => {
      this._deg = _deg;
    }

    update = (_baseX:number, _center:any, _deg:number):void => {
      switch (Japan.MODE) {
        case 0  : //rand
          this._gotoAlpha = 0.2;
          this._gotoX += this._xSpd;
          this._gotoY += this._ySpd;
          if (this._gotoX > $(window).width())  this._xSpd = -this._xSpd;
          if (this._gotoX < 0) this._xSpd = -this._xSpd;
          if (this._gotoY > $(window).height()) this._ySpd = -this._ySpd;
          if (this._gotoY < 0) this._ySpd = -this._ySpd;

          this._scale += (5 - this._scale)/5;
        break;
        case 1 : //circle
          this._gotoAlpha = 1;
          this._scale += (0.5 - this._scale)/this._ease;
          this._gotoX = Math.round(_center.x + this._r * Math.sin((_deg + this._deg) * this._rad));
          this._gotoY = Math.round(_center.y + this._r * Math.cos((_deg + this._deg) * this._rad));
        break;
        case 2 : //japan
          this._gotoAlpha = 1;
          this._gotoX = this._x * 13 + _baseX;
          this._gotoY = this._y * 13 + 10 - 50;
          this._scale += (1 - this._scale)/10;
        break;
      }

      if (Japan.MODE != 0) {
        this.x += (this._gotoX - this.x)/this._ease;
        this.y += (this._gotoY - this.y)/this._ease;
      } else {
        this.x = this._gotoX;
        this.y = this._gotoY;
      }

      this.alpha += (this._gotoAlpha - this.alpha)/5;
      this.scale.x = this.scale.y = this._scale;
    }
  }

  export class Quality extends EventDispatcher {
    private _myContents:string = CONTENTS.QUALITY;
    private _isShow:boolean = false;

    private _node:any;
    private _carcTargets:any = [];
    private _quality_view:any;

    //-  pixi
    private _width:number = 640;
    private _height:number = 480;
    private _isWebGL:boolean = false;
    private _target:any;
    private _stage:any;
    private _renderer:any;
    private _qPoints:any = [];
    private _container:any;

    private _emitters:any = [];

    private _currentStep:number = 0;
    private _centerX:number = 0;

    //-  elem
    private _qualityElem:any = [];
    private _qualityTitle:any;

    private _renderingTimer:any;


    private rightImg:any;
    private leftImg:any;

    constructor() {
      super();
      var _self = this;
      this._node = $('#quality');
      this._quality_view = $('#quality_view');
      this._qualityTitle = $('#quality_title');

      this.stageInit();

      this._quality_view.find('.quality_obj').each(function() {
        _self._qualityElem.push(new QualityElem($(this)));
      });
    }

    stageInit = ():void => {
      PIXI.utils._saidHello = true;
      this._target = 'quality_bg';

      var rendererOptions = { antialias:true };
      this._renderer = new PIXI.CanvasRenderer(this._width, this._height);
      this._renderer.backgroundColor = 0xf3f0eb;
      document.getElementById(this._target).appendChild(this._renderer.view);

      this._renderer.type === 1 ? this._isWebGL = true : this._isWebGL = false;

      this._stage = new PIXI.Container();
      this._container = new PIXI.Graphics();


      this.leftImg = PIXI.Sprite.fromImage('img/bg_quality_l.png');
      this.rightImg = PIXI.Sprite.fromImage('img/bg_quality_r.png');
      this._stage.addChild(this.leftImg);
      this._stage.addChild(this.rightImg);
      this._stage.addChild(this._container);

      this._qPoints.push(new QualityPoints(-426, 219));
      this._qPoints.push(new QualityPoints(49, 369));
      this._qPoints.push(new QualityPoints(469, 769));
      this._qPoints.push(new QualityPoints(58, 985));
      this._qPoints.push(new QualityPoints(-360, 1286));

      var i:number = 0;
      for (i=0; i<this._qPoints.length; i++) {
        this._container.addChild(this._qPoints[i]);
      }
      for (i=0; i<5; i++) {
        this._emitters.push(new QualityEmitter());
      }

      this._renderer.resize(this.Dispatcher.width(), 1615);
      this._renderer.render(this._stage);
      this.Dispatcher.bind('scroll', this.onContentsChange);
    }

    onContentsChange = ():void => {
      var _show = Main.getVisible(this._node);
      _show ? this.show() : this.hide();
    }

    show = ():void => {
      if (this._isShow)  return;
      this._isShow = true;
      this._renderingTimer = window.requestAnimFrame(this.rendering);

      this._qualityTitle.velocity("stop").velocity({scale:0.6, opacity:0}, {duration:0, delay:0, easing:Ease.EaseOut})
      .velocity({scale:1, opacity:1}, {duration:600, delay:0, easing:Ease.EaseOut});

      this.Dispatcher.bind('resize', _.debounce(this.onResizeHD, 150)).trigger('resize');
      this.Dispatcher.bind('scroll', this.onScrollHD).trigger('scroll');
    }

    onResizeHD = ():void => {
      this._centerX = this.Dispatcher.width()/2;
      this._renderer.resize(this.Dispatcher.width(), 1615);

      this.rightImg.x = this.Dispatcher.width() - this.rightImg.width;
      this.leftImg.y = 650;
    }

    hide = ():void => {
      if (!this._isShow) return;
      this._isShow = false;

      window.cancelAnimFrame(this._renderingTimer);
      this._qualityTitle.velocity({scale:0.6, opacity:0}, {duration:600, delay:0, easing:Ease.EaseOut});

      this.Dispatcher.unbind('resize', _.debounce(this.onResizeHD, 150));
      this.Dispatcher.unbind('scroll', this.onScrollHD);
    }

    onScrollHD = ():void => {
      var _top = this.Dispatcher.scrollTop() - this._node.offset().top;
      var _center = _top + this.Dispatcher.height()/2;

      var i:number = 0;
      var _refStep:number = -1;
      for (i=this._qPoints.length-1; i>= 0; i--) {
        if (_center >= this._qPoints[i].y) {
          _refStep = i;
          break;
        }
      }

      if (this._currentStep === _refStep)  return;
      this._currentStep = _refStep;
      this.stepChange();
    }

    stepChange = ():void => {
      var i:number = 0;

      for (i=0; i<this._qualityElem.length; i++) {
        if (i <= this._currentStep){
          this._qualityElem[i].show();
        } else {
          this._qualityElem[i].hide();
        }
      }
    }

    rendering = ():void => {
      var i:number = 0;

      for (i=0; i<this._emitters.length; i++) {
        var _targetNum = this._currentStep;

        if (_targetNum > i) _targetNum = i;
        if (_targetNum < 0) _targetNum = 0;

        var _gotoX = this._qPoints[_targetNum].x;
        var _gotoY = this._qPoints[_targetNum].y;

        this._emitters[i].x += (_gotoX - this._emitters[i].x)/5;
        this._emitters[i].y += (_gotoY - this._emitters[i].y)/5;
      }

      this._container.clear();
      this._container.lineStyle(1, 0xaea994, 1);
      this._container.moveTo(this._emitters[0].x, this._emitters[0].y);

      for (i=0; i<this._emitters.length; i++) {
        this._container.lineTo(this._emitters[i].x, this._emitters[i].y);
      }
      this._container.currentPath.shape.closed = false;
      this._container.endFill();

      for (i=0; i<this._qPoints.length; i++) {
        this._qPoints[i].update(this._centerX);
      }
      this._renderer.render(this._stage);
      this._renderingTimer = window.requestAnimFrame(this.rendering);
    }
  }

  export class QualityEmitter {
    public x:number = 0;
    public y:number = 0;
  }

  export class QualityElem extends EventDispatcher {
    private _title:any;
    private _caption:any;
    private _image:any;
    private _description:any;
    private _isShow:boolean = false;

    constructor(public _target:any) {
      super();

      var _self = this;
      this._title       = this._target.find('dt');
      this._caption     = this._target.find('.caption');
      this._image       = this._target.find('.image');
      this._description = this._target.find('.text');

      var i:number = 0;

      this._caption.velocity({scale:1.2, opacity:0}, 0);
      this._image.velocity({scale:0.9, opacity:0}, 0);
      this._description.velocity({translateY:50, opacity:0}, 0);
    }

    show = ():void => {
      this._title.velocity("stop").velocity({scale:1, opacity:1}, {duration:500, delay:0, easing:Ease.EaseOut});
      this._caption.velocity("stop").velocity({opacity:1, scale:1}, {delay:100, duration:500, easing:Ease.EaseOutCubic});
      this._image.velocity("stop").velocity({opacity:1, scale:1, translateY:0}, {delay:100, duration:500, easing:Ease.EaseOut});
      this._description.velocity("stop").velocity({opacity:1, translateY:0}, {delay:300, duration:500, easing:Ease.EaseOutCubic});
    }

    hide = ():void => {
      this._title.velocity("stop").velocity({scale:1.2, opacity:0}, {duration:500, delay:0, easing:Ease.EaseOut});
      this._caption.velocity("stop").velocity({opacity:0, scale:1.2}, {delay:0, duration:300, easing:Ease.EaseOutCubic});
      this._image.velocity("stop").velocity({opacity:0, scale:0.9, translateY:100}, {delay:0, duration:300, easing:Ease.EaseOutCubic});
      this._description.velocity("stop").velocity({opacity:0, translateY:-30}, {delay:0, duration:300, easing:Ease.EaseOutCubic});
    }
  }

  export class QualityPoints extends PIXI.Graphics {
    constructor(public _x:number, public _y:number) {
      super();
      this.beginFill(0xdcc259, 1);
      this.drawCircle(0, 0, 4);
      this.endFill();
    }

    update = (_centerX:number):void => {
      this.x = _centerX + this._x;
      this.y = this._y;
    }
  }


  //- -----------------------------------------------------------  <
  export class Scenes extends EventDispatcher {
    private _isShow:boolean = false;

    private _node:any;
    private _myContents:string = CONTENTS.SCENE;
    private _scenes:any = [];
    private _sceneElements:any = [];

    constructor() {
      super();
      var _self = this;

      this._node = $('#scene_container');
      this._node.find('.scene_elem').each(function() {
        _self._scenes.push($(this));
      });

      var i:number = 0;
      for(i=0; i<this._scenes.length; i++) {
        this._sceneElements.push(new SceneElem(this._scenes[i]));
      }

      this.Dispatcher.bind('scroll', this.onContentsChange).trigger('scroll');
    }

    onContentsChange = ():void => {
      var _show = Main.getVisible(this._node);

      _show ? this.show() : this.hide();
    }

    show = ():void => {
      if (this._isShow) return;
      this._isShow = true;

      this.Dispatcher.bind('resize', _.debounce(this.onResizeHD, 150)).trigger('resize');
      this.Dispatcher.bind('scroll', this.onScrollHD).trigger('scroll');
    }

    hide = ():void => {
      if (!this._isShow)  return;
      this._isShow = false;

      this.Dispatcher.unbind('resize', this.onResizeHD);
      this.Dispatcher.unbind('scroll', this.onScrollHD);
    }

    onScrollHD = ():void => {
      var i:number = 0;
      var _top = this.Dispatcher.scrollTop();

      for(i=0; i<this._sceneElements.length; i++) {
        this._sceneElements[i].update(_top);
      }
    }

    onResizeHD = ():void => {
      var i:number = 0;
      var _width:number = this.Dispatcher.width();
      var _height:number = this.Dispatcher.height();


      for(i=0; i<this._sceneElements.length; i++) {
        this._sceneElements[i].calc(_width, _height);
      }

      this.onScrollHD();
    }
  }

  export class SceneElem extends EventDispatcher {
    private _bg:any;
    private _subPanel:any;

    private _baseSize    :any    = {width:1500, height:935};
    private _overHeight  :number = 0;
    private _corePosition:number = 0;
    private _needsHeight :number = 0;
    private _panelArea:number = 0;

    private _isShow:boolean = false;
    private _title:any;
    private _photo:any;
    private _text:any

    constructor(public _node:any) {
      super();
      this._bg = this._node.find('.background');
      this._subPanel = this._node.find('.sub_panel');

      this._title = this._subPanel.find('dt');
      this._photo = this._subPanel.find('.image');
      this._text = this._subPanel.find('.text');

      this._title.velocity("stop").velocity({translateY:100, opacity:0}, {duration:0, delay:0, easing:Ease.EaseOut});
      this._photo.velocity("stop").velocity({translateY:100, opacity:0}, {duration:0, delay:0, easing:Ease.EaseOut});
      this._text.velocity("stop").velocity({translateY:100, opacity:0}, {duration:0, delay:0, easing:Ease.EaseOut});
    }

    calc = (_width:number, _height:number):void => {
      this._corePosition = this._node.offset().top;

      //-  bg
      var _bgHeight = _height;
      var _gotoHeight = _height;
      var _gotoWidth = this._baseSize.width * _bgHeight/this._baseSize.height;
      var _x = (_width - _gotoWidth)/2;
      _x = 0;
      var _y = 0;

      this._bg.css({width:'100%', height:'100%', left:_x});
      this._node.css({height:_gotoHeight});

      this._overHeight = _bgHeight - _gotoHeight;
      this._needsHeight = this._overHeight + _height * 2;

      //-  panel
      this._panelArea = _gotoHeight - 100 - 100 - this._subPanel.outerHeight();
    }

    update = (_top:number):void => {
      var _show = Main.getVisible(this._node);


      var _refTop =  _top - this._corePosition + this.Dispatcher.height();
      var _currentPer = _refTop / this._needsHeight;
      _currentPer = Math.max(0, _currentPer);
      _currentPer = Math.min(1, _currentPer);

      var _bgGoto = -this._overHeight * _currentPer;
      this._bg.css({top:_bgGoto});

      _show ? this.show() : this.hide();

      // this._subPanel.css({top: 100+ this._panelArea * _currentPer});
    }

    show = ():void => {
      if (this._isShow) return;
      this._isShow = true;

      this._title.velocity("stop").velocity({translateY:0, opacity:1}, {duration:500, delay:300, easing:Ease.EaseOut});
      this._photo.velocity("stop").velocity({translateY:0, opacity:1}, {duration:500, delay:400, easing:Ease.EaseOut});
      this._text.velocity("stop").velocity({translateY:0, opacity:1}, {duration:500, delay:500, easing:Ease.EaseOut});
    }

    hide = ():void => {
      if (!this._isShow)  return;
      this._isShow = false;

      this._title.velocity("stop").velocity({translateY:100, opacity:0}, {duration:300, delay:0, easing:Ease.EaseOut});
      this._photo.velocity("stop").velocity({translateY:100, opacity:0}, {duration:300, delay:0, easing:Ease.EaseOut});
      this._text.velocity("stop").velocity({translateY:100, opacity:0}, {duration:300, delay:0, easing:Ease.EaseOut});
    }
  }

  //- -----------------------------------------------------------  < <
  export class Howto extends EventDispatcher {
    private _isShow:boolean = false;
    private _myContents:string = CONTENTS.HOWTO;

    private _node:any;
    private _howtoElements:any = [];
    private _photoElements:any = [];
    private _carcTimer:any
    private _btnHowtoBuild:any;
    private _title:any;
    private _titleSpan:any = [];

    constructor() {
      super();
      var _self = this;
      this._node = $('#howto');
      this._btnHowtoBuild = $('#btn_howto');

      $('.howto_elem').each(function() {
        _self._howtoElements.push(new HowtoElements($(this)));
      });

      $('.howto_photo').each(function(i) {
        if (i%2 === 0) {
          _self._photoElements.push(new HowtoPhoto($(this), 'up'));
        } else {
          _self._photoElements.push(new HowtoPhoto($(this)));
        }
      });

      this._title = this._node.find('h3');
      var _titleArr = this._title.text().split('');
      var _html = '';
      var i:number = 0;

      for (i=0; i<_titleArr.length; i++) {
        if (_titleArr[i] === ' ') _titleArr[i] = '&nbsp;';
        _html += '<span>' + _titleArr[i] + '</span>';
      }

      this._title.empty().append(_html);
      this._title.find('span').each(function() {
        _self._titleSpan.push($(this));
      });

      this.Dispatcher.bind('scroll', this.onScrollHD).trigger('scroll');
      this._btnHowtoBuild.bind('click', this.openHowto);
    }

    openHowto = ():void => {
      this.Dispatcher.trigger(Event.OPEN_HOWTO);
    }

    onContentsChange = ():void => {
      Main.CURRENT_CONTENTS === this._myContents ? this.show() : this.hide();
    }

    show = ():void => {
      if (this._isShow) return;
      this._isShow = true;

      this._carcTimer = window.requestAnimFrame(this.update);

      var i:number = 0;
      for(i=0; i<this._titleSpan.length; i++) {
        this._titleSpan[i].velocity('stop').velocity({scale:1, opacity:1}, {duration:500, delay:50*i, easing:Ease.EaseOut});
      }

      this.Dispatcher.bind('resize', _.debounce(this.onResizeHD, 150)).trigger('resize');
    }

    hide = ():void => {
      if (!this._isShow)  return;
      this._isShow = false;

      window.cancelAnimFrame(this._carcTimer);

      var i:number = 0;
      for(i=0; i<this._titleSpan.length; i++) {
        this._titleSpan[i].velocity('stop').velocity({scale:2, opacity:0}, {duration:500, delay:50*i, easing:Ease.EaseOut});
      }
    }

    onResizeHD = ():void => {
      var i:number = 0;
      for(i=0; i<this._howtoElements.length; i++) {
        this._howtoElements[i].carc();
      }
    }

    update = ():void => {
      var i:number = 0;
      for (i=0; i<this._photoElements.length; i++) {
        this._photoElements[i].rendering();
      }
      this._carcTimer = window.requestAnimFrame(this.update);
    }

    onScrollHD = ():void => {
      var _show = Main.getVisible(this._node);

      if (_show) {
        var _top = this.Dispatcher.scrollTop();
        var _center = _top + this.Dispatcher.height()/2 - this._node.offset().top;
        var _bottom = _top + this.Dispatcher.height();

        var i:number = 0;
        for(i=0; i<this._howtoElements.length; i++) {
          this._howtoElements[i].update(_bottom);
        }

        for(i=0; i<this._photoElements.length; i++) {
          this._photoElements[i].update(_center);
        }

        var _percentage = (_top - this._node.offset().top)/this._node.height();
        this._node.css({'background-position':'50% ' + (-500*_percentage) + 'px'});
      }

      _show ? this.show() : this.hide();
    }
  }

  export class HowtoPhoto extends EventDispatcher {
    private _view:any;
    private _corePosition:number = 0;
    private _gotoMargin:number = 0;
    private _currentY:number = 0;

    private _img:any;
    private _ovh:number = 0;
    private _isDown:boolean = false;

    private _imgGotoY:number = 0;
    private _currentImgY:number = 0;

    constructor(public _target:any, public _direction:string = '') {
      super();
      this._direction === 'up' ? this._isDown = false : this._isDown = true;

      this._img = this._target.find('img');
      this._view = $('#howto_view');

      this._corePosition = this._target.position().top;
    }

    rendering = ():void => {
      if (this._ovh === 0) {
        if (this._img.height()) {
          this._ovh = this._img.height() - this._target.height();
          if (this._isDown) this._img.css({position:'absolute', left:0, top:0});
          else this._img.css({position:'absolute', left:0, bottom:0});
        }
        return;
      }

      this._currentY += (this._gotoMargin - this._currentY)/5;
      this._target.css({'margin-top':this._currentY});

      this._currentImgY += (this._imgGotoY - this._currentImgY)/5;
      if (this._isDown) this._img.css({top:this._currentImgY});
      else this._img.css({bottom:this._currentImgY});
    }

    update = (_center:number):void => {
      var _diff = _center-this._corePosition;
      this._gotoMargin =  -_diff/5;

      var _percentage = _diff/this.Dispatcher.height();
      _percentage = Math.max(-1, _percentage);
      _percentage = Math.min(1, _percentage);
      _percentage *= -1;

      this._imgGotoY = this._ovh * _percentage;
    }
  }

  export class HowtoElements extends EventDispatcher {
    private _view:any;
    private _corePosition:number = 0;
    private _isShow:boolean = false;

    private _number:any;
    private _summary:any;
    private _summaryTexts:any = [];
    private _catch:any;
    private _catchTexts:any = [];

    constructor(public _target:any) {
      super();
      var _self = this;
      this._view = $('#howto_view');

      this._number = this._target.find('.number');
      this._summary = this._target.find('.summary');
      this._catch = this._target.find('.catch');

      this._number.css({opacity:0});

      var _texts = this._summary.text().split('');
      this._summary.empty();

      //-  summary
      var i:number = 0;
      var _html = '';

      for(i=0; i<_texts.length; i++) {
        if (_texts[i] === ' ') _texts[i] = '&nbsp;';
        _html += '<span>' + _texts[i] + '</span>';
      }
      this._summary.append(_html);
      this._summary.find('span').each(function() {
        _self._summaryTexts.push($(this));
        $(this).velocity({scale:5, opacity:0}, 0);
      });

      //-  catch
      this._catch.velocity({scale:0.5, opacity:0}, 0, Ease.EaseOut);
    }

    carc = ():void => {
      this._corePosition = this._target.offset().top;
    }

    update = (_bottom:number):void => {
      var _ratio = this._corePosition - _bottom;

      if (_ratio > 0) {
        this.hide();
        return;
      }

      if (_ratio < -(this.Dispatcher.height()-this.Dispatcher.height()/4)) {
        this.hide();
        return;
      } else if (_ratio < -this.Dispatcher.height()/4) {
        this.show();
        return;
      }
    }

    show = ():void => {
      if (this._isShow) return;
      this._isShow = true;

      this._number.velocity({opacity:0, scale:2}, 0)
      .velocity('stop')
      .velocity({scale:1, opacity:1}, 1000, Ease.EaseOutCubic);

      var i:number = 0;
      for(i=0; i<this._summaryTexts.length; i++) {
        this._summaryTexts[i].velocity('stop').velocity({scale:1, opacity:1}, {delay:80*i, duration:600, easing:Ease.EaseOut});
      }
      this._catch.velocity('stop').velocity({scale:1, opacity:1}, 1000, Ease.EaseOutCubic);
    }

    hide = ():void => {
      if (!this._isShow)  return;
      this._isShow = false;

      this._number.velocity('stop').velocity({scale:2, opacity:0}, 1000, Ease.EaseOutCubic);
      var i:number = 0;
      for(i=0; i<this._summaryTexts.length; i++) {
        this._summaryTexts[i].velocity('stop').velocity({scale:3, opacity:0}, {delay:80*i, duration:600, easing:Ease.EaseOut});
      }
      this._catch.velocity('stop').velocity({scale:0.5, opacity:0}, 1000, Ease.EaseOutCubic);
    }
  }

  export class ShowRoom extends EventDispatcher {
    private _myContents:any = CONTENTS.SHOW_ROOM;
    private _isShow:boolean = false;
    private _node:any;
    private _caption:any;
    private _subCaption:any;
    private _text:any;
    private _address:any;
    private _map:any;
    private _photo:any;

    constructor() {
      super();
      this._node       = $('#show_room');
      this._caption    = this._node.find('h3');
      this._subCaption = this._node.find('.catch');
      this._text       = this._node.find('.text');
      this._address    = this._node.find('.address');
      this._map        = this._node.find('.btn_map');
      this._photo      = this._node.find('.photo');

      this._caption.velocity('stop').velocity({letterSpacing:30, opacity:0}, {duration:0, easing:Ease.EaseOut});
      this._subCaption.velocity('stop').velocity({scale:1.2, opacity:0}, {duration:0, easing:Ease.EaseOut});
      this._text.velocity('stop').velocity({translateX:80, opacity:0}, {duration:0, easing:Ease.EaseOut});
      this._address.velocity('stop').velocity({translateX:80, opacity:0}, {duration:0, easing:Ease.EaseOut});
      this._map.velocity('stop').velocity({translateX:80, opacity:0}, {duration:0, easing:Ease.EaseOut});
      this._photo.velocity('stop').velocity({scale:0.5, opacity:0}, {duration:0, easing:Ease.EaseOut});

      this.Dispatcher.bind(Event.CONTENTS_CHANGE, this.onContentsChange);
    }

    onContentsChange = ():void => {
      this._myContents === Main.CURRENT_CONTENTS ? this.show() : this.hide();
    }

    show = ():void => {
      if (this._isShow) return;
      this._isShow = true;

      this._caption.velocity('stop').velocity({scale:1, opacity:1}, {duration:500, delay:500, easing:Ease.EaseOut});
      this._subCaption.velocity('stop').velocity({scale:1, opacity:1}, {duration:500, delay:600, easing:Ease.EaseOut});
      this._text.velocity('stop').velocity({translateX:0, opacity:1}, {duration:500, delay:700, easing:Ease.EaseOut});
      this._address.velocity('stop').velocity({translateX:0, opacity:1}, {duration:500, delay:800, easing:Ease.EaseOut});
      this._map.velocity('stop').velocity({translateX:0, opacity:1}, {duration:500, delay:900, easing:Ease.EaseOut});
      this._photo.velocity('stop').velocity({scale:1, opacity:1}, {duration:500, delay:500, easing:Ease.EaseOut});
    }

    hide = ():void => {
      if (!this._isShow) return;
      this._isShow = false;

      this._caption.velocity('stop').velocity({scale:1.2, opacity:0}, {duration:500, easing:Ease.EaseOut});
      this._subCaption.velocity('stop').velocity({scale:1.2, opacity:0}, {duration:500, easing:Ease.EaseOut});
      this._text.velocity('stop').velocity({translateX:80, opacity:0}, {duration:500, easing:Ease.EaseOut});
      this._address.velocity('stop').velocity({translateX:80, opacity:0}, {duration:500, easing:Ease.EaseOut});
      this._map.velocity('stop').velocity({translateX:80, opacity:0}, {duration:500, easing:Ease.EaseOut});
      this._photo.velocity('stop').velocity({scale:0.5, opacity:0}, {duration:500, easing:Ease.EaseOut});
    }
  }

  export class ModalColorList extends EventDispatcher {
    private _node:any;
    private _bg:any;
    private _btn_close:any
    private _inner:any;
    private _colorList:any = [];
    private _title:any;
    private _titleSpan:any = [];

    private _isOpen:boolean = false;

    constructor() {
      super();
      this._node = $('#modal_color_list');
      this._btn_close = $('#btn_modal_color_close');

      var _self = this;
      this._node.find('.colors').each(function() {
        _self._colorList.push($(this));
      });

      this._bg = this._node.find('.modal_bg');
      this._inner = this._node.find('.modal_inner');
      this._title = this._inner.find('.caption_area').find('h3');

      var _textArr = this._title.text().split('');
      var i:number = 0;

      var _html = '';
      for (i=0; i<_textArr.length; i++) {
        if (_textArr[i] == ' ') _textArr[i] = '&nbsp;';
        _html += '<span>' + _textArr[i] + '</span>';
      }

      this._title.empty().append(_html);
      this._title.find('span').each(function() {
        _self._titleSpan.push($(this));
      });

      this._node.find('.colors').each(function() {
        _self._colorList.push($(this));
        $(this).find('dt').velocity({scale:0, opacity:0}, 0);
        $(this).find('dd').velocity({translateY:50, opacity:0}, 0);
      });

      this._btn_close.bind('click', this.closeModal);
      this._bg.bind('click', this.closeModal);
      this.Dispatcher.bind(Event.OPEN_MODAL, this.openModal);
    }

    openModal = ():void => {
      if (this._isOpen) return;
      this._isOpen = true;
      var _top = this.Dispatcher.scrollTop();
      this._node.show();

      this._node.css({top:_top});
      this._bg.velocity("stop").velocity({opacity:0}, 0).velocity({opacity:1}, 300, Ease.EaseOut);
      this._inner.velocity("stop").velocity({scale:0.8 ,opacity:0}, 0).velocity({scale:1, opacity:1}, 300, Ease.EaseOut);
      this._btn_close.velocity('stop').velocity({scale:0}, 0, Ease.EaseOut).velocity({scale:1}, {duration:600, delay:600, easing:Ease.EaseOut});

      var i:number = 0;
      for(i=0; i<this._colorList.length; i++) {
        this._colorList[i].find('dt').velocity("stop").velocity({scale:1, opacity:1}, {delay:30*i, duration:300, easing:Ease.EaseOut});
        this._colorList[i].find('dd').velocity("stop").velocity({translateY:0, opacity:1}, {delay:10*i, duration:300, easing:Ease.EaseOut});
      }

      for (i=0; i<this._titleSpan.length; i++) {
        this._titleSpan[i].velocity("stop").velocity({rotateX:-90, scaleY:2, opacity:0}, 0).velocity({rotateX:0, scaleY:1, opacity:1}, {duration:600, delay:20*i, easing:Ease.EaseOutCubic});
      }

      // this.Dispatcher.bind('scroll', this.onScrollHD);
    }

    closeModal = ():void => {
      if (!this._isOpen) return;
      var _self = this;
      this._isOpen = false;
      this._bg.velocity({opacity:0}, 300, Ease.EaseOut);
      this._inner.velocity({scale:0.8, opacity:0}, 300, Ease.EaseOut, _self.closeComplete);

      var i:number = 0;
      for(i=0; i<this._colorList.length; i++) {
        this._colorList[i].find('dt').velocity("stop").velocity({scale:0, opacity:0}, {duration:300, easing:Ease.EaseOut});
        this._colorList[i].find('dd').velocity("stop").velocity({translateY:50, opacity:0}, {duration:300, easing:Ease.EaseOut});
      }
    }

    closeComplete = ():void => {
      this._node.hide();
    }
  }

  export class ModalHowto extends EventDispatcher {
    private _node:any;
    private _bg:any;
    private _btn_close:any
    private _inner:any;
    private _isOpen:boolean = false;
    private _view:any;


    constructor() {
      super();
      this._node = $('#modal_howto');
      this._btn_close = $('#btn_modal_howto_close');
      this._view = $('#modal_howto_view');

      var _self = this;

      this._bg = this._node.find('.modal_bg');
      this._inner = this._node.find('.modal_inner');

      this._btn_close.bind('click', this.closeModal);
      this._bg.bind('click', this.closeModal);
      this.Dispatcher.bind(Event.OPEN_HOWTO, this.openModal);
    }

    openModal = ():void => {

      if (this._isOpen) return;
      this._isOpen = true;
      var _top = this.Dispatcher.scrollTop();
      this._view.empty().append('<iframe width="560" height="315" src="https://www.youtube.com/embed/UQce4Fwqj4Q?rel=0&amp;showinfo=0&amp;autoplay=1" frameborder="0" allowfullscreen="">');


      this._node.show();

      this._node.css({top:_top});
      this._bg.velocity("stop").velocity({opacity:0}, 0).velocity({opacity:1}, 300, Ease.EaseOut);
      this._inner.velocity("stop").velocity({scale:0.8 ,opacity:0}, 0).velocity({scale:1, opacity:1}, 300, Ease.EaseOut);
      this._btn_close.velocity('stop').velocity({scale:1}, {duration:600, delay:600, easing:Ease.EaseOut});
    }

    closeModal = ():void => {
      if (!this._isOpen) return;
      var _self = this;
      this._isOpen = false;
      this._view.find('iframe').attr('src', '');
      this._bg.velocity({opacity:0}, 300, Ease.EaseOut);
      this._inner.velocity({scale:0.8, opacity:0}, 300, Ease.EaseOut, _self.closeComplete);
    }

    closeComplete = ():void => {
      this._node.hide();
    }
  }


  export class ModalLineup extends EventDispatcher {
    public static CHOOSE_NUM:number;
    public static CHOOSE_IMAGE:number;
    public static SHOP_URL:string;

    private _node:any;
    private _bg:any;
    private _btn_close:any
    private _inner:any;
    private _image:any;

    private _isOpen:boolean = false;

    constructor() {
      super();
      this._node = $('#modal_lineup_list');
      this._btn_close = $('#btn_modal_lineup_close');

      var _self = this;

      this._bg = this._node.find('.modal_bg');
      this._inner = this._node.find('.modal_inner');
      this._image = this._node.find('.image_area');

      this._btn_close.bind('click', this.closeModal);
      this._bg.bind('click', this.closeModal);
      this.Dispatcher.bind(Event.OPEN_LINEUP, this.openModal);
    }

    openModal = ():void => {
      if (this._isOpen) return;
      this._isOpen = true;
      var _top = this.Dispatcher.scrollTop();

      this._image.empty().append('<img src="' + ModalLineup.CHOOSE_IMAGE + '">');


      this._node.find('.item').each(function(i){
        i === ModalLineup.CHOOSE_NUM ? $(this).show() : $(this).hide();
      });

      var _link = ModalLineup.SHOP_URL;
      this._node.find('a').attr('href', _link);
      this._node.show();

      this._node.css({top:_top});
      this._bg.velocity("stop").velocity({opacity:0}, 0).velocity({opacity:1}, 300, Ease.EaseOut);
      this._inner.velocity("stop").velocity({scale:0.8 ,opacity:0}, 0).velocity({scale:1, opacity:1}, 300, Ease.EaseOut);
      this._btn_close.velocity('stop').velocity({scale:1}, {duration:600, delay:600, easing:Ease.EaseOut});
    }

    closeModal = ():void => {
      if (!this._isOpen) return;
      var _self = this;
      this._isOpen = false;
      this._bg.velocity({opacity:0}, 300, Ease.EaseOut);
      this._inner.velocity({scale:0.8, opacity:0}, 300, Ease.EaseOut, _self.closeComplete);
    }

    closeComplete = ():void => {
      this._node.hide();
    }
  }
}