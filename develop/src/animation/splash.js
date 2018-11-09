import * as PIXI from 'pixi.js';
import SplashImage from './splashUtils/splashImage'
import SplashCatch from './splashUtils/splashCatch'
class splash  {
  constructor(){
    this._node = document.getElementsByClassName('background')[0];
    this._width = 640;
    this._height = 480;
    this._sceneCount = 0;
    this.current_scene = 0;
    this.move_pattern = 0;
    this.setupCanvas();

  }
  setupCanvas = () => {
    PIXI.utils._saidHello = true;

    let rendererOptions = {
      antialias:false
    }

    this._renderer = PIXI.autoDetectRenderer(this._width, this._height);
    this._renderer.backgroundColor = 0xffffff;
    this._stage = new PIXI.Container();
    this._node.appendChild(this._renderer.view);

    this._particleContainer = new PIXI.ParticleContainer();
    this._stage.addChild(this._particleContainer);
     // PIXI.Sprite(texture)
    this._logoSpr = new PIXI.Sprite(PIXI.Texture.fromImage('/img/splash/bg_splash.png'));
    this._stage.addChild(this._logoSpr);
    this._photo = [];
    this._catch = [];
    
    this._photo.push(new SplashImage('/img/splash/chair1.png', 2));
    this._photo.push(new SplashImage('/img/splash/chair2.png', 4));
    this._photo.push(new SplashImage('/img/splash/chair3.png', 6));


    this._catch.push(new SplashCatch('/img/splash/catch1.png', 1));
    this._catch.push(new SplashCatch('/img/splash/catch2.png', 3));
    this._catch.push(new SplashCatch('/img/splash/catch3.png', 5));
    for(let i=0; i<this._photo.length; i++) {
      this._stage.addChild(this._photo[i]);
    }

    // for(let i=0; i<this._catch.length; i++) {
    //   this._stage.addChild(this._catch[i]);
    // }

    this._renderer.render(this._stage);
    this.show();
  }

  onResizeHD = ():void => {
    this._renderer.view.style.width = window.innerWidth +'px';
    this._renderer.view.style.height = window.innerHeight +'px';
  }

  show = ():void => {
    if (this._isShow) return;
    this._isShow = true;
    this._renderingTimer = window.requestAnimationFrame(this.render);
  }

  render = ():void => {
    this._sceneCount ++;
    this._logoSpr.pivot = new PIXI.Point(this._logoSpr.width/2, this._logoSpr.height/2);
    this._logoSpr.x = window.innerWidth/2;
    this._logoSpr.y = window.innerHeight/2;
    
    if (this._sceneCount > 50) {
      this._sceneCount = 1;
      this.current_scene ++;
      if (this.current_scene > 6)  this.current_scene = 1;
      if (this.current_scene%2 === 1)  this.move_pattern ++;
      if (this.move_pattern > 4)  this.move_pattern = 1;

      
      //-  console.log('_sceneChange => ', this.current_scene, 'ptn =>', Splash.move_pattern);

     
    }

    //-  photo
    for(let i=0; i<this._photo.length; i++) {
      this._photo[i].onSceneChange(this.current_scene);
      this._photo[i].update(this.move_pattern);
    }

    

    

    if (this._renderer.width != window.innerWidth || this._renderer.height != window.innerHeight) {
      this._renderer.resize(window.innerWidth, window.innerHeight);
    }

    this._renderer.render(this._stage);
    this._renderingTimer = window.requestAnimationFrame(this.render);
  }
}

export default splash;

