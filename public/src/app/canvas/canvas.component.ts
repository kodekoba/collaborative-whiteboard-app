import {
    Component, Input, ElementRef, AfterViewInit, ViewChild, OnInit, HostListener
  } from '@angular/core';
  import { fromEvent } from 'rxjs';
  import { switchMap, takeUntil, pairwise } from 'rxjs/operators'
  import * as io from "socket.io-client";
// import { Socket } from 'dgram';
  
  @Component({
    selector: 'app-canvas',
    template: '<canvas #canvas></canvas>',
    styles: ['canvas { border: 1px solid #000; }']
  })
  export class CanvasComponent implements AfterViewInit,OnInit {
  
    @ViewChild('canvas', {static: true}) public canvas: ElementRef;
  
    @Input() public width = window.innerWidth * .85;
    @Input() public height = window.innerHeight * .6;
    
    @Input() markerColor: string;
    @Input() size : number;

    socket = io('http://localhost:8000');
  
    public cx: CanvasRenderingContext2D;




    public ngAfterViewInit() {
      const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
      this.cx = canvasEl.getContext('2d');
  
      canvasEl.width = this.width;
      canvasEl.height = this.height;
      canvasEl.style.margin = "50px";
      canvasEl.style.background = "white";

  
      this.cx.lineWidth = this.size;
      this.cx.lineCap = 'round';
      this.cx.strokeStyle = "#000000";
  
      this.captureEvents(canvasEl);


    }

    // @HostListener('window:resize')onResize(){
    //     const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    //     this.cx = canvasEl.getContext('2d');
        
    //     canvasEl.width = window.innerWidth * .8;
    //     canvasEl.height = window.innerHeight *.8;
    // }

    ngOnInit(){
        this.socket.on("draw-this",function(data){
            this.drawOnCanvas(data.prevPos,data.currentPos,data.color, data.size);
        }.bind(this))


        
    }


    
    private captureEvents(canvasEl: HTMLCanvasElement) {
      // this will capture all mousedown events from the canvas element
      fromEvent(canvasEl, 'touchstart')
        .pipe(
            switchMap((e) => {
                return fromEvent(canvasEl, 'touchmove')
                    .pipe(
                        takeUntil(fromEvent(canvasEl, 'touchend')),
                        pairwise()
                    )
            })
        )
        .subscribe((res: [TouchEvent, TouchEvent]) => {
            const rect = canvasEl.getBoundingClientRect();
    
            // previous and current position with the offset
            const prevPos = {
              x: res[0].touches[0].clientX - rect.left,
              y: res[0].touches[0].clientY - rect.top
            };
      
            const currentPos = {
              x: res[1].touches[0].clientX - rect.left,
              y: res[1].touches[0].clientY - rect.top
            };
      
            // this method we'll implement soon to do the actual drawing
            this.drawOnCanvas(prevPos, currentPos,this.markerColor, this.size);
            this.socket.emit("draw-coordinates",{prevPos: prevPos, currentPos: currentPos,color: this.markerColor, size: this.size});
  

        })

      fromEvent(canvasEl, 'mousedown')
        .pipe(
          switchMap((e) => {
            // after a mouse down, we'll record all mouse moves
            return fromEvent(canvasEl, 'mousemove')
              .pipe(
                // we'll stop (and unsubscribe) once the user releases the mouse
                // this will trigger a 'mouseup' event    
                takeUntil(fromEvent(canvasEl, 'mouseup')),
                // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
                takeUntil(fromEvent(canvasEl, 'mouseleave')),
                // pairwise lets us get the previous value to draw a line from
                // the previous point to the current point    
                pairwise()
              )
          })
        )
        .subscribe((res: [MouseEvent, MouseEvent]) => {
          const rect = canvasEl.getBoundingClientRect();
    
          // previous and current position with the offset
          const prevPos = {
            x: res[0].clientX - rect.left,
            y: res[0].clientY - rect.top
          };
    
          const currentPos = {
            x: res[1].clientX - rect.left,
            y: res[1].clientY - rect.top
          };
    
          // this method we'll implement soon to do the actual drawing
          this.drawOnCanvas(prevPos, currentPos,this.markerColor, this.size);
          this.socket.emit("draw-coordinates",{prevPos: prevPos, currentPos: currentPos,color: this.markerColor, size: this.size});

        });
    }
 

  
    private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }, color, size) {
        this.cx.strokeStyle = color;
        this.cx.lineWidth = size;
      if (!this.cx) { return; }
  
      this.cx.beginPath();
  
      if (prevPos) {
        this.cx.moveTo(prevPos.x, prevPos.y); // from
        this.cx.lineTo(currentPos.x, currentPos.y);
        this.cx.stroke();
      }

      this.cx.strokeStyle = this.markerColor;
    }

    public redraw() {
        console.log("Redrawing");
        this.cx.clearRect(0,0, this.width, this.height);
      }


  
  }
  