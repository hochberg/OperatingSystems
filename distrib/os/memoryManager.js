///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="../host/control.ts" />
/* ------------
   memoryManager.ts

   Memory Manager bro
   ------------ */
var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager(memory) {
            this.memory = memory;
        }
        MemoryManager.prototype.init = function () {
            //initializes memory with coreMemory
            this.memory = _Memory;
            //prints...
            this.printMemory();
        };
        MemoryManager.prototype.printMemory = function () {
            //retrieves content from memoryDisplay div
            var printMemoryDisplay = document.getElementById('memoryDisplay');
            //reinitalizes as blank palette
            printMemoryDisplay.innerHTML = "";
            //break lines when memoryBlockes exceeds 8
            for (var i = 0; i < this.memory.memoryBlocks.length; i++) {
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
                printMemoryDisplay.innerHTML = printMemoryDisplay.innerHTML + "  " + this.memory.memoryBlocks[i];
            }
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
