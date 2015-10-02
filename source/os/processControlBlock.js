///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="../host/control.ts" />
/* ------------
   processControlBlock.ts

   PCB yo
   ------------ */
var TSOS;
(function (TSOS) {
    var ProcessControlBlock = (function () {
        function ProcessControlBlock(pid, pc, acc, xreg, yreg, zflag) {
            if (pid === void 0) { pid = null; }
            if (pc === void 0) { pc = null; }
            if (acc === void 0) { acc = null; }
            if (xreg === void 0) { xreg = null; }
            if (yreg === void 0) { yreg = null; }
            if (zflag === void 0) { zflag = null; }
            this.pid = pid;
            this.pc = pc;
            this.acc = acc;
            this.xreg = xreg;
            this.yreg = yreg;
            this.zflag = zflag;
        }
        ProcessControlBlock.prototype.init = function () {
            this.pid = 0;
            this.pc = _CPU.PC;
            this.acc = _CPU.Acc;
            this.xreg = _CPU.Xreg;
            this.yreg = _CPU.Yreg;
            this.zflag = _CPU.Zflag;
            console.log(this.pc);
        };
        ;
        ProcessControlBlock.prototype.printPCB = function () {
            var printPc = document.getElementById("pcStatusDisplay");
            //var printIr = document.getElementById("irStatusDisplay");
            var printAcc = document.getElementById("accStatusDisplay");
            var printXr = document.getElementById("xrStatusDisplay");
            var printYr = document.getElementById("yrStatusDisplay");
            printPc.innerHTML = this.pc;
            //printIr.innerHTML = this.ir;
            printAcc.innerHTML = this.acc;
            printXr.innerHTML = this.xreg;
            printYr.innerHTML = this.yreg;
        };
        ;
        return ProcessControlBlock;
    })();
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
