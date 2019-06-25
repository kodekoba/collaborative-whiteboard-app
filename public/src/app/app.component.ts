import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { CanvasComponent } from './canvas/canvas.component';
import * as io from "socket.io-client";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{

    @ViewChild(CanvasComponent, {static:false})
    private canvasComponent : CanvasComponent;
  
    selectedColor = "";
    selectedSize = 20;
    bomb : any;
    title = 'public';
    constructor() {};

    socket = io('http:localhost:8000');
    
    ngAfterViewInit() {
      console.log(this.selectedColor);
    }

    ngOnInit(){
        this.socket.on("clear-board",function(){
            console.log("CLEARING ALL BOARDS")
            this.canvasComponent.redraw();
        }.bind(this))
    }
  
    update(jscolor) {
      console.log("tester", jscolor);
      this.selectedColor = jscolor;
      console.log(this.selectedColor);
    }
    microify() {
      this.selectedSize= 3;
    }
    smallify() {
      this.selectedSize = 6; 
    }
  
    medify() {
      this.selectedSize = 15;
    }
  
    bigify() {
      this.selectedSize = 40;
    }
  
    eraser() {
      this.selectedColor = "#FFFFFF"; 
      console.log(this.selectedColor);
    }
  
    draw(jscolor){
      this.selectedColor = jscolor;
      if(this.selectedColor == undefined) {
        this.selectedColor = "#000000"
      }
    }
  
    
  
    clear() {
        this.canvasComponent.redraw();
        console.log("After the redraw");
        this.socket.emit("clear");
        console.log("clear function called");
    }
  }
  
