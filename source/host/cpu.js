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
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting, PIDArray) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            if (PIDArray === void 0) { PIDArray = []; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.PIDArray = PIDArray;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.PIDArray = [];
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            //  _Memory.printMemory();
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        };
        //TODO this will take from memoryBlocks, not from user input
        //also will probably be in a different location
        Cpu.prototype.execute = function (instr, pid, pcb) {
            //  var savedInstr = instr.memoryBlocks;
            var instr = instr.memoryBlocks;
            console.log(instr.length);
            var currentCode = instr[0];
            console.log(currentCode);
            var counter = _CPU.PIDArray[pid];
            // while (!(currentCode=="00"))
            for (var i = 0; counter > i; i++) {
                //var currentCode = instr[0];
                //var tailInstr = instr.substring(3, instr.length);
                // console.log(firstTwoBits);
                switch (currentCode) {
                    case "A9":
                        this.loadAccWithConstant(instr, pcb);
                        instr.splice(0, 2);
                        counter = counter - 1;
                        break;
                    case 'AD':
                        this.loadAccFromMemory(instr, pcb);
                        instr.splice(0, 3);
                        counter = counter - 2;
                        break;
                    case '8D':
                        this.storeAccInMemory(instr, pcb);
                        instr.splice(0, 3);
                        counter = counter - 2;
                        break;
                    case '6D':
                        this.addsWithCarry(instr, pcb);
                        instr.splice(0, 3);
                        counter = counter - 2;
                        break;
                    case 'A2':
                        this.loadXWithConstant(instr, pcb);
                        instr.splice(0, 2);
                        counter = counter - 1;
                        break;
                    case 'AE':
                        this.loadXFromMemory(instr, pcb);
                        instr.splice(0, 3);
                        counter = counter - 2;
                        break;
                    case 'A0':
                        this.loadYWithConstant(instr, pcb);
                        instr.splice(0, 2);
                        counter = counter - 1;
                        break;
                    case 'AC':
                        this.loadYFromMemory(instr, pcb);
                        instr.splice(0, 3);
                        counter = counter - 2;
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
                        this.loadYFromMemory(instr, pcb);
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
                        instr.splice(0, 1);
                        break;
                }
                currentCode = instr[0];
                pcb.printPCB();
                // _MemoryManager.memory.memoryBlocks = savedInstr;
                _MemoryManager.printMemory();
            }
        };
        //converts a num in hex to decimal equivalent
        Cpu.prototype.hexToDec = function (hex) {
            parseInt(hex, 16);
        };
        //converts a num in decimal to hex equivalent
        Cpu.prototype.decToHex = function (dec) {
            parseInt(dec.toString(16));
        };
        //A9
        Cpu.prototype.loadAccWithConstant = function (instr, pcb) {
            //loads acc with the next element in instruction arry
            pcb.acc = instr[1];
            // pcb.printPCB(); ///TODO FIX
            _StdOut.putText("Load acc with constant");
            _StdOut.advanceLine();
        };
        //AD
        Cpu.prototype.loadAccFromMemory = function (instr, pcb) {
            pcb.acc = _MemoryManager.memory.memoryBlocks[this.hexToDec(instr[1])];
            _StdOut.putText("Load acc from memory");
            _StdOut.advanceLine();
        };
        //8D
        Cpu.prototype.storeAccInMemory = function (instr, pcb) {
            //  console.log(_MemoryManager.memory.memoryBlocks[22]);
            _MemoryManager.memory.memoryBlocks[this.hexToDec(instr[1])] = pcb.acc;
            _StdOut.putText("Store acc in memory");
            _StdOut.advanceLine();
        };
        //6D
        Cpu.prototype.addsWithCarry = function (instr, pcb) {
            //retrieves the contents at the given address (in hex)
            var content = _MemoryManager.memory.memoryBlocks[this.hexToDec(instr[1])];
            console.log(instr[1]);
            console.log(this.hexToDec(instr[1]));
            console.log(_MemoryManager.memory.memoryBlocks[this.hexToDec(instr[1])]);
            //retrievs content of accumulater (in hex)
            var acc = pcb.acc;
            //converts the two num to dec and adds them
            console.log(acc);
            console.log(content);
            content.log(this.hexToDec(content));
            var result = this.hexToDec(content) + this.hexToDec(acc);
            //loads results back into accumulater
            pcb.acc = this.decToHex(result);
            _StdOut.putText("Adds with carry");
            _StdOut.advanceLine();
        };
        //A2
        Cpu.prototype.loadXWithConstant = function (instr, pcb) {
            pcb.xreg = instr[1];
            pcb.printPCB();
            _StdOut.putText("Loads X register with constant");
            _StdOut.advanceLine();
        };
        //AE
        Cpu.prototype.loadXFromMemory = function (instr, pcb) {
            pcb.xreg = _MemoryManager.memory.memoryBlocks[this.hexToDec(instr[1])];
            _StdOut.putText("Load X register from memory");
            _StdOut.advanceLine();
        };
        //A0
        Cpu.prototype.loadYWithConstant = function (instr, pcb) {
            pcb.yreg = instr[1];
            pcb.printPCB();
            _StdOut.putText("Loads Y register with constant");
            _StdOut.advanceLine();
        };
        //AC
        Cpu.prototype.loadYFromMemory = function (instr, pcb) {
            pcb.yreg = _MemoryManager.memory.memoryBlocks[this.hexToDec(instr[1])];
            _StdOut.putText("Load Y register from memory");
            _StdOut.advanceLine();
        };
        //EA
        Cpu.prototype.noOperation = function () {
            _StdOut.putText("No Operation");
            _StdOut.advanceLine();
        };
        //00
        Cpu.prototype.break = function () {
            _StdOut.putText("Break/System Call");
            _StdOut.advanceLine();
        };
        //EC
        Cpu.prototype.compareMemoryToX = function () {
            _StdOut.putText("Compares Memory to X");
            _StdOut.advanceLine();
        };
        //D0
        Cpu.prototype.branchNBytes = function () {
            _StdOut.putText("Branches N bytes if Z flag = 0");
            _StdOut.advanceLine();
        };
        //EE
        Cpu.prototype.incrementByte = function () {
            _StdOut.putText("Increment Byte");
            _StdOut.advanceLine();
        };
        //FF
        Cpu.prototype.systemCall = function () {
            _StdOut.putText("System Call");
            _StdOut.advanceLine();
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
