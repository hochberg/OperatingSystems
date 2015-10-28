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
            //increased for 3 memory blocks
            for (var i = 0; i < 768; i++) {
                this.memoryBlocks[i] = '00';
            }

        }

        
    }
}
