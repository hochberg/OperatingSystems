///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
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
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data. Because versions are important.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
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
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
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
            this.putPrompt();
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
                        _StdOut.putText("[run <pid>] runs program in memory, specifed by the given PID");
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
        Shell.prototype.shellLoad = function (args) {
            //retrieves input form Program input
            var userInput = document.getElementById("taProgramInput").value;
            //array of all hex digitis
            var hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', ' '];
            //Default
            var isHex = true;
            var commands = userInput.split(" ");
            var commandsCount = commands.length;
            console.log(commandsCount);
            //checks to make sure it is nonEmpty
            if (userInput == "") {
                _StdOut.putText("No user input.");
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
                    //makes array of hex code split by spaces
                    var inputArray = userInput.split(" ");
                    //inputs user code into memory manager memory
                    for (var i = 0; inputArray.length > i; i++) {
                        _MemoryManager.memory.memoryBlocks[i] = inputArray[i];
                    }
                    //TODO shouldnt print here
                    _MemoryManager.printMemory();
                    //TODO fix
                    // Initialize the processControlBlock
                    _ProcessControlBlock = new TSOS.ProcessControlBlock();
                    _ProcessControlBlock.init();
                    _ProcessControlBlock.printPCB(); //for now
                    _CPU.PIDArray.push(commandsCount); //
                    _pcbArray.push(_ProcessControlBlock);
                    // _CPU.execute(userInput);
                    _StdOut.putText("User input: [" + userInput + "] Valid Input");
                    _StdOut.advanceLine();
                    _StdOut.putText("Process ID: " + _ProcessControlBlock.pid);
                }
                else {
                    _StdOut.putText("User input: [" + userInput + "] Invalid Input. Not Hex Digits.");
                }
                //clears user text area
                document.getElementById("taProgramInput").value = "";
                //resets
                var isHex = true;
            }
        };
        Shell.prototype.shellRun = function (args) {
            console.log(_MemoryManager.memory);
            _CPU.execute(_MemoryManager.memory.memoryBlocks, _ProcessControlBlock.pid, _pcbArray[_ProcessControlBlock.pid]);
        };
        return Shell;
    })();
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
