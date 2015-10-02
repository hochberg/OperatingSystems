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
                    public isExecuting: boolean = false,
                    public PIDArray: any = []) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.PIDArray = [];
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
          //  _Memory.printMemory();
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        }

        
//TODO this will take from memoryBlocks, not from user input
//also will probably be in a different location
        public execute(instr, pid, pcb) {
                var instr = instr.memoryBlocks;
                console.log(instr.length);
                var currentCode = instr[0];
                console.log(currentCode);
                var counter = _CPU.PIDArray[pid];

           // while (!(currentCode=="00"))
            for  (var i = 0; counter > i; i++) {    
                //var currentCode = instr[0];
               //var tailInstr = instr.substring(3, instr.length);
               // console.log(firstTwoBits);
   
                switch (currentCode) {
                    case "A9":
                        this.loadAccWithConstant(instr,pcb);
                        instr.splice(0, 2);
                        counter = counter - 1;
                        break;
                    case 'AD':
                        this.loadAccFromMemory();
                        instr.splice(0, 3);
                        counter = counter - 2;
                        break;
                    case '8D':
                        this.storeAccInMemory();
                    
                        break;
                    case '6D':
                        this.addsWithCarry();
                    
                        break;
                    case 'A2':
                        this.loadXWithConstant();
                        
                       
                        break;
                    case 'AE':
                        this.loadXFromMemory();
                    
                        break;
                    case 'A0':
                        this.loadYWithConstant();
                    
                        break;
                    case 'AC':
                        this.loadYFromMemory();
                       
                        break;
                    case 'AE':
                        this.noOperation();
                    
                        break;
                    case '00':
                        this.break();
                    
                        break;
                    case 'EC':
                        this.compareMemoryToX();
                    
                        break;
                    case 'AC':
                        this.loadYFromMemory();
                      
                       
                        break;
                    case 'D0':
                        this.branchNBytes();
                    
                        break;
                    case 'EE':
                        this.incrementByte();
                    
                        break;
                    case 'FF':
                        this.systemCall();
                    
                        break;
                    default:
                        _StdOut.putText("INVALID");
                        _StdOut.advanceLine();
                        break;


                }
                 currentCode = instr[0];

                
            }


        }
        //A9
        public loadAccWithConstant(instr,pcb) {
            pcb.acc = instr[1];
            pcb.printPCB();
            _StdOut.putText("Load acc with constant");
            _StdOut.advanceLine();

        }
        //AD
        public loadAccFromMemory() {
            _StdOut.putText("Load acc from memory");
            _StdOut.advanceLine();

        }
        //8D
        public storeAccInMemory() {
            _StdOut.putText("Store acc in memory");
            _StdOut.advanceLine();

        }
        //6D
        public addsWithCarry() {
            _StdOut.putText("Adds with carry");
            _StdOut.advanceLine();

        }
        //A2
        public loadXWithConstant() {
            _StdOut.putText("Loads X register with constant");
            _StdOut.advanceLine();

        }
        //AE
        public loadXFromMemory() {
            _StdOut.putText("Load X register from memory");
            _StdOut.advanceLine();

        }
        //A0
        public loadYWithConstant() {
            _StdOut.putText("Loads Y register with constant");
            _StdOut.advanceLine();

        }
        //AC
        public loadYFromMemory() {
            _StdOut.putText("Load Y register from memory");
            _StdOut.advanceLine();

        }
        //EA
        public noOperation() {
            _StdOut.putText("No Operation");
            _StdOut.advanceLine();

        }
        //00
        public break() {
            _StdOut.putText("Break/System Call");
            _StdOut.advanceLine();

        }
        //EC
        public compareMemoryToX() {
            _StdOut.putText("Compares Memory to X");
            _StdOut.advanceLine();

        }
        //D0
        public branchNBytes() {
            _StdOut.putText("Branches N bytes if Z flag = 0");
            _StdOut.advanceLine();

        }
        //EE
        public incrementByte() {
            _StdOut.putText("Increment Byte");
            _StdOut.advanceLine();

        }
        //FF
        public systemCall() {
            _StdOut.putText("System Call");
            _StdOut.advanceLine();

        }




    }
}
