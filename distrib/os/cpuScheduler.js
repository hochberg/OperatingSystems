///<reference path="../globals.ts" />
///<reference path="../host/control.ts" />
/* ------------
     cpuScheduler.ts

     Requires globals.ts

     Schedules that CPU jazz.
     ------------ */
var TSOS;
(function (TSOS) {
    var cpuScheduler = (function () {
        function cpuScheduler() {
        }
        cpuScheduler.prototype.contextSwitch = function () {
            var readyQueueLength = _readyQueue.length;
            //checks to see if only one pcb is in ready queue
            if (readyQueueLength > 1) {
                //if more than one
                for (var i = 0; readyQueueLength > i; i++) {
                    //once current pcb is found
                    if (_currentPcb.pid == _readyQueue[i].pid) {
                        //if pcb is last in readyQueue
                        if (i == (readyQueueLength - 1)) {
                            //then cycyle back to first pcb
                            _currentPcb = _readyQueue[0];
                            //changes cpu to new current pcb 
                            this.insertPcbValuesIntoCpu();
                            //and end for loop
                            i = i + 42;
                        }
                        else {
                            //then move to next pcb
                            _currentPcb = _readyQueue[i + 1];
                            //changes cpu to new current pcb 
                            this.insertPcbValuesIntoCpu();
                            //and end for loop
                            i = i + 42;
                        }
                    }
                }
            }
        };
        cpuScheduler.prototype.insertPcbValuesIntoCpu = function () {
            _CPU.PC = _currentPcb.pc;
            _CPU.Acc = _currentPcb.acc;
            _CPU.Xreg = _currentPcb.xreg;
            _CPU.Yreg = _currentPcb.yreg;
            _CPU.Zflag = _currentPcb.zflag;
            _CPU.IR = _currentPcb.ir;
        };
        return cpuScheduler;
    })();
    TSOS.cpuScheduler = cpuScheduler;
})(TSOS || (TSOS = {}));
