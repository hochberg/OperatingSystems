///<reference path="../globals.ts" />
///<reference path="../os/canvastext.ts" />
/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    var Console = (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, buffer, lineHeight) {
            if (currentFont === void 0) { currentFont = _DefaultFontFamily; }
            if (currentFontSize === void 0) { currentFontSize = _DefaultFontSize; }
            if (currentXPosition === void 0) { currentXPosition = 0; }
            if (currentYPosition === void 0) { currentYPosition = _DefaultFontSize; }
            if (buffer === void 0) { buffer = ""; }
            if (lineHeight === void 0) { lineHeight = _DefaultFontSize + _DrawingContext.fontDescent(currentFont, currentFontSize) + _FontHeightMargin; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.lineHeight = lineHeight;
        }
        Console.prototype.init = function () {
            this.clearScreen();
            this.resetXY();
        };
        Console.prototype.clearScreen = function () {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        };
        Console.prototype.resetXY = function () {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        };
        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) {
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                }
                else 
                //up arrow functionality
                if (chr == String.fromCharCode(38)) {
                    console.log("up");
                    this.upKey(chr);
                }
                else 
                //down arrow functionality
                if (chr == String.fromCharCode(40)) {
                    console.log("down");
                    this.downKey(chr);
                }
                else 
                // backspace fucntionality
                if (chr == String.fromCharCode(8)) {
                    this.backSpace(chr);
                }
                else 
                // tab fucntionality
                if ((chr == String.fromCharCode(9)) && (this.buffer.length > 0)) {
                    this.tabKey(chr);
                }
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
            }
        };
        Console.prototype.tabKey = function (chr) {
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
            }
            console.log(possibleCommands);
            if (possibleCommands.length == 1) {
                var strCommand = possibleCommands[0].command;
                console.log(strCommand);
                console.log(possibleCommands[0].command);
                this.buffer = "";
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, ">"), //TODO
                this.currentYPosition, strCommand);
                this.buffer = strCommand;
            }
        };
        Console.prototype.backSpace = function (chr) {
            //checks if cursor is off screen
            if (this.currentXPosition > 0) {
                //adds char to buffer
                this.buffer += chr;
                //records last char before enter is hit
                var lastChar = this.buffer.substring(this.buffer.length - 2, this.buffer.length - 1);
                //records that characters width
                var lastCharWidth = TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, lastChar);
                //clears rectangle of that character
                _DrawingContext.clearRect(this.currentXPosition - lastCharWidth, this.currentYPosition + _FontHeightMargin - this.lineHeight, lastCharWidth, this.lineHeight);
                //resets x position
                this.currentXPosition = this.currentXPosition - lastCharWidth;
                //removes last letter and backspace key from buffer
                this.buffer = this.buffer.substring(0, this.buffer.length - 2);
            }
        };
        Console.prototype.upKey = function (chr) {
            //checks to see if anything is in command histroy
            if (_OsShell.commandHistoryIndex > 0) {
                //measures buffer's width
                var bufferLength = TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, this.buffer);
                //clears rectangle of buffer length
                if (this.currentXPosition > 1 + TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, ">")) {
                    _DrawingContext.clearRect(this.currentXPosition - bufferLength, this.currentYPosition + _FontHeightMargin - this.lineHeight, bufferLength, this.lineHeight);
                    //resets x position
                    this.currentXPosition = this.currentXPosition - bufferLength;
                }
                ;
                //removes last letter and backspace key from buffer
                this.buffer = _OsShell.commandHistory[_OsShell.commandHistoryIndex - 1];
                console.log(this.buffer);
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, this.buffer);
                _OsShell.commandHistoryIndex = _OsShell.commandHistoryIndex - 1;
                //sets x position after new buffer width
                this.currentXPosition = this.currentXPosition + TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, this.buffer);
            }
        };
        Console.prototype.downKey = function (chr) {
            //checks to see if we are on most current command in cammand history
            //to empty user input spot
            if (_OsShell.commandHistoryIndex == _OsShell.commandHistory.length - 1) {
                //measures buffer width
                var bufferLength = TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, this.buffer);
                //makes sure we don't go out of range of canvas
                if (this.currentXPosition > 1 + TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, ">")) {
                    _DrawingContext.clearRect(this.currentXPosition - bufferLength, this.currentYPosition + _FontHeightMargin - this.lineHeight, bufferLength, this.lineHeight);
                    //resets x position
                    this.currentXPosition = this.currentXPosition - bufferLength;
                }
                ;
                //resets buffer
                this.buffer = "";
            }
            else if (_OsShell.commandHistoryIndex < _OsShell.commandHistory.length - 1) {
                var bufferLength = TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, this.buffer);
                if (this.currentXPosition > 1 + TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, ">")) {
                    _DrawingContext.clearRect(this.currentXPosition - bufferLength, this.currentYPosition + _FontHeightMargin - this.lineHeight, bufferLength, this.lineHeight);
                    //resets x position
                    this.currentXPosition = this.currentXPosition - bufferLength;
                }
                ;
                //removes last letter and backspace key from buffer
                console.log(_OsShell.commandHistoryIndex);
                this.buffer = _OsShell.commandHistory[_OsShell.commandHistoryIndex + 1];
                console.log(this.buffer);
                if (!(_OsShell.commandHistoryIndex == _OsShell.commandHistory.length)) {
                    console.log("hey");
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, this.buffer);
                    _OsShell.commandHistoryIndex = _OsShell.commandHistoryIndex + 1;
                    this.currentXPosition = this.currentXPosition + TSOS.CanvasTextFunctions.measure(_DefaultFontFamily, _DefaultFontSize, this.buffer);
                }
            }
        };
        Console.prototype.putText = function (text) {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
            var nextCharacter = "";
            if (text !== "") {
                for (var i = 0; i < text.length; i++) {
                    nextCharacter = text.charAt(i) + "";
                    //Check to make sure that the character is able to be drawn on the current line
                    var nextX = this.currentXPosition + TSOS.CanvasTextFunctions.measure(this.currentFont, this.currentFontSize, text);
                    if (nextX > _Canvas.width) {
                        this.advanceLine();
                    }
                    // Draw the text at the current X and Y coordinates.
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                    // Move the current X position.
                    var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                    this.currentXPosition = this.currentXPosition + offset;
                }
            }
        };
        Console.prototype.advanceLine = function () {
            this.currentXPosition = 0;
            //checks to see if cursor is below canvas
            //TODO measure
            if (this.currentYPosition >= (_Canvas.height - _DefaultFontSize - _FontHeightMargin)) {
                //scrolling
                // create pre canvas
                var preCanvas = _DrawingContext.getImageData(0, this.lineHeight, 500, _Canvas.height - this.lineHeight);
                //resets canvas
                this.clearScreen();
                //draws previous canvas
                _DrawingContext.putImageData(preCanvas, 0, 0);
                //resets cursor
                this.currentXPosition = 0;
            }
            else
                /*
                 * Font size measures from the baseline to the highest point in the font.
                 * Font descent measures from the baseline to the lowest point in the font.
                 * Font height margin is extra spacing between the lines.
                 */
                this.currentYPosition += _DefaultFontSize +
                    _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                    _FontHeightMargin;
        };
        return Console;
    })();
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
