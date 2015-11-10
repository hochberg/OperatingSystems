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
            //set Round Robin for all to be true
            this.isRoundRobin = true;
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
            if(_currentPcb==null){
                _currentPcb = _readyQueue[0];
             _readyQueue[0].state = "Running";
                            
            }

            console.log(_currentPcb.pid);
            console.log(_currentPcb );
            console.log(_CPU);
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
            console.log("Fetch =" + (parseInt(_currentPcb.base) + currentPC));
            //fetchs the op code at the current process code in the pcb
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
            //loads acc with the next element in instruction array
            this.Acc = this.getNextByte();
        }

        //AD - LDA
        //Loads accumulater from memory
        public loadAccFromMemory() {
            //get next two bits (taking base into account)
            var firstBit = _MemoryManager.memory.memoryBlocks[this.PC + 1 + parseInt(_currentPcb.base)];
            var nextBit = _MemoryManager.memory.memoryBlocks[this.PC + 2 + parseInt(_currentPcb.base)];
            //gets address in memory in little endian
            var address = nextBit + firstBit;
            //translate that address from hex to decimal
            var decAddress = (this.hexToDec(address) + _currentPcb.base);
            //sets accumulater to content from memory
            this.Acc = _MemoryManager.memory.memoryBlocks[decAddress];

        }

        //8D - STA
        //Stores accumulater in memory
        public storeAccInMemory() {
            //get next two bits (taking base into account)
            var firstBit = _MemoryManager.memory.memoryBlocks[this.PC + 1 + parseInt(_currentPcb.base)];
            var nextBit =  _MemoryManager.memory.memoryBlocks[this.PC + 2 + parseInt(_currentPcb.base)];
            //gets address in memory in little endian
            var address = nextBit+firstBit;
            //translate that address from hex to decimal
            var decAddress = (this.hexToDec(address)+ _currentPcb.base);
            //TODO not sure this handles every out of bounds case
            if (decAddress > 255) {
                _StdOut.putText("Memory out of bounds. Program Killed.");
                _KernelInterruptQueue.enqueue(new Interrupt(KILL_IRQ, "Kill"));
            } else {
                //sets contents of that address to accumulater
                _MemoryManager.memory.memoryBlocks[decAddress] = this.Acc;
            }

        }

        //6D - ADC
        //Adds content of given address to the contents of the accumulater
        //and keeps results in accumulater
        public addsWithCarry() {
            //get next two bits (taking base into account)
            var firstBit = _MemoryManager.memory.memoryBlocks[this.PC + 1 + parseInt(_currentPcb.base)];
            var nextBit =  _MemoryManager.memory.memoryBlocks[this.PC + 2 + parseInt(_currentPcb.base)];
            //gets address in memory in little endian
            var address = nextBit+firstBit;
            //get the address in decimal with base added
            var decAddress = (this.hexToDec(address)+ _currentPcb.base);
            //retrieves the contents at the given address (in hex)
            var content = _MemoryManager.memory.memoryBlocks[decAddress];
            //retrieves content of accumulater (in hex)
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

        }

        //AE - LDX
        //Loads the X register from memory
        public loadXFromMemory() {
            //get next two bits (taking base into account)
            var firstBit = _MemoryManager.memory.memoryBlocks[this.PC + 1 + parseInt(_currentPcb.base)];
            var nextBit =  _MemoryManager.memory.memoryBlocks[this.PC + 2 + parseInt(_currentPcb.base)];
            //gets address in memory in little endian
            var address = nextBit+firstBit;

            //loads content at given address in x register
            this.Xreg = _MemoryManager.memory.memoryBlocks[this.hexToDec(address) + parseInt(_currentPcb.base)];
 
        }

        //A0 - LDY
        //Loads Y register with a constant
        public loadYWithConstant() {
            //loads given constant in y register
            this.Yreg = this.getNextByte();
        }

        //AC -LDY
        //Loads the X register from memory
        public loadYFromMemory() {
            //get next two bits (taking base into account)
            var firstBit = _MemoryManager.memory.memoryBlocks[this.PC + 1 + parseInt(_currentPcb.base)];
            var nextBit =  _MemoryManager.memory.memoryBlocks[this.PC + 2 + parseInt(_currentPcb.base)];
            //gets address in memory in little endian
             var address = nextBit+firstBit;
            //loads content at given address in x register
            this.Yreg = _MemoryManager.memory.memoryBlocks[this.hexToDec(address) + parseInt(_currentPcb.base)];

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
            

            //if end of ready queue
            if (_readyQueue.length==0) { 
                //starts executing cycle
                _CPU.isExecuting = false;
                //returns prompt on new line
                _OsShell.putPrompt();
                //if in Single Step mode, stops Single Step when break-ed
                if (_CPU.isSingleStep) {
                    TSOS.Control.hostBtnSingleStepStop_click((<HTMLButtonElement>document.getElementById("btnSingleStepStop")));
                    //reset PC
                    _CPU.PC = 0;
                }
                //in Round Robin
            } else {
                //checks if all processes have finished
                if (_readyQueue.length == 0) {
                    _CPU.isExecuting = false;
                //if not
                } else {
                    //stores index of current pcb (to remove from Ready Queue after context switching)
                    var tempPcbIndex;
                    for (var i = 0; _readyQueue.length > i; i++) {
                        if (_currentPcb.pid == _readyQueue[i].pid) {
                            i = tempPcbIndex;
                            console.log(tempPcbIndex);
                            i = i + 42;
                        }
                    }
                    //moves to next process
                    _cpuScheduler.contextSwitch();
                    //removes finished process form ready queue
                    _readyQueue.splice(tempPcbIndex, 1);
                }
                    //prints current pcb 
                    _Display.printFullReadyQueue();

            }
            }
        

        //EC - CPX
        //Compares a byte at a given location in memory to X register
        //if they are equals, sets Z flag to "01", if not sets Z flag to "00"
        public compareMemoryToX() {
            //get next two bits (taking base into account)
            var firstBit = _MemoryManager.memory.memoryBlocks[this.PC + 1 + parseInt(_currentPcb.base)];
            var nextBit =  _MemoryManager.memory.memoryBlocks[this.PC + 2 + parseInt(_currentPcb.base)];
            //gets address in memory in little endian
            var address = nextBit+firstBit;
            //retrieves the contents at the given address (in hex)
            var content = _MemoryManager.memory.memoryBlocks[this.hexToDec(address) + parseInt(_currentPcb.base)];
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
            //convert content to decimal
            var decContent = this.hexToDec(_MemoryManager.memory.memoryBlocks[this.PC + 1 + parseInt(_currentPcb.base)]);
            //jumps current pc to given address + current pc - 256
            //wrap around
                if ((_CPU.PC + decContent) > 256 ) {
                    _CPU.PC = (_CPU.PC + decContent) - 256;
              }else{
                  _CPU.PC = decContent + _CPU.PC;
              } 
            }
        }

        //EE - INC
        //Increment the value of a byte at a given address in memory
        public incrementByte() {
            //get next two bits (taking base into account)
            var firstBit = _MemoryManager.memory.memoryBlocks[this.PC + 1 + parseInt(_currentPcb.base)];
            var nextBit =  _MemoryManager.memory.memoryBlocks[this.PC + 2 + parseInt(_currentPcb.base)];
            //gets address in memory in little endian
            var address = nextBit+firstBit;
            //retrieves the contents at the given address (in hex)
            var content = _MemoryManager.memory.memoryBlocks[this.hexToDec(address) + parseInt(_currentPcb.base)];
            //change content to decimal and add one
            var incremented = this.hexToDec(content) + 1;
            //convert back to hex and load back into register
           _MemoryManager.memory.memoryBlocks[this.hexToDec(address) + parseInt(_currentPcb.base)] = this.decToHex(incremented);
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
                var currentCharCode = this.hexToDec(_MemoryManager.memory.memoryBlocks[currentLoc+parseInt(_currentPcb.base)]);
                
                //checks if non-zero elements are at given address, boolean value
                var nonZeroCode = !(currentCharCode === 0);

                //checks to see if next byte should terminate
                while (nonZeroCode){
                //concates char translated into ascii to string
                asciiString = asciiString + String.fromCharCode(Number(currentCharCode));
               
                //furthers counter, current location and current code 
                charCounter = charCounter + 1;
                currentLoc = this.hexToDec(this.Yreg) + charCounter;
                currentCharCode = this.hexToDec(_MemoryManager.memory.memoryBlocks[currentLoc+parseInt(_currentPcb.base)]);
                 
                //if next code isn't set, changes boolean to exit loop
                if (currentCharCode === 0) {
                    nonZeroCode = false;
                }
               }
                  //prints string
                 _StdOut.putText(asciiString);
                   
            }
                _StdOut.advanceLine();

        }


        }
    }
