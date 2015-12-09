///<reference path="../globals.ts" />
///<reference path="../host/control.ts" />
///<reference path="../shell.ts" />



/* ------------
     cpuScheduler.ts

     Requires globals.ts

     Schedules that CPU jazz.
     ------------ */

module TSOS {

    export class cpuScheduler {
          

        public contextSwitchRR(): void {
            
            var readyQueueLength = _readyQueue.length;
           // console.log(_readyQueue);
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

                            //if current pcb is not last
                        } else {
                            //then move to next pcb
                            _currentPcb = _readyQueue[i + 1];
                           // console.log(_currentPcb);
                            //changes cpu to new current pcb 
                            this.insertPcbValuesIntoCpu();
                            //and end for loop
                            i = i + 42;
                        }
                    }
                }
            }
        }

        public contextSwitchPriority(): void {
            //finds length of readyQueue
            var readyQueueLength = _readyQueue.length;

                //builds temp array to sort pcbs
                var tempSortedArray = [];

                //pushes each elemnt of readyqueue to temp
                for (var i = 0; readyQueueLength > i; i++) {
                    tempSortedArray.push(_readyQueue[i]);
                }

                //sort all processes in readyqueue based on priority
                tempSortedArray.sort(function(a, b) { return a.priority - b.priority });

                //sets current pcb to the one with highest priority
                _currentPcb = tempSortedArray[0];

                //changes cpu to new current pcb 
                this.insertPcbValuesIntoCpu();

            
        }

        public insertPcbValuesIntoCpu(): void {
            //console.log(_currentPcb);
            _CPU.PC = _currentPcb.pc;
            _CPU.Acc = _currentPcb.acc;
            _CPU.Xreg = _currentPcb.xreg;
            _CPU.Yreg = _currentPcb.yreg;
            _CPU.Zflag = _currentPcb.zflag;
            _CPU.IR = _currentPcb.ir;
        }


    }
}
 
