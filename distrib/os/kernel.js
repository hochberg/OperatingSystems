///<reference path="../globals.ts" />
///<reference path="queue.ts" />
/* ------------
     Kernel.ts

     Requires globals.ts
              queue.ts

     Routines for the Operating System, NOT the host.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    var Kernel = (function () {
        function Kernel() {
        }
        //
        // OS Startup and Shutdown Routines
        //
        Kernel.prototype.krnBootstrap = function () {
            TSOS.Control.hostLog("bootstrap", "host"); // Use hostLog because we ALWAYS want this, even if _Trace is off.
            // Initialize our global queues.
            _KernelInterruptQueue = new TSOS.Queue(); // A (currently) non-priority queue for interrupt requests (IRQs).
            _KernelBuffers = new Array(); // Buffers... for the kernel.
            _KernelInputQueue = new TSOS.Queue(); // Where device input lands before being processed out somewhere.
            // Initialize the console.
            _Console = new TSOS.Console(); // The command line interface / console I/O device.
            _Console.init();
            // Initialize the memory manager
            // _MemoryManager = new MemoryManager();        
            // _MemoryManager.init();
            // Initialize the processControlBlock
            // _ProcessControlBlock = new ProcessControlBlock();        
            // _ProcessControlBlock.init();
            // _ProcessControlBlock.printPCB(); //for now
            // Initialize standard input and output to the _Console.
            _StdIn = _Console;
            _StdOut = _Console;
            // Load the Keyboard Device Driver
            this.krnTrace("Loading the keyboard device driver.");
            _krnKeyboardDriver = new TSOS.DeviceDriverKeyboard(); // Construct it.
            _krnKeyboardDriver.driverEntry(); // Call the driverEntry() initialization routine.
            this.krnTrace(_krnKeyboardDriver.status);
            // Load the File System Device Driver
            this.krnTrace("Loading the file system device driver.");
            _krnFileSystemDriver = new TSOS.DeviceDriverFileSystem(); // Construct it.
            _krnFileSystemDriver.driverEntry(); // Call the driverEntry() initialization routine.
            this.krnTrace(_krnFileSystemDriver.status);
            //
            // ... more?
            //
            // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();
            // Launch the shell.
            this.krnTrace("Creating and Launching the shell.");
            _OsShell = new TSOS.Shell();
            _OsShell.init();
            // Finally, initiate student testing protocol.
            if (_GLaDOS) {
                _GLaDOS.afterStartup();
            }
            //Formates updated date and times for NavBar
            var date = new Date();
            //Gives hours non-military time 
            var hours = date.getHours() % 12;
            //changes hour 0 to hour 12
            if (hours == 0) {
                hours = 12;
            }
            ;
            //decides am or pm
            var dayOrNight = "";
            if (date.getHours() < 12) {
                dayOrNight = "pm";
            }
            else {
                dayOrNight = "am";
            }
            ;
            var minutes = date.getMinutes();
            //adds 0 to minutes less than 10
            var possibleZero = "";
            if (minutes < 10) {
                possibleZero = "0";
            }
            //Writes date and time on NavBar   
            document.getElementById("kernalDateAndTime").innerHTML = hours.toString() + ":" + possibleZero +
                minutes.toString() + " " + dayOrNight + " " + date.toDateString() + " ";
        };
        Kernel.prototype.krnShutdown = function () {
            this.krnTrace("begin shutdown OS");
            // TODO: Check for running processes.  If there are some, alert and stop. Else...
            // ... Disable the Interrupts.
            this.krnTrace("Disabling the interrupts.");
            this.krnDisableInterrupts();
            //
            // Unload the Device Drivers?
            // More?
            //
            // _OsShell.shellClearmem();
            // _readyQueue = [];
            // _residentList = [];
            // _Console.clearScreen();
            this.krnTrace("end shutdown OS");
            clearInterval(_hardwareClockID);
        };
        Kernel.prototype.krnOnCPUClockPulse = function () {
            /* This gets called from the host hardware simulation every time there is a hardware clock pulse.
               This is NOT the same as a TIMER, which causes an interrupt and is handled like other interrupts.
               This, on the other hand, is the clock pulse from the hardware / VM / host that tells the kernel
               that it has to look for interrupts and process them if it finds any.                           */
            // Check for an interrupt, are any. Page 560
            if (_KernelInterruptQueue.getSize() > 0) {
                // Process the first interrupt on the interrupt queue.
                // TODO: Implement a priority queue based on the IRQ number/id to enforce interrupt priority.
                var interrupt = _KernelInterruptQueue.dequeue();
                this.krnInterruptHandler(interrupt.irq, interrupt.params);
            }
            else if (_CPU.isExecuting) {
                //checks to see if round robin is on (DEFAULT)
                if (_CPU.isRoundRobin) {
                    //then cycle
                    _CPU.cycle();
                    //if still going, decrement quantum
                    this.decrementQuantum();
                    //if quantum is done
                    if (_tempQuantum == _quantum) {
                        //call context switch interrupt
                        TSOS.Control.rrInterrupt();
                    }
                }
                else if (_CPU.isFCFS) {
                    //checks to see if Single Step is on
                    if (!(_CPU.isSingleStep)) {
                        //then cycle normally
                        _CPU.cycle();
                    }
                }
                else if (_CPU.isPriority) {
                    //TODO
                    console.log("priority");
                    //checks to see if Single Step is on
                    if (!(_CPU.isSingleStep)) {
                        //then cycle normally
                        _CPU.cycle();
                    }
                }
            }
            else {
                this.krnTrace("Idle");
            }
        };
        //
        // Interrupt Handling
        //
        Kernel.prototype.krnEnableInterrupts = function () {
            // Keyboard
            TSOS.Devices.hostEnableKeyboardInterrupt();
            // Put more here.
        };
        Kernel.prototype.krnDisableInterrupts = function () {
            // Keyboard
            TSOS.Devices.hostDisableKeyboardInterrupt();
            // Put more here.
        };
        Kernel.prototype.krnInterruptHandler = function (irq, params) {
            // This is the Interrupt Handler Routine.  See pages 8 and 560.
            // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on. Page 766.
            this.krnTrace("Handling IRQ~" + irq);
            // Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
            // TODO: Consider using an Interrupt Vector in the future.
            // Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.
            //       Maybe the hardware simulation will grow to support/require that in the future.
            switch (irq) {
                case TIMER_IRQ:
                    this.krnTimerISR(); // Kernel built-in routine for timers (not the clock).
                    break;
                case KEYBOARD_IRQ:
                    _krnKeyboardDriver.isr(params); // Kernel mode device driver
                    _StdIn.handleInput();
                    break;
                case BSOD_IRQ:
                    this.krnTrapError("BSOD");
                    break;
                case KILL_IRQ:
                    //checks if on current process
                    //context switch first
                    if (_currentPcb.pid == _readyQueue[params].pid) {
                        _cpuScheduler.contextSwitchRR();
                        _readyQueue.splice(params, 1);
                    }
                    else {
                        _readyQueue.splice(params, 1);
                        _cpuScheduler.contextSwitchRR();
                    }
                    break;
                case RR_IRQ:
                    _cpuScheduler.contextSwitchRR();
                    break;
                case SWAP_IRQ:
                    _krnFileSystemDriver.swapper();
                    break;
                default:
                    this.krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
            }
        };
        Kernel.prototype.krnTimerISR = function () {
            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
        };
        //
        // System Calls... that generate software interrupts via tha Application Programming Interface library routines.
        //
        // Some ideas:
        // - ReadConsole
        // - WriteConsole
        // - CreateProcess
        // - ExitProcess
        // - WaitForProcessToExit
        // - CreateFile
        // - OpenFile
        // - ReadFile
        // - WriteFile
        // - CloseFile
        //
        // OS Utility Routines
        //
        Kernel.prototype.krnTrace = function (msg) {
            // Check globals to see if trace is set ON.  If so, then (maybe) log the message
            if (_Trace) {
                if (msg === "Idle") {
                    // We can't log every idle clock pulse because it would lag the browser very quickly.
                    if (_OSclock % 10 == 0) {
                        // Check the CPU_CLOCK_INTERVAL in globals.ts for an
                        // idea of the tick rate and adjust this line accordingly.
                        TSOS.Control.hostLog(msg, "OS");
                    }
                }
                else {
                    TSOS.Control.hostLog(msg, "OS");
                }
            }
        };
        Kernel.prototype.krnTrapError = function (msg) {
            TSOS.Control.hostLog("OS ERROR - TRAP: " + msg);
            this.krnShutdown();
            _DrawingContext.fillStyle = "blue";
            _DrawingContext.fillRect(0, 0, _Canvas.width, _Canvas.height);
            clearInterval(_hardwareClockID);
        };
        Kernel.prototype.decrementQuantum = function () {
            //using mallable gloabal quantum
            //if not at end of quantum
            if (_tempQuantum > 1) {
                //subtract 1 from it
                _tempQuantum = _tempQuantum - 1;
            }
            else {
                //if at end, cycle back to beginning of quantum
                //using static global quantum
                _tempQuantum = _quantum;
            }
        };
        return Kernel;
    })();
    TSOS.Kernel = Kernel;
})(TSOS || (TSOS = {}));
