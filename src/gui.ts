import { Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Control, Rectangle, StackPanel } from "@babylonjs/gui";

import { State } from "./global";

export interface IGUI {
  readonly transition: boolean;
}

export interface IGameGUI extends IGUI {
  readonly paused: boolean;
}

abstract class GUI implements IGUI {
  public get transition(): boolean {
    return this._transition;
  }

  protected _transition: boolean = false;
  
  constructor(protected _scene: Scene) {
    this._createMenu();
  }

  protected abstract _createMenu(): void;  
}

type MainMenuNextStateType = State.GAME | State.CHARACTERS;

interface IMainMenuGUI extends IGUI {
  readonly nextState: MainMenuNextStateType;
}

class MainMenuGUI extends GUI implements IMainMenuGUI {
  public get nextState(): MainMenuNextStateType {
    return this._nextState;
  }

  private _nextState: MainMenuNextStateType = State.GAME;
  constructor(scene: Scene) {
    super(scene);    
  }

  protected _createMenu(): void {
    const ui = AdvancedDynamicTexture.CreateFullscreenUI("ui");
    ui.idealHeight = 720;    

    const container = new Rectangle("container");
    container.height = "200px";
    container.width = "300px";
    container.thickness = 0;        
    container.cornerRadius = 50;    
    ui.addControl(container);

    const stackPanel = new StackPanel();    
    container.addControl(stackPanel);
    
    const quckPlayButton = Button.CreateSimpleButton("quickPlayButton", "QUICK PLAY");
    quckPlayButton.color = "white";         
    quckPlayButton.cornerRadius = 10;
    quckPlayButton.paddingBottom = 10;
    quckPlayButton.width = "200px";
    quckPlayButton.height = "60px";        
    quckPlayButton.hoverCursor = "pointer";
    quckPlayButton.thickness = 0.2;
    quckPlayButton.pointerEnterAnimation = function() {
        this.thickness = 0.4;
    };
    quckPlayButton.pointerOutAnimation = function() {
        this.thickness = 0.2;
    };
    quckPlayButton.onPointerClickObservable.add( () => {
      this._transition = true;
      this._nextState = State.GAME;

      this._scene.detachControl();
    } );
    stackPanel.addControl(quckPlayButton);

    const playButton = Button.CreateSimpleButton("playButton", "PLAY");
    playButton.color = "white";        
    playButton.hoverCursor = "pointer";
    playButton.paddingTop = 10;
    playButton.width = "200px";
    playButton.height = "60px";
    playButton.thickness = 0.2;        
    playButton.cornerRadius = 10;
    playButton.pointerEnterAnimation = function() {
        this.thickness = 0.4;
    };
    playButton.pointerOutAnimation = function() {
        this.thickness = 0.2;
    };
    playButton.onPointerClickObservable.add( () => {
      this._transition = true;
      this._nextState = State.CHARACTERS;

      this._scene.detachControl();
    } );
    stackPanel.addControl(playButton);
  }
}

class CharactersGUI extends GUI {
  constructor(scene: Scene) {
    super(scene);
  }

  protected _createMenu(): void {
    const ui = AdvancedDynamicTexture.CreateFullscreenUI("ui");
    ui.idealHeight = 720;    

    const container = new Rectangle("container");
    container.height = "200px";
    container.width = "300px";
    container.thickness = 0;        
    container.cornerRadius = 50;    
    ui.addControl(container);

    const stackPanel = new StackPanel();    
    container.addControl(stackPanel);
    
    const startButton = Button.CreateSimpleButton("start", "START");
    startButton.color = "white";         
    startButton.cornerRadius = 10;
    startButton.paddingBottom = 10;
    startButton.width = "200px";
    startButton.height = "60px";        
    startButton.hoverCursor = "pointer";
    startButton.thickness = 0.2;
    startButton.pointerEnterAnimation = function() {
        this.thickness = 0.4;
    };
    startButton.pointerOutAnimation = function() {
        this.thickness = 0.2;
    };
    startButton.onPointerClickObservable.add( () => {
      this._transition = true;

      this._scene.detachControl();
    } );
    stackPanel.addControl(startButton);
  }
}

class GameGUI extends GUI implements IGameGUI {
  public get paused(): boolean {
    return this._paused;
  }

  private _paused: boolean = false;  

  constructor(scene: Scene) {
    super(scene);
  }

  protected _createMenu(): void {
    const ui = AdvancedDynamicTexture.CreateFullscreenUI("ui");
    ui.idealHeight = 720;        
    
    const pauseMenu = new Rectangle();
    pauseMenu.height = "200px";
    pauseMenu.width = "300px";
    pauseMenu.thickness = 0;        
    pauseMenu.cornerRadius = 50;
    pauseMenu.isVisible = false;
    ui.addControl(pauseMenu);

    const handlePauseMenu = () => {          
      pauseMenu.isVisible = this._paused;    
    }

    const stackPanel = new StackPanel();    
    pauseMenu.addControl(stackPanel);
    
    const resumeButton = Button.CreateSimpleButton("resumeButton", "RESUME");
    resumeButton.color = "white";         
    resumeButton.cornerRadius = 10;
    resumeButton.paddingBottom = 10;
    resumeButton.width = "200px";
    resumeButton.height = "60px";        
    resumeButton.hoverCursor = "pointer";
    resumeButton.thickness = 0.2;
    resumeButton.pointerEnterAnimation = function() {
        this.thickness = 0.4;
    };
    resumeButton.pointerOutAnimation = function() {
        this.thickness = 0.2;
    };
    resumeButton.onPointerClickObservable.add( () => {
      this._paused = false;

      handlePauseMenu();
    } );
    stackPanel.addControl(resumeButton);

    const quitButton = Button.CreateSimpleButton("quitButton", "QUIT");
    quitButton.color = "white";        
    quitButton.hoverCursor = "pointer";
    quitButton.paddingTop = 10;
    quitButton.width = "200px";
    quitButton.height = "60px";
    quitButton.thickness = 0.2;        
    quitButton.cornerRadius = 10;
    quitButton.pointerEnterAnimation = function() {
        this.thickness = 0.4;
    };
    quitButton.pointerOutAnimation = function() {
        this.thickness = 0.2;
    };
    quitButton.onPointerClickObservable.add( () => {
      this._paused = false;      
      this._transition = true;
    } );
    stackPanel.addControl(quitButton);

    const pauseButton = Button.CreateSimpleButton("pauseButton", "PAUSE");
    pauseButton.color = "white";    
    pauseButton.thickness = 0;
    pauseButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    pauseButton.onPointerClickObservable.add( () => {
      this._paused = true;

      handlePauseMenu();
    } );
    //ui.addControl(pauseButton);

    window.addEventListener("keydown", event => {
      // Esc
      if (event.keyCode === 27) {
        this._paused = true;

        handlePauseMenu();
      }
    });
  }  
}

export class GUIFactory {
  public static mainMenuGUI(scene: Scene): IMainMenuGUI {
    return new MainMenuGUI(scene);
  }

  public static charactesGUI(scene: Scene): IGUI {
    return new CharactersGUI(scene);
  }

  public static gameGUI(scene: Scene): IGameGUI {
    return new GameGUI(scene);
  }
}