///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="display.ts" />
/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
            this.commandHistory = []; //yes sir
            this.currentCommand = ""; //yes sir
            this.commandHistoryIndex = 0; //yes sir
        }
        Shell.prototype.init = function () {
            var sc;
            var pcbArray = [];
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down OS.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the current date and time.");
            this.commandList[this.commandList.length] = sc;
            // whereami
            sc = new TSOS.ShellCommand(this.shellWhereami, "whereami", "- Gives you your'e current coordinates.");
            this.commandList[this.commandList.length] = sc;
            // hunger
            sc = new TSOS.ShellCommand(this.shellHunger, "hunger", "- Tells you what you feel like eating.");
            this.commandList[this.commandList.length] = sc;
            // status
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "- Displays status message as specified by user.");
            this.commandList[this.commandList.length] = sc;
            // bsod
            sc = new TSOS.ShellCommand(this.shellBsod, "bsod", "- Tests the BSOD.");
            this.commandList[this.commandList.length] = sc;
            // load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- Validates user input code.");
            this.commandList[this.commandList.length] = sc;
            // run
            sc = new TSOS.ShellCommand(this.shellRun, "run", "<pid> - Runs code from memory.");
            this.commandList[this.commandList.length] = sc;
            // clearmem
            sc = new TSOS.ShellCommand(this.shellClearmem, "clearmem", "- Clears all memory partitions.");
            this.commandList[this.commandList.length] = sc;
            // runall
            sc = new TSOS.ShellCommand(this.shellRunall, "runall", "- Runs all processes.");
            this.commandList[this.commandList.length] = sc;
            // quantum
            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "<int> - Set quantum value for Round Robin.");
            this.commandList[this.commandList.length] = sc;
            // ps
            sc = new TSOS.ShellCommand(this.shellPs, "ps", "- Prints all active PIDs to console.");
            this.commandList[this.commandList.length] = sc;
            // kill
            sc = new TSOS.ShellCommand(this.shellKill, "kill", "<pid> - Murders specified process.");
            this.commandList[this.commandList.length] = sc;
            // 
            // create
            sc = new TSOS.ShellCommand(this.shellCreate, "create", "<filename> - Create file <filename>.");
            this.commandList[this.commandList.length] = sc;
            // read
            sc = new TSOS.ShellCommand(this.shellRead, "read", "<filename> - Read file <filename>.");
            this.commandList[this.commandList.length] = sc;
            // write
            sc = new TSOS.ShellCommand(this.shellWrite, "write", "<filename> <data> - Write <data> (in quotes*) to file <filename>.");
            this.commandList[this.commandList.length] = sc;
            // delete
            sc = new TSOS.ShellCommand(this.shellDelete, "delete", "<filename> - Delete file <filename>.");
            this.commandList[this.commandList.length] = sc;
            // format
            sc = new TSOS.ShellCommand(this.shellFormat, "format", "- Initializes Hard Drive.");
            this.commandList[this.commandList.length] = sc;
            // ls
            sc = new TSOS.ShellCommand(this.shellLs, "ls", " - Lists the files currently on disk.");
            this.commandList[this.commandList.length] = sc;
            // setschedule
            sc = new TSOS.ShellCommand(this.shellSetschedule, "setschedule", "[rr, fcfs, priority] - Sets CPU scheduling algorithm.");
            this.commandList[this.commandList.length] = sc;
            // getschedule
            sc = new TSOS.ShellCommand(this.shellGetschedule, "getschedule", "- Returns the currently selected CPU scheduling algorithm.");
            this.commandList[this.commandList.length] = sc;
            //
            // Display the initial prompt.
            this.putPrompt();
        };
        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };
        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.currentCommand = this.commandList[index].command;
                this.execute(fn, args);
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) {
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
                    this.execute(this.shellApology);
                }
                else {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };
        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        Shell.prototype.execute = function (fn, args) {
            this.commandHistory.push(this.currentCommand); //pushes current command into command history
            this.commandHistoryIndex = this.commandHistory.length;
            //this.currentCommand = "";
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            // ... but does not write prompt if run is called
            // run will handle returning prompt manually after executing
            if (!(this.currentCommand === "run")) {
                this.putPrompt();
            }
        };
        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };
        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };
        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };
        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        };
        Shell.prototype.shellVer = function (args) {
            _StdOut.putText("Operating System: " + APP_NAME);
            _StdOut.advanceLine();
            _StdOut.putText("Version numero: " + APP_VERSION);
        };
        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        };
        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        };
        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };
        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "ver":
                        _StdOut.putText("[ver] tells those who dare know, the current version data.");
                        break;
                    //help
                    case "help":
                        _StdOut.putText("[help] displays a list of (hopefully) valid commands.");
                        break;
                    //shutdown
                    case "shutdown":
                        _StdOut.putText("[shutdown] is there for those who have put up with enough of this crap.");
                        break;
                    //cls
                    case "cls":
                        _StdOut.putText("[cls] removes all console text, as well as, restaring the cursor.");
                        break;
                    //man
                    case "man":
                        _StdOut.putText("[man <topic>] gives adavance manual details for specified commands.");
                        break;
                    //trace
                    case "trace":
                        _StdOut.putText("[trace <on|off>] disables or enables shell _Trace");
                        break;
                    //rot13
                    case "rot13":
                        _StdOut.putText("[rot13 <string>] replaces each letter the letter 13 letters away.");
                        break;
                    //prompt
                    case "prompt":
                        _StdOut.putText("[prompt <string>] displays given text within prompt.");
                        break;
                    //date
                    case "date":
                        _StdOut.putText("[date] doesn't put you on a man-date, but it does gives you the date that ALOS decides.");
                        break;
                    //whereami
                    case "whereami":
                        _StdOut.putText("[whereami] refers to a multitude of geo-cordinates to give you an honest answer of where you are in your life.");
                        break;
                    //hunger
                    case "hunger":
                        _StdOut.putText("[hunger] scans your taste buds and outputs the perfect snack.");
                        break;
                    //status
                    case "status":
                        _StdOut.putText("[status <string>] displays the specified status on the host navigation bar.");
                        break;
                    //bsod
                    case "bsod":
                        _StdOut.putText("[bsod] tests the BLUE SCREEN OF DEATH.");
                        break;
                    //load
                    case "load":
                        _StdOut.putText("[load] validates user code in User Program Input.");
                        break;
                    //run
                    case "run":
                        _StdOut.putText("[run <pid>] runs program in memory, specifed by the given PID.");
                        break;
                    //clearmem
                    case "clearmem":
                        _StdOut.putText("[clearmem] deletes all code in memory and clears up memory partitions.");
                        break;
                    //runall
                    case "runall":
                        _StdOut.putText("[runall] runs all programs in memory.");
                        break;
                    //quantum
                    case "quantum":
                        _StdOut.putText("[quantum <int>] sets the Round Robin quantum.");
                        break;
                    //ps
                    case "ps":
                        _StdOut.putText("[ps] displays all the PIDs of all active processes.");
                        break;
                    //kill
                    case "kill":
                        _StdOut.putText("[kill <pid>] kills an active process, specified by the given PID.");
                        break;
                    //
                    //create
                    case "create":
                        _StdOut.putText("[create <filename>] creates new file with given name.");
                        break;
                    //read
                    case "read":
                        _StdOut.putText("[read <filename>] reads file with given name.");
                        break;
                    //write
                    case "write":
                        _StdOut.putText("[write <filename> <data>] writes data (must be in quotes) to file.");
                        break;
                    //delete
                    case "delete":
                        _StdOut.putText("[delete <filename>] removes file with given name.");
                        break;
                    //format
                    case "format":
                        _StdOut.putText("[format] initializes hard drive.");
                        break;
                    //ls
                    case "ls":
                        _StdOut.putText("[ls] returns all the files currently on disk.");
                        break;
                    //setschedule
                    case "setschedule":
                        _StdOut.putText("[setschedule [rr, fcfs, priority]] sets the selected CPU scheduling algoirthm.");
                        break;
                    //getschedule
                    case "getschedule":
                        _StdOut.putText("[getschedule] returns the current CPU scheduling algorithm.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };
        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };
        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellDate = function (args) {
            var date = new Date();
            _StdOut.putText(date.toDateString());
            _StdOut.advanceLine();
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
            _StdOut.putText(hours.toString() + ":" +
                possibleZero + minutes.toString() + " " + dayOrNight);
        };
        Shell.prototype.shellWhereami = function (args) {
            _StdOut.putText("You are right there.");
        };
        Shell.prototype.shellHunger = function (args) {
            var foodOptions = ["Blue Doritos",
                "Red Doritos",
                "Spicy Doritios",
                "Those weird Purple Doritos",
                "999x cheese blasted Doritos",
                "Beef Jerky Nuggets"];
            _StdOut.putText(foodOptions[Math.floor(Math.random() * 6)]);
        };
        Shell.prototype.shellStatus = function (args) {
            document.getElementById("userStatus").innerHTML = args;
        };
        Shell.prototype.shellBsod = function (args) {
            TSOS.Control.bsodInterrupt();
        };
        //checks to see if memoryPartitionArray has an empty spot
        Shell.prototype.emptyMemoryPartition = function () {
            for (var i = 0; 2 > i; i++) {
                //    //if one is empty(false)
                if (!_memoryPartitionArray[i]) {
                    return true;
                }
            }
            return false;
        };
        Shell.prototype.shellLoad = function (args) {
            //retrieves input form Program input
            var userInput = document.getElementById("taProgramInput").value;
            //array of all hex digitis
            var hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', ' '];
            //Defaults
            var isHex = true;
            var isEmptyPartition = false;
            //commands are split and counted
            var commands = userInput.split(" ");
            var commandsCount = commands.length;
            //looks for empty memory partition
            for (var i = 0; 2 >= i; i++) {
                //if one is empty(false)
                if (!_memoryPartitionArray[i]) {
                    //change to true
                    isEmptyPartition = true;
                    //breaks loop
                    i = i + 42;
                }
            }
            //checks to make sure it is nonEmpty
            if (userInput == "") {
                _StdOut.putText("No user input.");
            }
            else 
            //checks to see if user input is larger than memory partition
            if (commandsCount > 256) {
                _StdOut.putText("Memory out of bounds.");
            }
            else {
                //compares hex to user input    
                for (var i = 0; userInput.length > i; i++) {
                    //temp array to be filled if char isnt hex
                    var hexMatch = [];
                    for (var z = 0; hex.length > z; z++) {
                        //if a char is hex
                        if (hex[z] == userInput.substring(0 + i, 1 + i)) {
                            hexMatch.push("Found");
                        }
                    }
                    //if not hex char 
                    if (hexMatch.length == 0) {
                        isHex = false;
                    }
                }
                if (isHex) {
                    //pushes new pcb into _residentList and initializes
                    _residentList.push(new TSOS.ProcessControlBlock());
                    _residentList[_residentList.length - 1].init();
                    //if priority is specified, set it
                    if (args.length > 0) {
                        var priority = args.slice(0, 1)[0];
                        console.log("yo");
                        console.log(priority);
                        //checks if input is a number, larger than 100, or smaller than 1
                        if ((isNaN(priority)) || (priority > 100) || (priority < 1)) {
                            _StdOut.putText("Priority input is not a number between 1 and 100.");
                            _StdOut.advanceLine();
                            _StdOut.putText("Priority set to default: 5");
                            _StdOut.advanceLine();
                        }
                        else {
                            //set priority to given num
                            _residentList[_residentList.length - 1].priority = priority;
                            //display
                            _StdOut.putText("Priority set to: " + priority);
                            _StdOut.advanceLine();
                        }
                    }
                    //if empty memory partition
                    if (isEmptyPartition) {
                        //memory partition chooser
                        for (var i = 0; 2 >= i; i++) {
                            //if partition is empty
                            if (!_memoryPartitionArray[i]) {
                                //changes to full
                                _memoryPartitionArray[i] = true;
                                //sets base and limit
                                _residentList[_residentList.length - 1].base = i * 256;
                                _residentList[_residentList.length - 1].limit = ((i + 1) * 256) - 1;
                                //breaks loop
                                i = i + 42;
                            }
                        }
                        //shows resident list
                        _Display.printFullResidentList();
                        //makes array of hex code split by spaces
                        var inputArray = userInput.split(" ");
                        //TODO FIX WHERE CODE GOES IN MEMORY
                        //inputs user code into memory manager memory
                        for (var i = 0; inputArray.length > i; i++) {
                            _MemoryManager.memory.memoryBlocks[i + parseInt(_residentList[_residentList.length - 1].base)] = inputArray[i];
                        }
                        //shows memory
                        _MemoryManager.printMemory();
                    }
                    else {
                        //if memory partitions are full
                        console.log("Throw me in memory");
                        _residentList[_residentList.length - 1].base = 0;
                        _residentList[_residentList.length - 1].limit = 256;
                        _residentList[_residentList.length - 1].ondisk = true;
                        //shows resident list
                        _Display.printFullResidentList();
                        //set loadWithoutDisplay to true
                        _loadWithoutDisplay = true;
                        //hard drive must be formatted
                        //auto-format (is this cool?)
                        if (!_formatted) {
                            _OsShell.shellFormat();
                        }
                        //create filename
                        var filename = ("process" + _residentList[_residentList.length - 1].pid);
                        //
                        _residentList[_residentList.length - 1].writtento = filename;
                        //create file
                        _OsShell.shellCreate([filename]);
                        //write to file
                        _krnFileSystemDriver.writeToFile(filename, '"' + userInput + '"');
                        //set loadWithoutDisplay to false
                        _loadWithoutDisplay = false;
                    }
                    _StdOut.putText("User input: [" + userInput + "] Valid Input");
                    _StdOut.advanceLine();
                    _StdOut.putText("Process ID: " + _residentList[_residentList.length - 1].pid);
                }
                else {
                    _StdOut.putText("User input: [" + userInput + "] Invalid Input. Not Hex Digits.");
                }
                //resets
                var isHex = true;
            }
            //test
            // console.log("hey");
            // _cpuScheduler.contextSwitchPriority();
        };
        Shell.prototype.shellRun = function (args) {
            //if a pid is not selected
            var nullArray = [];
            nullArray.push(args);
            if (nullArray[0].length == 0) {
                _StdOut.putText("Please specifiy a PID");
            }
            else 
            //given pid hasn't been created
            if (args > _pidCount) {
                _StdOut.putText("PID does not exist");
            }
            else {
                //set up currently to only run one program at a time
                //resets cpu's pc every run
                //_CPU.PC = 0;
                //finds pcb within rl using pid
                for (var i = 0; _residentList.length > i; i++) {
                    if (args == _residentList[i].pid) {
                        //inserts pcb into ready queue
                        _readyQueue.push(_residentList[i]);
                        //and removes from resident list
                        _residentList.splice(i, 1);
                        //finds pcb with rq using pid
                        for (var i = 0; _readyQueue.length > i; i++) {
                            if (args == _readyQueue[i].pid) {
                                //makes current pcb
                                //FIX
                                //if(_readyQueue.length==1){
                                _currentPcb = _readyQueue[0];
                                _cpuScheduler.insertPcbValuesIntoCpu();
                                // }
                                //changes state to Running
                                _readyQueue[i].state = "Running";
                            }
                        }
                        console.log("this is the ready queue");
                        console.log(_readyQueue);
                        //displays rl and rq
                        _Display.printFullResidentList();
                        _Display.printFullReadyQueue();
                    }
                }
                //starts executing cycle
                _CPU.isExecuting = true;
            }
        };
        Shell.prototype.shellClearmem = function (args) {
            //reinitializes memory and displays
            _Memory.init();
            _MemoryManager.printMemory();
            _memoryPartitionArray = [false, false, false];
            _StdOut.putText("Memory has been cleared.");
        };
        Shell.prototype.shellRunall = function (args) {
            //checks if any process is in memory
            if (_residentList.length < 1) {
                _StdOut.putText("No processes in memory.");
            }
            else {
                //if so records initial resident list length
                var initialRLLength = _residentList.length;
                //inserts all processes into resident queue at head
                //removes all processes from resident list at head
                for (var i = 0; initialRLLength > i; i++) {
                    _readyQueue.push(_residentList[0]);
                    _residentList.splice(0, 1);
                }
                //displays rl and rq
                _Display.printFullResidentList();
                _Display.printFullReadyQueue();
                //if priority scheduling is set, 
                if (_CPU.isPriority) {
                    //make highest priority first process to run
                    _cpuScheduler.contextSwitchPriority();
                }
                else {
                    //sets first process to current pcb
                    _currentPcb = _readyQueue[0];
                }
                //changes executing to true
                _CPU.isExecuting = true;
            }
        };
        Shell.prototype.shellQuantum = function (args) {
            //does not allow change of quantum while processes are executing
            if (_CPU.isExecuting) {
                _StdOut.putText("Can not change quantum while processes are running!");
            }
            else {
                //checks if args is anumber
                if (isNaN(args)) {
                    _StdOut.putText("Please Enter a Number.");
                }
                else {
                    //if so sets quantum and temp quantum to given value
                    _quantum = parseInt(args);
                    _tempQuantum = parseInt(args);
                    _StdOut.putText("New Quantum = " + _quantum);
                }
            }
        };
        Shell.prototype.shellPs = function (args) {
            var tempString = "";
            //loops through ready queue (all running processes) and concates to string to display
            for (var i = 0; _readyQueue.length > i; i++) {
                tempString = tempString + _readyQueue[i].pid + " ";
            }
            _StdOut.putText("Active Processes' PIDs: " + tempString);
        };
        Shell.prototype.shellKill = function (args) {
            var index;
            //thows kill interupt
            for (var i = 0; _readyQueue.length > i; i++) {
                //once current pcb is found
                if (args == _readyQueue[i].pid) {
                    index = i;
                    //and end for loop
                    i = i + 42;
                }
            }
            TSOS.Control.killInterrupt(index);
            _StdOut.putText("Process " + args + " killed.");
        };
        Shell.prototype.shellCreate = function (args) {
            //checks if hard drive is formatted
            if (!_formatted) {
                _StdOut.putText("Hard Drive must be formatted.");
            }
            else {
                //checks if a file name is given
                var nullArray = [];
                nullArray.push(args);
                if (nullArray[0].length == 0) {
                    _StdOut.putText("You must give your file a name.");
                }
                else if (_krnFileSystemDriver.stringToHex(args[0]).length > _krnFileSystemDriver.bytes) {
                    _StdOut.putText("File name is too long.");
                }
                else if (_krnFileSystemDriver.inFileNameArray(args[0])) {
                    _StdOut.putText("File name already exists.");
                }
                else {
                    _krnFileSystemDriver.createFile(args[0]);
                    //pushes filename to _fileNameAray
                    _fileNameArray.push(args[0]);
                }
            }
        };
        Shell.prototype.shellRead = function (args) {
            //checks if hard drive is formatted
            if (!_formatted) {
                _StdOut.putText("Hard Drive must be formatted.");
            }
            else {
                //checks if a file name is given
                var nullArray = [];
                nullArray.push(args);
                //checks to see if a filename is given
                if (nullArray[0].length == 0) {
                    _StdOut.putText("You must choose a file to write to.");
                }
                else if (!_krnFileSystemDriver.inFileNameArray(args[0])) {
                    _StdOut.putText("File does not exist.");
                }
                else {
                    _krnFileSystemDriver.readFile(args[0]);
                }
            }
        };
        Shell.prototype.shellWrite = function (args) {
            console.log("made it!");
            console.log(args);
            //checks if hard drive is formatted
            if (!_formatted) {
                _StdOut.putText("Hard Drive must be formatted.");
            }
            else {
                //extracts filename from args
                var argsFilename = args.splice(0, 1);
                //extracts data
                var argsData = args;
                //joins data (if spaces exists)
                var dataString = argsData.join(" ");
                //checks to see if a filename is given
                if (argsFilename.length == 0) {
                    _StdOut.putText("You must choose a file to write to.");
                }
                else if (!_krnFileSystemDriver.inFileNameArray(argsFilename)) {
                    _StdOut.putText("File does not exist.");
                }
                else if (argsData[0] == null) {
                    _StdOut.putText("You must enter data to write.");
                }
                else if ((!(dataString.charAt(0) === '"'))
                    || (!(dataString.charAt(dataString.length - 1) == '"'))) {
                    _StdOut.putText("You must enter your data in quotes.");
                }
                else {
                    console.log(args);
                    console.log(argsFilename[0]);
                    console.log(dataString);
                    _krnFileSystemDriver.writeToFile(argsFilename[0], dataString);
                }
            }
        };
        Shell.prototype.shellDelete = function (args) {
            //checks if hard drive is formatted
            if (!_formatted) {
                _StdOut.putText("Hard Drive must be formatted.");
            }
            else {
                //extracts filename from args
                var argsFilename = args.splice(0, 1);
                //checks to see if a filename is given
                if (argsFilename.length == 0) {
                    _StdOut.putText("You must choose a file to delete.");
                }
                else if (!_krnFileSystemDriver.inFileNameArray(argsFilename)) {
                    _StdOut.putText("File does not exist.");
                }
                else {
                    _krnFileSystemDriver.deleteFile(argsFilename[0]);
                }
            }
        };
        Shell.prototype.shellFormat = function (args) {
            //TODO When would this fail
            if (true) {
                //initalizes hard drive (all blocks in all sectors in all tracks)
                _krnFileSystemDriver.init();
                _formatted = true;
                //if loadwithoutdisplay = false
                if (!(_loadWithoutDisplay)) {
                    _StdOut.putText("Successful Format");
                }
            }
            else {
                _StdOut.putText("Format Failed");
            }
        };
        Shell.prototype.shellLs = function (args) {
            //if no files are on disk
            if (_fileNameArray.length == 0) {
                _StdOut.putText("There are no files on disk.");
            }
            else {
                //lists all files on disk from _fileNameArray
                _StdOut.putText("Files on disk: ");
                _StdOut.advanceLine();
                for (var x = 0; _fileNameArray.length > x; x++) {
                    _StdOut.putText(_fileNameArray[x]);
                    _StdOut.advanceLine();
                }
            }
        };
        Shell.prototype.shellSetschedule = function (args) {
            //Round Robin setting
            if (args == "rr") {
                //_CPU.isRoundRobin is turned on, all others turned off
                _CPU.isRoundRobin = true;
                _CPU.isFCFS = false;
                _CPU.isPriority = false;
                _StdOut.putText("CPU scheduling algorithm set to Round Robin.");
            }
            else 
            //FCFS setting
            if (args == "fcfs") {
                //_CPU.isFCFS is turned on, all others turned off
                _CPU.isRoundRobin = false;
                _CPU.isFCFS = true;
                _CPU.isPriority = false;
                _StdOut.putText("CPU scheduling algorithm set to First Come First Serve.");
            }
            else 
            //Priority setting
            if (args == "priority") {
                //_CPU.isPriority is turned on, all others turned off
                _CPU.isRoundRobin = false;
                _CPU.isFCFS = false;
                _CPU.isPriority = true;
                _StdOut.putText("CPU scheduling algorithm set to Priority.");
            }
            else {
                _StdOut.putText("Input not reconginized. Please enter one of: [ rr , fcfs , priority ].");
            }
        };
        Shell.prototype.shellGetschedule = function (args) {
            _StdOut.putText("CPU scheduling algorithm is set to: ");
            //checks to see if Round Robin is on (DEFAULT)
            if (_CPU.isRoundRobin) {
                _StdOut.putText("Round Robin.");
            }
            else 
            //checks to see if Round Robin is on (DEFAULT)
            if (_CPU.isFCFS) {
                _StdOut.putText("First Come First Serve.");
            }
            else 
            //checks to see if Round Robin is on (DEFAULT)
            if (_CPU.isPriority) {
                _StdOut.putText("Priority.");
            }
        };
        return Shell;
    })();
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
