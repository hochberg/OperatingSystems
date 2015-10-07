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
        Cpu.prototype.printPCB = function () {
            //prints pcb properties to diplay
            var printPc = document.getElementById("pcCPUDisplay");
            //var printIr = document.getElementById("irStatusDisplay");
            var printAcc = document.getElementById("accCPUDisplay");
            var printXr = document.getElementById("xrCPUDisplay");
            var printYr = document.getElementById("yrCPUDisplay");
            var printZf = document.getElementById("zfSCPUDisplay");
            printPc.innerHTML = this.Pc;
            //printIr.innerHTML = this.ir;
            printAcc.innerHTML = this.Acc;
            printXr.innerHTML = this.Xreg;
            printYr.innerHTML = this.Yreg;
            printZf.innerHTML = this.Zflag;
        };
        ;
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
                case '6D':
                    this.addsWithCarry();
                    this.incrementPcBy(3);
                    break;
                case 'A2':
                    this.loadXWithConstant();
                    this.incrementPcBy(2);
                    break;
                case 'AE':
                    this.loadXFromMemory();
                    this.incrementPcBy(3);
                    break;
                case 'A0':
                    this.loadYWithConstant();
                    this.incrementPcBy(2);
                    break;
                case 'AC':
                    this.loadYFromMemory();
                    this.incrementPcBy(3);
                    break;
                case 'AE':
                    this.noOperation();
                    this.incrementPcBy(1);
                    break;
                case '00':
                    this.break();
                    break;
                case 'EC':
                    this.compareMemoryToX();
                    this.incrementPcBy(2);
                    break;
                case 'D0':
                    this.branchNBytes();
                    break;
                    // case 'EE':
                    this.incrementByte();
                    this.incrementPcBy(3);
                    break;
                case 'FF':
                    this.systemCall();
                    this.incrementPcBy(1);
                    break;
                default:
                    _StdOut.putText("INVALID");
                    //_StdOut.advanceLine();
                    this.incrementPcBy(1);
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
        Cpu.prototype.addsWithCarry = function () {
            //retrieves the contents at the given address (in hex)
            var content = _MemoryManager.memory.memoryBlocks[this.hexToDec(this.getNextByte())];
            //retrievs content of accumulater (in hex)
            var acc = _currentPcb.acc;
            //converts the two num to dec and adds them
            var result = this.hexToDec(content) + this.hexToDec(acc);
            //formats correctly (changes to hex, then to uppercase, and adds "0" if neccessary)
            var formattedResult = this.decToHex(result).toUpperCase();
            if (formattedResult.length < 2) {
                formattedResult = "0" + formattedResult;
            }
            //loads results back into accumulater
            _currentPcb.acc = formattedResult;
            // _StdOut.putText("Adds with carry");
            // _StdOut.advanceLine();
        };
        //A2 - LDX
        //Loads the X register with a constant
        Cpu.prototype.loadXWithConstant = function () {
            //loads given constant in x register
            _currentPcb.xreg = this.getNextByte();
            // _StdOut.putText("Loads X register with constant");
            // _StdOut.advanceLine();
        };
        //AE - LDX
        //Loads the X register from memory
        Cpu.prototype.loadXFromMemory = function () {
            //loads content at given address in x register
            _currentPcb.xreg = _MemoryManager.memory.memoryBlocks[this.hexToDec(this.getNextByte())];
            // _StdOut.putText("Load X register from memory");
            //  _StdOut.advanceLine();
        };
        //A0 - LDY
        //Loads Y register with a constant
        Cpu.prototype.loadYWithConstant = function () {
            //loads given constant in y register
            _currentPcb.yreg = this.getNextByte();
            // _StdOut.putText("Loads Y register with constant");
            // _StdOut.advanceLine();
        };
        //AC -LDY
        //Loads the X register from memory
        Cpu.prototype.loadYFromMemory = function () {
            //loads content at given address in y register  f
            _currentPcb.yreg = _MemoryManager.memory.memoryBlocks[this.hexToDec(this.getNextByte())];
            // _StdOut.putText("Load Y register from memory");
            // _StdOut.advanceLine();
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
        Cpu.prototype.compareMemoryToX = function () {
            //retrieves the contents at the given address (in hex)
            var content = _MemoryManager.memory.memoryBlocks[this.hexToDec(this.getNextByte())];
            //convert cotent to decimal
            var decContent = this.hexToDec(content);
            // convert content in x register to decimal
            var decXReg = this.hexToDec(_currentPcb.xreg);
            //compares two decimal nums for equality
            //if equal. sets z flag to 01
            if (decContent == decXReg) {
                _currentPcb.zflag = "01";
            }
            else {
                _currentPcb.zflag = "00";
            }
            //_StdOut.putText("Compares Memory to X");
            //_StdOut.advanceLine();
        };
        //D0 - BNE
        //Branch n bytes if Z flag = "00"
        Cpu.prototype.branchNBytes = function () {
            //checks to see if z flag is set to "00"
            if (_currentPcb.zflag == "00") {
                //retrieves the contents at the given address (in hex)
                var content = _MemoryManager.memory.memoryBlocks[this.hexToDec(this.getNextByte())];
                //convert cotent to decimal
                var decContent = this.hexToDec(content);
                //jumps current pc to given address + current pc mod 256 ???
                _currentPcb.pc = (_currentPcb.pc + decContent) % 256;
            }
            //_StdOut.putText("Branches N bytes if Z flag = 0");
            // _StdOut.advanceLine();
        };
        //EE - INC
        //Increment the value of a byte at a given address in memory
        Cpu.prototype.incrementByte = function () {
            //retrieves the contents at the given address (in hex)
            var content = _MemoryManager.memory.memoryBlocks[this.hexToDec(this.getNextByte())];
            //change content to decimal and add one
            var incremented = this.hexToDec(content) + 1;
            //convert back to hex and load back into register
            _MemoryManager.memory.memoryBlocks[this.hexToDec(this.getNextByte())] = this.decToHex(incremented);
            // _StdOut.putText("Increment Byte");
            //_StdOut.advanceLine();
        };
        //FF - SYS
        //System Call
        // if "01" is in X reg, then print integer stored in Y register
        // if "02" is in X reg, print the 00-terminated string stored at the address in the Y register
        Cpu.prototype.systemCall = function () {
            //checks if x reg is "01"
            //if so, prints y reg integer to console
            if (_currentPcb.xreg == "01") {
                _StdOut.putText(_currentPcb.yreg);
                _StdOut.advanceLine();
            }
            //TODO not quite sure what this should do
            if (_currentPcb.xreg == "02") {
                _StdOut.putText(_currentPcb.yreg);
                _StdOut.advanceLine();
            }
            _StdOut.putText("System Call");
            _StdOut.advanceLine();
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
