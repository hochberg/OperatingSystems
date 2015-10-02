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
            for (var i = 0; i < 256; i++) {
                this.memoryBlocks[i] = '00';
            }
            console.log("yo2");
            console.log(this.memoryBlocks[0]);
            this.printMemory();
        };
        coreMemory.prototype.printMemory = function () {
            var printMemoryDisplay = document.getElementById('memoryDisplay');
            printMemoryDisplay.value = this.memoryBlocks[0];
        };
        return coreMemory;
    })();
    TSOS.coreMemory = coreMemory;
})(TSOS || (TSOS = {}));
