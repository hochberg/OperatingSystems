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
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            //FETCH
            var currentCode = this.fetch(_currentPcb.pc);
            console.log(_currentPcb);
            this.execute(currentCode);
            _MemoryManager.printMemory();
            _currentPcb.printPCB();
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        };
        //increment pc
        Cpu.prototype.incrementPcBy = function (num) {
            _currentPcb.pc = _currentPcb.pc + num;
        };
        //get commands 
        Cpu.prototype.fetch = function (currentPC) {
            //fetchs the op code at the current process code in the pcb
            console.log(_MemoryManager.memory.memoryBlocks[currentPC]);
            return _MemoryManager.memory.memoryBlocks[currentPC];
        };
        //decode and execute
        Cpu.prototype.execute = function (currentCode) {
            switch (currentCode) {
                case "A9":
                    this.loadAccWithConstant();
                    this.incrementPcBy(2);
                    break;
                case 'AD':
                    this.loadAccFromMemory();
                    this.incrementPcBy(3);
                    break;
                case '8D':
                    this.storeAccInMemory();
                    this.incrementPcBy(3);
                    break;
                // case '6D':
                //     this.addsWithCarry(instr, pcb, currentCodeCounter);
                //     currentCodeCounter = currentCodeCounter + 3;
                //     currentCode = instr[currentCodeCounter];
                //     counter = counter - 2;
                //     break;
                // case 'A2':
                //     this.loadXWithConstant(instr, pcb, currentCodeCounter);
                //     currentCodeCounter = currentCodeCounter + 2;
                //     currentCode = instr[currentCodeCounter];
                //     counter = counter - 1;
                //     break;
                // case 'AE':
                //     this.loadXFromMemory(instr, pcb, currentCodeCounter);
                //     currentCodeCounter = currentCodeCounter + 3;
                //     currentCode = instr[currentCodeCounter];
                //     counter = counter - 2;
                //
                //     break;
                // case 'A0':
                //     this.loadYWithConstant(instr, pcb, currentCodeCounter);
                //     currentCodeCounter = currentCodeCounter + 2;
                //     currentCode = instr[currentCodeCounter];
                //     counter = counter - 1;
                //     break;
                // case 'AC':
                //     this.loadYFromMemory(instr, pcb, currentCodeCounter);
                //     currentCodeCounter = currentCodeCounter + 3;
                //     currentCode = instr[currentCodeCounter];
                //     counter = counter - 2;
                //     break;
                // case 'AE':
                //     this.noOperation();
                //     currentCodeCounter = currentCodeCounter + 1;
                //     currentCode = instr[currentCodeCounter];
                //     break;
                case '00':
                    this.break();
                    break;
                // case 'EC':
                //     this.compareMemoryToX(instr, pcb, currentCodeCounter);
                //     currentCodeCounter = currentCodeCounter + 3;
                //     currentCode = instr[currentCodeCounter];
                //     counter = counter - 2;
                //     break;
                // case 'D0':
                //     this.branchNBytes(instr, pcb, currentCodeCounter, currentCode, counter,pid);
                //     break;
                // case 'EE':
                //     this.incrementByte(instr, pcb, currentCodeCounter);
                //     currentCodeCounter = currentCodeCounter + 3;
                //     currentCode = instr[currentCodeCounter];
                //     counter = counter - 2;
                //     break;
                // case 'FF':
                //     this.systemCall(instr, pcb, currentCodeCounter);
                //     currentCodeCounter = currentCodeCounter + 1;
                //     currentCode = instr[currentCodeCounter];
                //     break;
                default:
                    _StdOut.putText("INVALID");
                    //_StdOut.advanceLine();
                    break;
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
        //get next byte
        Cpu.prototype.getNextByte = function () {
            return _MemoryManager.memory.memoryBlocks[_currentPcb.pc + 1];
        };
        //get next next byte
        Cpu.prototype.getNextNextByte = function () {
            return _MemoryManager.memory.memoryBlocks[_currentPcb.pc + 2];
        };
        //A9 - LDA
        //Loads accumulater with constant
        Cpu.prototype.loadAccWithConstant = function () {
            //loads acc with the next element in instruction array
            _currentPcb.acc = this.getNextByte();
            //  _StdOut.putText("Load acc with constant");
            //   _StdOut.advanceLine();
        };
        //AD - LDA
        //Loads accumulater from memory
        Cpu.prototype.loadAccFromMemory = function () {
            //retrieves memory address (after being translated into "little-endian")
            var address = this.getNextNextByte() + this.getNextByte();
            //changes address from hex to decimal
            var decAddress = this.hexToDec(address);
            //sets accumulater to content from memory
            _currentPcb.acc = _MemoryManager.memory.memoryBlocks[decAddress];
            //_StdOut.putText("Load acc from memory");
            //_StdOut.advanceLine();
        };
        //8D - STA
        //Stores accumulater in memory
        Cpu.prototype.storeAccInMemory = function () {
            //gets address in memory in little endian
            var address = this.getNextNextByte() + this.getNextByte();
            //translate that address from hex to decimal
            var decAddress = this.hexToDec(address);
            //sets contents of that address to accumulater
            _MemoryManager.memory.memoryBlocks[decAddress] = _currentPcb.acc;
            // _StdOut.putText("Store acc in memory");
            // _StdOut.advanceLine();
        };
        //6D - ADC
        //Adds content of given address to the contents of the accumulater
        //and keeps results in accumulater
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
        //A2 - LDX
        //Loads the X register with a constant
        Cpu.prototype.loadXWithConstant = function (instr, pcb, currentCodeCounter) {
            //loads given constant in x register
            pcb.xreg = instr[1 + currentCodeCounter];
            _StdOut.putText("Loads X register with constant");
            _StdOut.advanceLine();
        };
        //AE - LDX
        //Loads the X register from memory
        Cpu.prototype.loadXFromMemory = function (instr, pcb, currentCodeCounter) {
            //loads content at given address in x register
            pcb.xreg = _MemoryManager.memory.memoryBlocks[this.hexToDec(instr[1 + currentCodeCounter])];
            _StdOut.putText("Load X register from memory");
            _StdOut.advanceLine();
        };
        //A0 - LDY
        //Loads Y register with a constant
        Cpu.prototype.loadYWithConstant = function (instr, pcb, currentCodeCounter) {
            //loads given constant in y register
            pcb.yreg = instr[1 + currentCodeCounter];
            _StdOut.putText("Loads Y register with constant");
            _StdOut.advanceLine();
        };
        //AC -LDY
        //Loads the X register from memory
        Cpu.prototype.loadYFromMemory = function (instr, pcb, currentCodeCounter) {
            //loads content at given address in y register  f
            pcb.yreg = _MemoryManager.memory.memoryBlocks[this.hexToDec(instr[1 + currentCodeCounter])];
            _StdOut.putText("Load Y register from memory");
            _StdOut.advanceLine();
        };
        //EA - NOP
        // performs no operation
        Cpu.prototype.noOperation = function () {
            _StdOut.putText("No Operation");
            _StdOut.advanceLine();
        };
        //00 - BRK
        //Break (really a system call)
        //Set CPU regs to PCBs
        Cpu.prototype.break = function () {
            //starts executing cycle
            _CPU.isExecuting = false;
            // _StdOut.putText("Complete");
            // _StdOut.advanceLine();
        };
        //EC - CPX
        //Compares a byte at a given location in memory to X register
        //if they are equals, sets Z flag to "01", if not sets Z flag to "00"
        Cpu.prototype.compareMemoryToX = function (instr, pcb, currentCodeCounter) {
            //retrieves the contents at the given address (in hex)
            var content = _MemoryManager.memory.memoryBlocks[this.hexToDec(instr[1 + currentCodeCounter])];
            //convert cotent to decimal
            var decContent = this.hexToDec(content);
            // convert content in x register to decimal
            var decXReg = this.hexToDec(pcb.xreg);
            //compares two decimal nums for equality
            //if equal. sets z flag to 01
            if (decContent == decXReg) {
                pcb.zflag = "01";
            }
            else {
                pcb.zflag = "00";
            }
            _StdOut.putText("Compares Memory to X");
            _StdOut.advanceLine();
        };
        //D0 - BNE
        //Branch n bytes if Z flag = "00"
        Cpu.prototype.branchNBytes = function (instr, pcb, currentCodeCounter, currentCode, counter, pid) {
            //checks to see if z flag is set to "00"
            if (pcb.zflag == "00") {
                //retrieves the contents at the given address (in hex)
                var content = _MemoryManager.memory.memoryBlocks[this.hexToDec(instr[1 + currentCodeCounter])];
                //convert cotent to decimal
                var decContent = this.hexToDec(content);
                //jumps currentCodeCounter to given address
                //ands sets the currentCode to that address
                currentCodeCounter = decContent;
                currentCode = instr[currentCodeCounter];
                //sets counter back to counter of full loaded code
                //TODO
                //This will result in trailing INVALIDs because
                //this counter will be >= the actual length of the loaded code
                //Will have to fix how execute loops based on this counter in future versions
                counter = _CPU.PIDArray[pid];
            }
            _StdOut.putText("Branches N bytes if Z flag = 0");
            _StdOut.advanceLine();
        };
        //EE - INC
        //Increment the value of a byte at a given address in memory
        Cpu.prototype.incrementByte = function (instr, pcb, currentCodeCounter) {
            //retrieves the contents at the given address (in hex)
            var content = _MemoryManager.memory.memoryBlocks[this.hexToDec(instr[1 + currentCodeCounter])];
            //change content to decimal and add one
            var incremented = this.hexToDec(content) + 1;
            //convert back to hex and load back into register
            _MemoryManager.memory.memoryBlocks[this.hexToDec(instr[1 + currentCodeCounter])] = this.decToHex(incremented);
            _StdOut.putText("Increment Byte");
            _StdOut.advanceLine();
        };
        //FF - SYS
        //System Call
        // if "01" is in X reg, then print integer stored in Y register
        // if "02" is in X reg, print the 00-terminated string stored at the address in the Y register
        Cpu.prototype.systemCall = function (instr, pcb, currentCodeCounter) {
            //checks if x reg is "01"
            //if so, prints y reg integer to console
            if (pcb.xreg == "01") {
                _StdOut.putText(pcb.yreg);
                _StdOut.advanceLine();
            }
            //TODO not quite sure what this should do
            if (pcb.xreg == "02") {
                _StdOut.putText(pcb.yreg);
                _StdOut.advanceLine();
            }
            _StdOut.putText("System Call");
            _StdOut.advanceLine();
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
