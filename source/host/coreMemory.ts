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
module TSOS {

    export class coreMemory {

        constructor(public memoryBlocks: any = []
        ) {

        }
        public init(): void {
            //initalizes all memory blocks with "00"
            for (var i = 0; i < 256; i++) {
                this.memoryBlocks[i] = '00';
            }

        }

        
    }
}
