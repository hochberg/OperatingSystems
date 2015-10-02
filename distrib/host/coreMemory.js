///<reference path="../globals.ts" />
/* ------------
     coreMemory.ts

     Requires globals.ts.

     Within our host (interacts with hardware, not client OS), Core Memory will
     provide storage bits to load and run user code.
     ------------ */
//
// Core Memory
//
var TSOS;
(function (TSOS) {
    var coreMemory = (function () {
        function coreMemory(memoryBlocks) {
            if (memoryBlocks === void 0) { memoryBlocks = []; }
            this.memoryBlocks = memoryBlocks;
        }
        coreMemory.prototype.init = function () {
            //initalizes all memory blocks with "00"
            for (var i = 0; i < 256; i++) {
                this.memoryBlocks[i] = '00';
            }
            //initial print of memory
            this.printMemory();
        };
        coreMemory.prototype.printMemory = function () {
            //retrieves content from memoryDisplay div
            var printMemoryDisplay = document.getElementById('memoryDisplay');
            //reinitalizes as blank palette
            printMemoryDisplay.innerHTML = "";
            //break lines when memoryBlockes exceeds 8
            for (var i = 0; i < this.memoryBlocks.length; i++) {
                if (i % 8 == 0) {
                    //creates hex header for each new memory line
                    var hex = i.toString(16);
                    //adds "0" padding to hex that is less than 3 digits (formatting fix)
                    while (hex.length < 3) {
                        hex = "0" + hex;
                    }
                    //breaks line and adds header
                    if (!(i == 0)) {
                        printMemoryDisplay.innerHTML = printMemoryDisplay.innerHTML + "<br>" + "<b>0x" + hex + "</b>";
                    }
                    else {
                        printMemoryDisplay.innerHTML = printMemoryDisplay.innerHTML + "<b>0x" + hex + "</b>";
                    }
                }
                //prints memory blocks 1 by 1
                printMemoryDisplay.innerHTML = printMemoryDisplay.innerHTML + "  " + this.memoryBlocks[i];
            }
        };
        return coreMemory;
    })();
    TSOS.coreMemory = coreMemory;
})(TSOS || (TSOS = {}));
