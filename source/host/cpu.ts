///<reference path="../globals.ts" />
///<reference path="control.ts" />

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
                    public IR: number = 0,
                    public isExecuting: boolean = false,
                    public isSingleStep: boolean = false,
                    public isRoundRobin: boolean = false
                    //,
                    //   public scCount: number = 0 //used to next line only once more,
                                                   //regardless of how many system calls are executed TEST

                    ) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.IR = 0;
            this.isExecuting = false;
            this.isSingleStep = false;
            this.isRoundRobin = false;
          //  this.scCount = 0;
        }

//moved to control
        public printCPU(): void {

            //retrieve ids of pcb display
            var printPc = document.getElementById("pcCPUDisplay");
            var printIr = document.getElementById("irCPUDisplay");
            var printAcc = document.getElementById("accCPUDisplay");
            var printXr = document.getElementById("xrCPUDisplay");
            var printYr = document.getElementById("yrCPUDisplay");
            var printZf = document.getElementById("zfCPUDisplay");

           //print cpu values to string
           printPc.innerHTML = this.PC.toString();
           printIr.innerHTML = this.IR.toString();
           printAcc.innerHTML = this.Acc.toString();
           printXr.innerHTML = this.Xreg.toString();
           printYr.innerHTML = this.Yreg.toString();
           printZf.innerHTML = this.Zflag.toString();
                      };

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            //FETCH
            var currentCode = this.fetch(this.PC);
            this.execute(currentCode);
            _MemoryManager.printMemory();
            this.printCPU();
             _Display.printFullReadyQueue();
            //_currentPcb.printResidentList()

            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        }
        //increment pc
        public incrementPcBy(num){
            this.PC = this.PC + num;

        }

        //get commands 
        public fetch(currentPC){
            //fetchs the op code at the current process code in the pcb
            //TODO maybe???
            console.log(_currentPcb+ "here");
            console.log(_currentPcb.base+ "here");
            console.log("yo"+_MemoryManager.memory.memoryBlocks[currentPC + parseInt(_currentPcb.base)]);
            return _MemoryManager.memory.memoryBlocks[currentPC+parseInt(_currentPcb.base)];
        }

        //decode and execute
        public execute(currentCode){
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
                case 'EA':
                    this.noOperation();
                    this.incrementPcBy(1);
                    break;
                 case '00':
                     this.break();

                    break;
                case 'EC':
                    this.compareMemoryToX();
                    this.incrementPcBy(3);
                    break;
                case 'D0':
                    this.branchNBytes();
                    this.incrementPcBy(2);
                    break;
                 case 'EE':
                    this.incrementByte();
                    this.incrementPcBy(3);
                    break;
                case 'FF':
                    this.systemCall();
                    this.incrementPcBy(1);
                    break;
 
                default:
                    _StdOut.putText("INVALID: " + currentCode);
                   //_StdOut.advanceLine();
                   this.incrementPcBy(1);
                    
                    break;
            }
            this.IR = currentCode;

            //update current PCB
            _currentPcb.acc = this.Acc;
            _currentPcb.pc = this.PC;
            _currentPcb.xreg = this.Xreg;
            _currentPcb.yreg = this.Yreg;
            _currentPcb.zflag = this.Zflag;
            _currentPcb.ir = this.IR;

        }



        //converts a num in hex to decimal equivalent
        public hexToDec(hex){
           return parseInt(hex, 16);
        }

       //converts a num in decimal to hex equivalent
        public decToHex(dec){
           return dec.toString(16);
        }

        //get next byte
        public getNextByte(){
            return _MemoryManager.memory.memoryBlocks[this.PC + 1 +parseInt(_currentPcb.base)];
        }

        //get next next byte
        public getNextNextByte(){
            return _MemoryManager.memory.memoryBlocks[this.PC + 2 + parseInt(_currentPcb.base)];
        }

        //A9 - LDA
        //Loads accumulater with constant
        public loadAccWithConstant() {
            console.log(this.getNextByte()+"bro");
            //loads acc with the next element in instruction array
            this.Acc = this.getNextByte();
          //  _StdOut.putText("Load acc with constant");
         //   _StdOut.advanceLine();
        }

        //AD - LDA
        //Loads accumulater from memory
        public loadAccFromMemory() {
            //retrieves memory address (after being translated into "little-endian")
            var address = this.getNextNextByte() + this.getNextByte();
            //changes address from hex to decimal
            var decAddress = this.hexToDec(address);
            //sets accumulater to content from memory
            this.Acc = _MemoryManager.memory.memoryBlocks[decAddress];
            //_StdOut.putText("Load acc from memory");
            //_StdOut.advanceLine();

        }

        //8D - STA
        //Stores accumulater in memory
        public storeAccInMemory() {
            //gets address in memory in little endian
            var address = this.getNextNextByte() + this.getNextByte();
            //translate that address from hex to decimal
            var decAddress = this.hexToDec(address);
            //sets contents of that address to accumulater
            _MemoryManager.memory.memoryBlocks[decAddress] = this.Acc;
           // _StdOut.putText("Store acc in memory");
           // _StdOut.advanceLine();
        }

        //6D - ADC
        //Adds content of given address to the contents of the accumulater
        //and keeps results in accumulater
        public addsWithCarry() {
            //retrieves the contents at the given address (in hex)
            var content = _MemoryManager.memory.memoryBlocks[this.hexToDec(this.getNextByte())];
            //retrievs content of accumulater (in hex)
            var acc = this.Acc; 
            //converts the two num to dec and adds them
            var result = this.hexToDec(content) + this.hexToDec(acc);
            //formats correctly (changes to hex, then to uppercase, and adds "0" if neccessary)
            var formattedResult = this.decToHex(result).toUpperCase();
            if (formattedResult.length < 2){formattedResult= "0"+ formattedResult}
            //loads results back into accumulater
            this.Acc = formattedResult;
        }

        //A2 - LDX
        //Loads the X register with a constant
        public loadXWithConstant() {
            //loads given constant in x register
           this.Xreg = this.getNextByte();
           // _StdOut.putText("Loads X register with constant");
           // _StdOut.advanceLine();
        }

        //AE - LDX
        //Loads the X register from memory
        public loadXFromMemory() {
            //loads content at given address in x register
            this.Xreg = _MemoryManager.memory.memoryBlocks[this.hexToDec(this.getNextByte())];
           // _StdOut.putText("Load X register from memory");
          //  _StdOut.advanceLine();
        }

        //A0 - LDY
        //Loads Y register with a constant
        public loadYWithConstant() {
            //loads given constant in y register
            this.Yreg = this.getNextByte();
           // _StdOut.putText("Loads Y register with constant");
           // _StdOut.advanceLine();
        }

        //AC -LDY
        //Loads the X register from memory
        public loadYFromMemory() {
            //loads content at given address in y register  f
            this.Yreg = _MemoryManager.memory.memoryBlocks[this.hexToDec(this.getNextByte())];
           // _StdOut.putText("Load Y register from memory");
           // _StdOut.advanceLine();

        }
        //EA - NOP
        // performs no operation
        public noOperation() {
            //TODO
            this.systemCall();
        }

        //00 - BRK
        //Break (really a system call)
        //Set CPU regs to PCBs
        public break() {
            _currentPcb.acc = this.Acc;
            _currentPcb.pc = this.PC;
            _currentPcb.xreg = this.Xreg;
            _currentPcb.yreg = this.Yreg;
            _currentPcb.zflag = this.Zflag;
            //TODO maybe
            _currentPcb.ir = "00";

            //removes pcb from ready queue
            for (var i = 0; _readyQueue.length > i; i++) {
                if (_currentPcb.pid == _readyQueue[i].pid) { 
                    _readyQueue.splice(i, 1);
                }
                //prints current pcb 
                _Display.printFullReadyQueue();
                //starts executing cycle
                _CPU.isExecuting = false;
                //returns prompt on new line
                _OsShell.putPrompt();

                //if in Single Step mode, stops Single Step when break-ed
                if (_CPU.isSingleStep) {
                    TSOS.Control.hostBtnSingleStepStop_click((<HTMLButtonElement>document.getElementById("btnSingleStepStop")));

                    //reinitializes system call count
                    // this.scCount = 0;

                    //reset PC
                    _CPU.PC = 0;
                }
            }
        }

        //EC - CPX
        //Compares a byte at a given location in memory to X register
        //if they are equals, sets Z flag to "01", if not sets Z flag to "00"
        public compareMemoryToX() {
            //retrieves the contents at the given address (in hex)
            var content = _MemoryManager.memory.memoryBlocks[this.hexToDec(this.getNextByte())];
            //convert cotent to decimal
            var decContent = this.hexToDec(content);
            // convert content in x register to decimal
            var decXReg = this.hexToDec(this.Xreg);
            //compares two decimal nums for equality
            //if equal. sets z flag to 01
            if (decContent == decXReg){
                _CPU.Zflag = 1;
            }else{//if not equal, set z flag to "00"
                this.Zflag = 0 ;
            }
        }

        //D0 - BNE
        //Branch n bytes if Z flag = "00"
        public branchNBytes() {
            //checks to see if z flag is set to "00"
            if(this.Zflag.toString() == "0"){

            //convert cotent to decimal
              var decContent = this.hexToDec(this.getNextByte());
            //jumps current pc to given address + current pc - 256
            //wrap around
              if ((_CPU.PC + decContent) > 256) {
                  _CPU.PC = (_CPU.PC + decContent) - 256;
              }else{
                  _CPU.PC = decContent + _CPU.PC;
              } 
            }
        }

        //EE - INC
        //Increment the value of a byte at a given address in memory
        public incrementByte() {
            //retrieves the contents at the given address (in hex)
            var content = _MemoryManager.memory.memoryBlocks[this.hexToDec(this.getNextByte())];
            //change content to decimal and add one
            var incremented = this.hexToDec(content) + 1;
            //convert back to hex and load back into register
            _MemoryManager.memory.memoryBlocks[this.hexToDec(this.getNextByte())] = this.decToHex(incremented);
           // _StdOut.putText("Increment Byte");
            //_StdOut.advanceLine();
        }

        //FF - SYS
        //System Call
        // if "01" is in X reg, then print integer stored in Y register
        // if "02" is in X reg, print the 00-terminated string stored at the address in the Y register
        public systemCall() {
            //checks if x reg is "01"
            //if so, prints y reg integer to console
            if (this.Xreg.toString() == "01"){
                //prints y reg in hex
                
                _StdOut.putText((this.hexToDec(this.Yreg)).toString());
              
            }
            //TODO not quite sure what this should do
            if (this.Xreg.toString() == "02"){
                //initialze string to be printed
                var asciiString = ""; 
                //initialize counter to progress through memory address
                var charCounter = 0;
                //current location of code to be read, translated to hex
                var currentLoc = (this.hexToDec(this.Yreg));
                //current code in memory to be read at loc, translted to dec
                var currentCharCode = this.hexToDec(_MemoryManager.memory.memoryBlocks[currentLoc]);
                
                //checks if non-zero elements are at given address, boolean value
                var nonZeroCode = !(currentCharCode === 0);

                //checks to see if next byte should terminate
                while (nonZeroCode){
                //concates char translated into ascii to string
                asciiString = asciiString + String.fromCharCode(Number(currentCharCode));
               
                //furthers counter, current location and current code 
                charCounter = charCounter + 1;
                currentLoc = this.hexToDec(this.Yreg) + charCounter;
                currentCharCode = this.hexToDec(_MemoryManager.memory.memoryBlocks[currentLoc]);
                 
                //if next code isn't set, changes boolean to exit loop
                if (currentCharCode === 0) {
                    nonZeroCode = false;
                }
               }
                  //prints string
                 _StdOut.putText(asciiString);
                   
            }

           // var sysCount = this.sysCallCount();
           //only advances line once if it is the last syscall fired in execution
           //   this.scCount = this.scCount + 1;
           // console.log(this.scCount);
           // console.log(sysCount);
           // if (this.scCount == sysCount) {
                _StdOut.advanceLine();
           //}

            

        }

        //TODO Attempt of a way to keep FF calls on same line,
        //Maybe fix in the future, problem was with loops
        //
        //counts how many System calls are in memory
        //used to advance line only one after a syscall
        // public sysCallCount() {
        //     var count = 0;
        //     for (var i = 0; i < _MemoryManager.memory.memoryBlocks.length; i= i+1) {
        //         if ((_MemoryManager.memory.memoryBlocks[i] == "FF") ||
        //             (_MemoryManager.memory.memoryBlocks[i] == "EA")) {
        //             count++;
        //         }   
        //     }
        //     return count;
        // }




        }
    }
