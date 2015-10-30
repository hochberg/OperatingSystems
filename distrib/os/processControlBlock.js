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
        function ProcessControlBlock(pid, pc, acc, xreg, yreg, zflag, ir, base, limit) {
            if (pid === void 0) { pid = null; }
            if (pc === void 0) { pc = null; }
            if (acc === void 0) { acc = null; }
            if (xreg === void 0) { xreg = null; }
            if (yreg === void 0) { yreg = null; }
            if (zflag === void 0) { zflag = null; }
            if (ir === void 0) { ir = null; }
            if (base === void 0) { base = null; }
            if (limit === void 0) { limit = null; }
            this.pid = pid;
            this.pc = pc;
            this.acc = acc;
            this.xreg = xreg;
            this.yreg = yreg;
            this.zflag = zflag;
            this.ir = ir;
            this.base = base;
            this.limit = limit;
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
        };
        ;
        ProcessControlBlock.prototype.printFullReadyQueue = function () {
            var pcbTable = document.getElementById("pcbReadyQueueTable");
            var pcbTableLength = pcbTable.getElementsByTagName("tr").length;
            //first clear
            for (var i = 1; pcbTableLength > i; i++) {
                pcbTable.deleteRow(i);
            }
            for (var i = 0; _readyQueue.length > i; i++) {
                this.printOneReadyQueue(_readyQueue[i]);
            }
        };
        ProcessControlBlock.prototype.printOneReadyQueue = function (pcb) {
            //gets table
            var pcbTable = document.getElementById("pcbReadyQueueTable");
            var pcbTableLength = pcbTable.getElementsByTagName("tr").length;
            console.log(pcbTableLength);
            var pcbRow = pcbTable.insertRow(pcbTableLength);
            var printPidCell = pcbRow.insertCell(0);
            var printPcCell = pcbRow.insertCell(1);
            var printIrCell = pcbRow.insertCell(2);
            var printAccCell = pcbRow.insertCell(3);
            var printXCell = pcbRow.insertCell(4);
            var printYCell = pcbRow.insertCell(5);
            var printZCell = pcbRow.insertCell(6);
            var printBaseCell = pcbRow.insertCell(7);
            var printLimitCell = pcbRow.insertCell(8);
            printPidCell.innerHTML = pcb.pid;
            printPcCell.innerHTML = pcb.pc;
            printIrCell.innerHTML = pcb.ir;
            printAccCell.innerHTML = pcb.acc;
            printXCell.innerHTML = pcb.xreg;
            printYCell.innerHTML = pcb.yreg;
            printZCell.innerHTML = pcb.zflag;
            printBaseCell.innerHTML = pcb.base;
            printLimitCell.innerHTML = pcb.limit;
        };
        ;
        ProcessControlBlock.prototype.printFullResidentList = function () {
            var pcbTable = document.getElementById("pcbResidentListTable");
            var pcbTableLength = pcbTable.getElementsByTagName("tr").length;
            //first clear
            for (var i = 1; pcbTableLength > i; i++) {
                pcbTable.deleteRow(i);
            }
            for (var i = 0; _residentList.length > i; i++) {
                this.printOneResidentList(_residentList[i]);
            }
        };
        ProcessControlBlock.prototype.printOneResidentList = function (pcb) {
            //gets table
            var pcbTable = document.getElementById("pcbResidentListTable");
            var pcbTableLength = pcbTable.getElementsByTagName("tr").length;
            console.log(pcbTableLength);
            var pcbRow = pcbTable.insertRow(pcbTableLength);
            var printPidCell = pcbRow.insertCell(0);
            var printPcCell = pcbRow.insertCell(1);
            var printIrCell = pcbRow.insertCell(2);
            var printAccCell = pcbRow.insertCell(3);
            var printXCell = pcbRow.insertCell(4);
            var printYCell = pcbRow.insertCell(5);
            var printZCell = pcbRow.insertCell(6);
            var printBaseCell = pcbRow.insertCell(7);
            var printLimitCell = pcbRow.insertCell(8);
            printPidCell.innerHTML = pcb.pid;
            printPcCell.innerHTML = pcb.pc;
            printIrCell.innerHTML = pcb.ir;
            printAccCell.innerHTML = pcb.acc;
            printXCell.innerHTML = pcb.xreg;
            printYCell.innerHTML = pcb.yreg;
            printZCell.innerHTML = pcb.zflag;
            printBaseCell.innerHTML = pcb.base;
            printLimitCell.innerHTML = pcb.limit;
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
