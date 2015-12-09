///<reference path="../globals.ts" />
///<reference path="../os/memoryManager.ts" />
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
            //increased for 3 memory blocks
            for (var i = 0; i < 768; i++) {
                this.memoryBlocks[i] = '00';
            }
        };
        return coreMemory;
    })();
    TSOS.coreMemory = coreMemory;
})(TSOS || (TSOS = {}));
