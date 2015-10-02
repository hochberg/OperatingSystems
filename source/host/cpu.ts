///<reference path="../globals.ts" />

/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
          //  _Memory.printMemory();
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        }

        
//TODO this will take from memoryBlocks, not from user input
//also will probably be in a different location
        // public execute(instr) {
        //     instr = String(instr);

        //     while (instr.length > 0) {
        //         console.log(instr.length);

        //         var firstTwoBits = instr.substring(0, 2);
        //         var tailInstr = instr.substring(3, instr.length);
        //        // console.log(firstTwoBits);
        //        // console.log(tailInstr);


        //         switch (firstTwoBits) {
        //             case "A9":
        //                 var constant = tailInstr.substring(0, 2);
        //                 this.Acc = constant;
        //                 _StdOut.putText("Load acc with constant");
        //                 _StdOut.advanceLine();
        //                // console.log(this.Acc);
        //                 tailInstr = tailInstr.substring(3, instr.length);
        //                 break;
        //             case 'AD':
        //                 _StdOut.putText("Load acc from memory");
        //                 _StdOut.advanceLine();
        //                 break;
        //             case '8D':
        //                 _StdOut.putText("Store acc in memory");
        //                 _StdOut.advanceLine();
        //                 break;
        //             default:
        //                 _StdOut.putText("INVALID");
        //                 _StdOut.advanceLine();
        //                 break;


        //         }

        //         instr = tailInstr;
        //     }


        // }



    }
}
