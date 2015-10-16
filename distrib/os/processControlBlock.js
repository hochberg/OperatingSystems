///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="../host/control.ts" />
///<reference path="shell.ts" />
/* ------------
   processControlBlock.ts

   PCB yo
   ------------ */
var TSOS;
(function (TSOS) {
    var ProcessControlBlock = (function () {
        function ProcessControlBlock(pid, pc, acc, xreg, yreg, zflag, ir) {
            if (pid === void 0) { pid = null; }
            if (pc === void 0) { pc = null; }
            if (acc === void 0) { acc = null; }
            if (xreg === void 0) { xreg = null; }
            if (yreg === void 0) { yreg = null; }
            if (zflag === void 0) { zflag = null; }
            if (ir === void 0) { ir = null; }
            this.pid = pid;
            this.pc = pc;
            this.acc = acc;
            this.xreg = xreg;
            this.yreg = yreg;
            this.zflag = zflag;
            this.ir = ir;
        }
        ProcessControlBlock.prototype.init = function () {
            //initializes instance of PCB with CPU values
            this.pid = _pcbArray.length - 1;
            this.pc = 0;
            this.acc = 0;
            this.xreg = 0;
            this.yreg = 0;
            this.zflag = 0;
            this.ir = "";
        };
        ;
        ProcessControlBlock.prototype.printPCB = function () {
            //retrieves pcb contents
            var printPc = document.getElementById("pcStatusDisplay");
            var printAcc = document.getElementById("accStatusDisplay");
            var printXr = document.getElementById("xrStatusDisplay");
            var printYr = document.getElementById("yrStatusDisplay");
            var printZf = document.getElementById("zfStatusDisplay");
            var printIr = document.getElementById("irStatusDisplay");
            //prints content to screen
            printPc.innerHTML = this.pc;
            printAcc.innerHTML = this.acc;
            printXr.innerHTML = this.xreg;
            printYr.innerHTML = this.yreg;
            printZf.innerHTML = this.zflag;
            printIr.innerHTML = this.ir;
        };
        ;
        return ProcessControlBlock;
    })();
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
