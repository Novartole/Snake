import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";

import { Engine, FreeCamera, Scene, Vector3 } from "@babylonjs/core";

import { GUIFactory } from "./gui";
import { State } from "./global";

export default class App {  
  private _engine: Engine;
  private _scene: Scene;  

  private _state: State | null = null;  

  private constructor() {
    const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
    this._engine = new Engine(canvas, true);
    this._scene = new Scene(this._engine);

    window.addEventListener("keydown", event => {
      // Shift + Ctrl + Alt + I
      if (event.shiftKey && event.ctrlKey && event.altKey && event.keyCode === 73) {
          if ( this._scene.debugLayer.isVisible() ) this._scene.debugLayer.hide();
          else this._scene.debugLayer.show();
      }
    });

    this._main();
  }

  public static initialize(): void { new App(); }

  private async _main(): Promise<void> {
    await this._loadMainMenuState();

    this._engine.runRenderLoop( () => {      
      switch (this._state) {
        case State.MAIN_MENU:
        case State.CHARACTERS:
        case State.GAME:
        case State.LOSE:
          this._scene.render();
          break;
      
        default: break;
      }
    });

    window.addEventListener( "resize", () => this._engine.resize() );
  }

  private async _loadMainMenuState(): Promise<void> {
    this._engine.displayLoadingUI();
    this._scene.detachControl();

    const scene = new Scene(this._engine),
          camera = new FreeCamera("camera", Vector3.Zero(), scene),
          gui = GUIFactory.mainMenuGUI(scene);
        
    scene.registerBeforeRender( () => {
      if (gui.transition) {
        switch (gui.nextState) {
          case State.GAME:
            this._loadGameState();
            break;

          case State.CHARACTERS:
            this._loadCharactersState();
            break;
        
          default: break;
        }             
      }
    } );
    
    await scene.whenReadyAsync();

    this._engine.hideLoadingUI();
    this._scene.dispose();
    this._scene = scene;

    this._state = State.MAIN_MENU;
  }

  private async _loadCharactersState(): Promise<void> {
    this._engine.displayLoadingUI();
    this._scene.detachControl();

    const scene = new Scene(this._engine),
          camera = new FreeCamera("camera", Vector3.Zero(), scene),
          gui = GUIFactory.charactesGUI(scene);
    
    scene.registerBeforeRender( () => {
      if (gui.transition) {
        this._loadGameState();        
      }
    } );

    await scene.whenReadyAsync();

    this._engine.hideLoadingUI();
    this._scene.dispose();
    this._scene = scene;

    this._state = State.CHARACTERS;
  }

  private async _loadGameState(): Promise<void> {
    this._engine.displayLoadingUI();

    const scene = new Scene(this._engine),
          camera = new FreeCamera("camera", Vector3.Zero(), scene),
          gui = GUIFactory.gameGUI(scene);
        
    scene.registerBeforeRender( () => {
      if (gui.transition) {
        this._loadMainMenuState();        
      }
    } );

    await scene.whenReadyAsync();
    
    this._engine.hideLoadingUI();
    this._scene.dispose();
    this._scene = scene;

    this._state = State.GAME;
  }  
}