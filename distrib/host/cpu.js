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
            var counter = _CPU.PIDArray[pid];
            var currentCodeCounter = 0;
            var currentCode = instr[currentCodeCounter];
            // while (!(currentCode=="00"))
            for (var i = 0; counter > i; i++) {
                //var currentCode = instr[0];
                //var tailInstr = instr.substring(3, instr.length);
                // console.log(firstTwoBits);
                switch (currentCode) {
                    case "A9":
                        this.loadAccWithConstant(instr, pcb, currentCodeCounter);
                        currentCodeCounter = currentCodeCounter + 2;
                        currentCode = instr[currentCodeCounter];
                        counter = counter - 1;
                        break;
                    case 'AD':
                        this.loadAccFromMemory(instr, pcb, currentCodeCounter);
                        currentCodeCounter = currentCodeCounter + 3;
                        currentCode = instr[currentCodeCounter];
                        counter = counter - 2;
                        break;
                    case '8D':
                        this.storeAccInMemory(instr, pcb, currentCodeCounter);
                        currentCodeCounter = currentCodeCounter + 3;
                        currentCode = instr[currentCodeCounter];
                        counter = counter - 2;
                        break;
                    case '6D':
                        this.addsWithCarry(instr, pcb, currentCodeCounter);
                        currentCodeCounter = currentCodeCounter + 3;
                        currentCode = instr[currentCodeCounter];
                        counter = counter - 2;
                        break;
                    case 'A2':
                        this.loadXWithConstant(instr, pcb, currentCodeCounter);
                        currentCodeCounter = currentCodeCounter + 2;
                        currentCode = instr[currentCodeCounter];
                        counter = counter - 1;
                        break;
                    case 'AE':
                        this.loadXFromMemory(instr, pcb, currentCodeCounter);
                        currentCodeCounter = currentCodeCounter + 3;
                        currentCode = instr[currentCodeCounter];
                        counter = counter - 2;
                        break;
                    case 'A0':
                        this.loadYWithConstant(instr, pcb, currentCodeCounter);
                        currentCodeCounter = currentCodeCounter + 2;
                        currentCode = instr[currentCodeCounter];
                        counter = counter - 1;
                        break;
                    case 'AC':
                        this.loadYFromMemory(instr, pcb, currentCodeCounter);
                        currentCodeCounter = currentCodeCounter + 3;
                        currentCode = instr[currentCodeCounter];
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
                        this.loadYFromMemory(instr, pcb, currentCode);
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
                        currentCode = instr[1];
                        break;
                }
                pcb.printPCB();
                _MemoryManager.printMemory();
            }
        };
        //converts a num in hex to decimal equivalent
        Cpu.prototype.hexToDec = function (hex) {
            return parseInt(hex, 16);
        };
        //converts a num in decimal to hex equivalent
        Cpu.prototype.decToHex = function (dec) {
            return dec.toString(16);
        };
        //A9 
        Cpu.prototype.loadAccWithConstant = function (instr, pcb, currentCodeCounter) {
            //loads acc with the next element in instruction array
            console.log(instr[1 + currentCodeCounter]);
            console.log(currentCodeCounter);
            pcb.acc = instr[1 + currentCodeCounter];
            _StdOut.putText("Load acc with constant");
            _StdOut.advanceLine();
        };
        //AD
        Cpu.prototype.loadAccFromMemory = function (instr, pcb, currentCodeCounter) {
            pcb.acc = _MemoryManager.memory.memoryBlocks[this.hexToDec(instr[1 + currentCodeCounter])];
            _StdOut.putText("Load acc from memory");
            _StdOut.advanceLine();
        };
        //8D
        Cpu.prototype.storeAccInMemory = function (instr, pcb, currentCodeCounter) {
            //  console.log(_MemoryManager.memory.memoryBlocks[22]);
            _MemoryManager.memory.memoryBlocks[this.hexToDec(instr[1 + currentCodeCounter])] = pcb.acc;
            _StdOut.putText("Store acc in memory");
            _StdOut.advanceLine();
        };
        //6D
        Cpu.prototype.addsWithCarry = function (instr, pcb, currentCodeCounter) {
            //retrieves the contents at the given address (in hex)
            var content = _MemoryManager.memory.memoryBlocks[this.hexToDec(instr[1 + currentCodeCounter])];
            //retrievs content of accumulater (in hex)
            var acc = pcb.acc;
            //converts the two num to dec and adds them
            var result = this.hexToDec(content) + this.hexToDec(acc);
            //formats correctly (changes to hex, then to uppercase, and adds "0" if neccessary)
            var formattedResult = this.decToHex(result).toUpperCase();
            if (formattedResult.length < 2) {
                formattedResult = "0" + formattedResult;
            }
            //loads results back into accumulater
            pcb.acc = formattedResult;
            _StdOut.putText("Adds with carry");
            _StdOut.advanceLine();
        };
        //A2
        Cpu.prototype.loadXWithConstant = function (instr, pcb, currentCodeCounter) {
            pcb.xreg = instr[1 + currentCodeCounter];
            pcb.printPCB();
            _StdOut.putText("Loads X register with constant");
            _StdOut.advanceLine();
        };
        //AE
        Cpu.prototype.loadXFromMemory = function (instr, pcb, currentCodeCounter) {
            pcb.xreg = _MemoryManager.memory.memoryBlocks[this.hexToDec(instr[1 + currentCodeCounter])];
            _StdOut.putText("Load X register from memory");
            _StdOut.advanceLine();
        };
        //A0
        Cpu.prototype.loadYWithConstant = function (instr, pcb, currentCodeCounter) {
            pcb.yreg = instr[1 + currentCodeCounter];
            pcb.printPCB();
            _StdOut.putText("Loads Y register with constant");
            _StdOut.advanceLine();
        };
        //AC
        Cpu.prototype.loadYFromMemory = function (instr, pcb, currentCodeCounter) {
            pcb.yreg = _MemoryManager.memory.memoryBlocks[this.hexToDec(instr[1 + currentCodeCounter])];
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
