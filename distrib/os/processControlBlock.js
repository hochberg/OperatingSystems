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
        function ProcessControlBlock(pid, pc, acc, xreg, yreg, zflag, ir, base, limit, state, priority) {
            if (pid === void 0) { pid = null; }
            if (pc === void 0) { pc = null; }
            if (acc === void 0) { acc = null; }
            if (xreg === void 0) { xreg = null; }
            if (yreg === void 0) { yreg = null; }
            if (zflag === void 0) { zflag = null; }
            if (ir === void 0) { ir = null; }
            if (base === void 0) { base = null; }
            if (limit === void 0) { limit = null; }
            if (state === void 0) { state = null; }
            if (priority === void 0) { priority = null; }
            this.pid = pid;
            this.pc = pc;
            this.acc = acc;
            this.xreg = xreg;
            this.yreg = yreg;
            this.zflag = zflag;
            this.ir = ir;
            this.base = base;
            this.limit = limit;
            this.state = state;
            this.priority = priority;
        }
        ProcessControlBlock.prototype.init = function () {
            //initializes instance of PCB with CPU values
            this.pid = _pidCount++;
            this.pc = 0;
            this.acc = 0;
            this.xreg = 0;
            this.yreg = 0;
            this.zflag = 0;
            this.ir = "";
            this.base = 0;
            this.limit = 0;
            this.state = "New";
            //initalized to 5
            this.priority = 5;
        };
        ;
        return ProcessControlBlock;
    })();
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
