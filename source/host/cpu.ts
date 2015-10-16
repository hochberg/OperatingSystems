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
                    public IR: number = 0,
                    public isExecuting: boolean = false
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
        }

        public printCPU(): void {
            //retrieve ids of pcb display
            var printPc = document.getElementById("pcCPUDisplay");
            var printIr = document.getElementById("irStatusDisplay");
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
            console.log(_currentPcb);
            this.execute(currentCode);
            _MemoryManager.printMemory();
            this.printCPU();

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
            console.log(_MemoryManager.memory.memoryBlocks[currentPC]);
            return _MemoryManager.memory.memoryBlocks[currentPC];
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
                 case 'EE':
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
            this.IR = currentCode; 


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
            return _MemoryManager.memory.memoryBlocks[this.PC + 1];
        }

        //get next next byte
        public getNextNextByte(){
            return _MemoryManager.memory.memoryBlocks[this.PC + 2];
        }

        //A9 - LDA
        //Loads accumulater with constant
        public loadAccWithConstant() {
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
            // _StdOut.putText("Adds with carry");
            // _StdOut.advanceLine();
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
            _StdOut.putText("No Operation");
            _StdOut.advanceLine();
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
            _currentPcb.ir = this.IR;
            _currentPcb.printPCB();
            
             //starts executing cycle
            _CPU.isExecuting = false;
           // _StdOut.putText("Complete");
           // _StdOut.advanceLine();
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
                _currentPcb.zflag = "01";
            }else{//if not equal, set z flag to "00"
                this.Zflag = 0 ;
            }
            //_StdOut.putText("Compares Memory to X");
            //_StdOut.advanceLine();
        }

        //D0 - BNE
        //Branch n bytes if Z flag = "00"
        public branchNBytes() {
            //checks to see if z flag is set to "00"
            if(this.Zflag.toString() == "00"){
            //retrieves the contents at the given address (in hex)
            var content = _MemoryManager.memory.memoryBlocks[this.hexToDec(this.getNextByte())];
            //convert cotent to decimal
            var decContent = this.hexToDec(content);
            //jumps current pc to given address + current pc mod 256 ???
            _currentPcb.pc = (_currentPcb.pc + decContent) % 256;
           
            }
            //_StdOut.putText("Branches N bytes if Z flag = 0");
           // _StdOut.advanceLine();
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
                _StdOut.putText(_currentPcb.yreg);
                _StdOut.advanceLine();
            }
            //TODO not quite sure what this should do
            if (this.Xreg.toString() == "02"){
                var asciiString = "";
                var charCounter = 0;

                var currentLoc = (this.hexToDec(this.Yreg));
                var currentCharCode = (_MemoryManager.memory.memoryBlocks[currentLoc]);
                
                var nonZeroCode = !(currentCharCode === "00");
                //var nonZeroCode = true;

                //checks to see if next byte should terminate
                while (nonZeroCode){
                 //  for (var i = 0; 4 > i; i++) {

                //chages y reg to decimal, adds sys counter and finds location of code in memory
              
                asciiString = asciiString + String.fromCharCode(Number(currentCharCode));
                charCounter = charCounter + 1;
                currentLoc = this.hexToDec(this.Yreg) + charCounter;
                currentCharCode = (_MemoryManager.memory.memoryBlocks[currentLoc]);
                console.log((currentCharCode));



                if (currentCharCode === "00") {

                    nonZeroCode = false;

                    console.log("here");
                }
            
               

               }

                 _StdOut.putText(asciiString);
                 _StdOut.advanceLine();
                   
            }
        }




    }
}
