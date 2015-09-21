///<reference path="../globals.ts" />
///<reference path="../os/canvastext.ts" />



/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "",
                    public lineHeight = _DefaultFontSize +_DrawingContext.fontDescent(currentFont, currentFontSize) +_FontHeightMargin) {
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();

        }

        private clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        private resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }


        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                } else
                    //up arrow functionality
                    if (chr == String.fromCharCode(38)) { //up key
                        console.log("up");
                        this.upKey(chr);
                    } else
                        //down arrow functionality
                        if (chr == String.fromCharCode(40)) { //down key
                            console.log("down");
                            this.downKey(chr);
                        } else
                            // backspace fucntionality
                            if (chr == String.fromCharCode(8)) { //backspace key
                                this.backSpace(chr);
                            } else
                                // tab fucntionality
                                if ((chr == String.fromCharCode(9)) && (this.buffer.length > 0)) { //tab key hit and something in buffer                    
                                   this.tabKey(chr);  
                                }

                                else {
                                    // This is a "normal" character, so ...
                                    // ... draw it on the screen...
                                    this.putText(chr);
                                    // ... and add it to our buffer.
                                    this.buffer += chr;             
                                    // TODO: Write a case for Ctrl-C.
                                }
            }
        }

     public tabKey(chr): void {
         var commands = _OsShell.commandList;
         //var firstChar = this.buffer.substring(0, 1);
         //console.log(firstChar);
         //console.log(commands[0].command);
         var numCommands = commands.length;
         var possibleCommands = [];
         // for (z = 0; (!(possibleCommands.length =0)); z++) {
         var bufferTargetChar = this.buffer.substring(0, 1);
         for (var i = 0; numCommands > i; i++) {

             if (bufferTargetChar == (commands[i].command.substring(0, 1))) {
                 //  console.log(commands[i].command);
                 // console.log(commands[i].command.substring(0, 1));
                 possibleCommands.push(commands[i]);
                 console.log(possibleCommands);
             }
             possibleCommands = possibleCommands;
              // };
         }
         console.log(possibleCommands);
         if (possibleCommands.length == 1) {
             var strCommand = possibleCommands[0].command;
             console.log(strCommand);

             console.log(possibleCommands[0].command);
             this.buffer = "";
             _DrawingContext.drawText(this.currentFont, this.currentFontSize,
                 CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, ">"), //TODO
                 this.currentYPosition, strCommand);
             this.buffer = strCommand;
         }
        }
        

            public backSpace(chr): void {
             
               //checks if cursor is off screen
                        if(this.currentXPosition>0){
                        //adds char to buffer
                        this.buffer += chr;
                         //records last char before enter is hit
                         var lastChar = this.buffer.substring(this.buffer.length-2, this.buffer.length-1);
                         //records that characters width
                         var lastCharWidth = CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, lastChar);
                         //clears rectangle of that character
                        _DrawingContext.clearRect(
                            this.currentXPosition - lastCharWidth,
                            this.currentYPosition + _FontHeightMargin - this.lineHeight,
                            lastCharWidth,
                            this.lineHeight);
                        //resets x position
                        this.currentXPosition = this.currentXPosition - lastCharWidth;
                       //removes last letter and backspace key from buffer
                        this.buffer=this.buffer.substring(0, this.buffer.length-2) ;
                        }
        }


  public upKey(chr): void {
      //checks to see if anything is in command histroy
      if (_OsShell.commandHistoryIndex > 0) {
          //measures buffer's width
          var bufferLength = CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, this.buffer);
          //clears rectangle of buffer length
          if (this.currentXPosition > 1 + CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, ">")) {
              _DrawingContext.clearRect(
                  this.currentXPosition - bufferLength,
                  this.currentYPosition + _FontHeightMargin - this.lineHeight,
                  bufferLength,
                  this.lineHeight);
              //resets x position
              this.currentXPosition = this.currentXPosition - bufferLength;
          };
          //removes last letter and backspace key from buffer
          this.buffer = _OsShell.commandHistory[_OsShell.commandHistoryIndex - 1];
          console.log(this.buffer);
          _DrawingContext.drawText(this.currentFont, this.currentFontSize,
              this.currentXPosition,
              this.currentYPosition, this.buffer);
          _OsShell.commandHistoryIndex = _OsShell.commandHistoryIndex - 1;
          //sets x position after new buffer width
          this.currentXPosition = this.currentXPosition + CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, this.buffer);
      }        
        }

        public downKey(chr) : void {
                //checks to see if we are on most current command in cammand history
                //to empty user input spot
             if (_OsShell.commandHistoryIndex == _OsShell.commandHistory.length-1) {
                 //measures buffer width
             var bufferLength = CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, this.buffer);
             //makes sure we don't go out of range of canvas
            if (this.currentXPosition > 1 + CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, ">")) {
                                         _DrawingContext.clearRect(
                                                this.currentXPosition - bufferLength,
                                                this.currentYPosition +  _FontHeightMargin -  this.lineHeight,
                                                bufferLength,
                                                this.lineHeight);
                       //resets x position
                       this.currentXPosition = this.currentXPosition - bufferLength;
                                        };
                        //resets buffer
                        this.buffer = "";
                        //if we are not on last or first command history command
             } else if (_OsShell.commandHistoryIndex < _OsShell.commandHistory.length - 1) {                       
                                var bufferLength = CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, this.buffer);

                                    if (this.currentXPosition > 1 + CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, ">")) {
                                         _DrawingContext.clearRect(
                                                this.currentXPosition - bufferLength,
                                                this.currentYPosition +  _FontHeightMargin -  this.lineHeight,
                                                bufferLength,
                                                this.lineHeight);
                                            //resets x position
                                            this.currentXPosition = this.currentXPosition - bufferLength;
                                        };
                                        //removes last letter and backspace key from buffer
                                        console.log(_OsShell.commandHistoryIndex);
                                        this.buffer = _OsShell.commandHistory[_OsShell.commandHistoryIndex + 1];
                                        console.log(this.buffer);
                                        if   (!(_OsShell.commandHistoryIndex == _OsShell.commandHistory.length)){
                                            console.log("hey");
                                        _DrawingContext.drawText(this.currentFont, this.currentFontSize,
                                        this.currentXPosition,
                                        this.currentYPosition, this.buffer);
                                    _OsShell.commandHistoryIndex = _OsShell.commandHistoryIndex + 1;
                                    this.currentXPosition = this.currentXPosition + CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, this.buffer);
                                }
                                }
        }

        public putText(text): void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
           
            if (_StdOut){
               console.log("yo");
            }
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
         }

        public advanceLine(): void {
            this.currentXPosition = 0;
            //checks to see if cursor is below canvas
            //TODO measure
            if (this.currentYPosition >= (_Canvas.height - _DefaultFontSize - _FontHeightMargin)) {
                        //scrolling
                        // create pre canvas
                         var preCanvas = _DrawingContext.getImageData(0, this.lineHeight, 500, _Canvas.height-this.lineHeight);
                         //resets canvas
                         this.clearScreen();
                         //draws previous canvas
                         _DrawingContext.putImageData(preCanvas, 0, 0);
                         //resets cursor
                         this.currentXPosition = 0;
            } else
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize + 
                                     _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                     _FontHeightMargin;

                  }
    }
 }
