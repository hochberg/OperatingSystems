///<reference path="../globals.ts" />
///<reference path="../host/control.ts" />




/* ------------
     cpuScheduler.ts

     Requires globals.ts

     Schedules that CPU jazz.
     ------------ */

module TSOS {

    export class cpuScheduler {
          

        public contextSwitch(): void {

            var readyQueueLength = _readyQueue.length;
            console.log(readyQueueLength);
            //checks to see if only one pcb is in ready queue
            if (readyQueueLength > 1) {
                //if more than one
 console.log(readyQueueLength+"pf");
                for (var i = 0; readyQueueLength > i; i++) {
                    //once current pcb is found
 console.log(readyQueueLength+ "dsia");
 console.log(_currentPcb.pid) ;
 console.log(_readyQueue[i].pid) ;

                    if (_currentPcb.pid == _readyQueue[i].pid) {
                        console.log("man");
                        //if pcb is last in readyQueue
                        if (i == (readyQueueLength - 1)) {
                            console.log("man");
                            console.log(i);
                            //then cycyle back to first pcb
                            _currentPcb = _readyQueue[0];
                            _CPU.PC = _currentPcb.pc;
                            _CPU.Acc = _currentPcb.acc;
                            _CPU.Xreg = _currentPcb.xreg;
                            _CPU.Yreg = _currentPcb.yreg;
                            _CPU.Zflag = _currentPcb.zflag;
                            _CPU.IR = _currentPcb.ir;

            
                            //and end for loop
                            i = i + 42;

                            //if current pcb is not last
                        } else {
                            //then move to next pcb
                            console.log("duude");
                            console.log(_readyQueue[i + 1]);
                            _currentPcb = _readyQueue[i + 1];
                             _CPU.PC = _currentPcb.pc;
                            _CPU.Acc = _currentPcb.acc;
                            _CPU.Xreg = _currentPcb.xreg;
                            _CPU.Yreg = _currentPcb.yreg;
                            _CPU.Zflag = _currentPcb.zflag;
                            _CPU.IR = _currentPcb.ir;

                            //and end for loop
                            i = i + 42;
                        }
                    }
                }

            }
        }

    
                  }
    }
 
