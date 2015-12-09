///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverFileSystem = (function (_super) {
        __extends(DeviceDriverFileSystem, _super);
        function DeviceDriverFileSystem(track, sector, block, bytes) {
            _super.call(this, this.krnFsDriverEntry, this.fsIsr);
            this.track = track;
            this.sector = sector;
            this.block = block;
            this.bytes = bytes;
        }
        DeviceDriverFileSystem.prototype.krnFsDriverEntry = function () {
            this.status = "loaded";
            // More?
            //this.init();
        };
        DeviceDriverFileSystem.prototype.fsIsr = function (params) {
            console.log("Isr");
        };
        DeviceDriverFileSystem.prototype.init = function () {
            //initializes hard drive property values
            this.track = 4;
            this.sector = 8;
            this.block = 8;
            this.bytes = 64;
            //initialzies all blocks in all sectors in all tracks
            for (var x = 0; x < this.track; x++) {
                for (var y = 0; y < this.sector; y++) {
                    for (var z = 0; z < this.block; z++) {
                        var newBlock = "0";
                        for (var b = 0; b < this.bytes - 1; b++) {
                            newBlock = newBlock + "-";
                        }
                        sessionStorage.setItem("b" + x + y + z, newBlock);
                    }
                }
            }
            //initializes master boot record
            var mbr = "001" //next avail file nme
                + "100"; //next avail data block
            sessionStorage.setItem("b000", "1000" +
                //chnage mbr to hex and add trail
                this.addTrail(this.stringToHex(mbr)));
            //prints...
            _Display.printFullHardDrive();
            console.log(this.getNextAvailableDir());
            console.log(this.getNextAvailableFile());
        };
        DeviceDriverFileSystem.prototype.stringToHex = function (str) {
            //inital temp string
            var tempStr = "";
            //for length of given string
            for (var x = 0; x < str.length; x++) {
                // acquires CharCode of char
                var charCode = str.charCodeAt(x);
                var decToHex = charCode.toString(16).toUpperCase();
                tempStr = tempStr + decToHex;
            }
            return tempStr;
        };
        DeviceDriverFileSystem.prototype.addTrail = function (str) {
            //while given string is less than bytes amount
            while (str.length < this.bytes) {
                //add trail of "-"
                str = str + "-";
            }
            return str;
        };
        DeviceDriverFileSystem.prototype.removeTrail = function (str) {
            //records inital string length
            var initStrLength = str.length;
            var removedTrail = str;
            for (var x = 0; x < initStrLength; x++) {
                //replaces all "-" with ''
                removedTrail = removedTrail.replace("-", "");
            }
            return removedTrail;
        };
        DeviceDriverFileSystem.prototype.hexToString = function (hex) {
            //temp string
            var tempStr = "";
            //transverses by 2
            for (var x = 0; x < hex.length; x += 2) {
                //gets 2 chars from hex, converts to decimal
                var twoHex = parseInt(hex.charAt(x) + hex.charAt(x + 1), 16);
                //fins unicode for decimal and adds to tempStr
                tempStr = tempStr + String.fromCharCode(twoHex);
            }
            return tempStr;
        };
        DeviceDriverFileSystem.prototype.updateMbr = function () {
            var nextAvailDir = "";
            var nextAvailFile = "";
            //finds next available directory
            dance: for (var y = 0; y < this.sector; y++) {
                for (var z = 0; z < this.block; z++) {
                    //if block is not in use it becomes next avil directory
                    if (sessionStorage.getItem("b0" + y + z).charAt(0) == "0") {
                        nextAvailDir = "0" + y + "" + z;
                        //breaks loop
                        break dance;
                    }
                }
            }
            //finds next available file
            room: for (var x = 1; x < this.track; x++) {
                for (var y = 0; y < this.sector; y++) {
                    for (var z = 0; z < this.block; z++) {
                        //if block is not in use, it becomes next avil file
                        if (sessionStorage.getItem("b" + x + y + z).charAt(0) == "0") {
                            nextAvailFile = "" + x + y + z;
                            //breaks loop
                            break room;
                        }
                    }
                }
            }
            //updates the mbr
            sessionStorage.setItem("b000", "1000" +
                this.addTrail(this.stringToHex(nextAvailDir + nextAvailFile)));
            //prints
            _Display.printFullHardDrive();
        };
        DeviceDriverFileSystem.prototype.getNextAvailableDir = function () {
            var mbr = this.hexToString(sessionStorage.getItem("b000"));
            console.log(mbr);
            var dir = mbr.slice(2, 5);
            return dir;
        };
        DeviceDriverFileSystem.prototype.getNextAvailableFile = function () {
            var mbr = this.hexToString(sessionStorage.getItem("b000"));
            var file = mbr.slice(5, 8);
            return file;
        };
        DeviceDriverFileSystem.prototype.createFile = function (filename) {
            //removes trail from mbr
            var mbrNoTrail = this.removeTrail(sessionStorage.getItem("b000"));
            //retrives decimal value of data
            var mbrDecData = this.hexToString(mbrNoTrail.slice(4, mbrNoTrail.length));
            //retrievs next avaialbe Directory
            var nextAvailDir = mbrDecData.slice(0, 3);
            //retrieves next available File
            var nextAvailFile = mbrDecData.slice(3, 6);
            //converts file name to hex
            var hexFileName = this.stringToHex(filename);
            //builds new block
            //first bit switch to in use (1) + file address + hex file name + trail
            var newBlock = this.addTrail("1" + nextAvailFile + hexFileName);
            sessionStorage.setItem("b" + nextAvailDir, newBlock);
            //changes associated file to in use
            sessionStorage.setItem("b" + nextAvailFile, this.addTrail("1"));
            //prints hard drive
            _Display.printFullHardDrive();
            //updates mbr
            this.updateMbr();
            //if loadwithoutdisplay = false
            if (!(_loadWithoutDisplay)) {
                //success message
                _StdOut.putText("Successfully Created: " + filename);
            }
        };
        DeviceDriverFileSystem.prototype.writeToFile = function (filename, data) {
            //loop through all of directory to find filename
            //finds next available directory
            var foundFileMeta;
            dance: for (var y = 0; y < this.sector; y++) {
                for (var z = 0; z < this.block; z++) {
                    //if block is not in use it becomes next avail directory
                    if (this.removeTrail(sessionStorage.getItem("b0" + y + z).slice(4, (sessionStorage.getItem("b0" + y + z).length)))
                        == this.stringToHex(filename)) {
                        //set found meta data of filename
                        foundFileMeta = sessionStorage.getItem("b0" + y + z).slice(1, 4);
                        //breaks loop
                        break dance;
                    }
                }
            }
            //initalizes data array (in case of overflow)
            var dataArray = [];
            //converts data to hex
            var hexData = this.stringToHex(data);
            //splits data an array of parts (60 char each = bytes - meta)
            for (var x = 0; x < hexData.length; x) {
                var firstDataSeg = hexData.slice(x, (x + (this.bytes - 4)));
                dataArray.push(firstDataSeg);
                console.log(this.hexToString(firstDataSeg));
                x = x + (this.bytes - 4);
            }
            //if no overflow, meta data doesn't change
            var meta = "---";
            //if overflow, sets to next avail file
            if (!(dataArray[1] == null)) {
                meta = this.getNextAvailableFile();
            }
            //sets data file in storage
            //of first file (in case of overflow)
            sessionStorage.setItem("b" + foundFileMeta, this.addTrail("1" + meta + dataArray[0]));
            //takes first elements off of array
            dataArray.shift();
            //if ther are more elements in data array ( overflow )
            if (!(dataArray[0] == null)) {
                //loops through data array
                for (var x = 0; x < dataArray.length; x) {
                    //updates mbr to next avil file
                    this.updateMbr();
                    //initalizes next meta if no more overflow
                    var nextMeta = "---";
                    //sets current file to being used
                    sessionStorage.setItem("b" + meta, this.addTrail("1"));
                    //updates mbr
                    this.updateMbr();
                    //if there is more overflow, finds next avail file for meta
                    if (!(dataArray[1] == null)) {
                        nextMeta = this.getNextAvailableFile();
                    }
                    //sets next chunk of data in storage
                    sessionStorage.setItem("b" + meta, this.addTrail("1" + nextMeta + dataArray[0]));
                    //pulls first ele from data array
                    dataArray.shift();
                    //meta becomes next meta for rest of loop
                    meta = nextMeta;
                }
            }
            //prints hard drive
            _Display.printFullHardDrive();
            //updates mbr
            this.updateMbr();
            //if loadwithoutdisplay = false
            if (!(_loadWithoutDisplay)) {
                //prints success message to console
                _StdOut.putText("Successfully Written To: " + filename);
            }
        };
        //loops through global file array to check if specified filename is within
        DeviceDriverFileSystem.prototype.inFileNameArray = function (filename) {
            var inArray = false;
            for (var i = 0; _fileNameArray.length > i; i++) {
                console.log(filename);
                console.log(_fileNameArray[i]);
                if (filename[0] === _fileNameArray[i].toLowerCase()) {
                    inArray = true;
                }
            }
            return inArray;
        };
        //removes given filename from gloabl filename array
        DeviceDriverFileSystem.prototype.removeFromFileNameArray = function (filename) {
            for (var i = 0; _fileNameArray.length > i; i++) {
                if (filename == _fileNameArray[i]) {
                    _fileNameArray.splice(i, 1);
                }
            }
        };
        DeviceDriverFileSystem.prototype.readFile = function (filename) {
            console.log(filename);
            //initializes variable to be set to the file's meta
            var foundFileMeta;
            //loops through block and sector to find specified filename
            dance: for (var y = 0; y < this.sector; y++) {
                for (var z = 0; z < this.block; z++) {
                    //if block is not in use it becomes next avil directory
                    if (this.removeTrail(sessionStorage.getItem("b0" + y + z).slice(4, (sessionStorage.getItem("b0" + y + z).length)))
                        == this.stringToHex(filename)) {
                        //when found, records meta data of file
                        foundFileMeta = sessionStorage.getItem("b0" + y + z).slice(1, 4);
                        //breaks loop
                        break dance;
                    }
                }
            }
            console.log(foundFileMeta);
            //retrieves the data (unformatted) from the specfied file
            var rawData = sessionStorage.getItem("b" + foundFileMeta);
            console.log(rawData);
            //initalizes string to hole data
            var dataString = "";
            //while there exists overflow
            while (!(rawData.slice(1, 4) === "---")) {
                //connvert current file's data to hex
                var stringChunck = this.hexToString(rawData.slice(4, rawData.length));
                //tack it onto the datastring (back of)
                dataString = dataString + stringChunck;
                //record the meta to point to the next file
                var nextMeta = rawData.slice(1, 4);
                //continues by setting rawdata to next file's data
                rawData = sessionStorage.getItem("b" + nextMeta);
            }
            //when there no longer exists overflow
            if (rawData.slice(1, 4) === "---") {
                //remove trail of last data
                var dataWithMeta = this.removeTrail(rawData);
                //remove meta
                var data = dataWithMeta.slice(1, dataWithMeta.length);
                //convert to string
                var dataStringCaboose = this.hexToString(data);
                //tack onto end of dataString
                var fullData = dataString + dataStringCaboose;
                //TODO
                if (_currentPcb.ondisk) {
                    return fullData;
                }
                else {
                    //print to console
                    _StdOut.putText(filename + " reads: " + fullData);
                }
            }
        };
        DeviceDriverFileSystem.prototype.deleteFile = function (filename) {
            //initializes variable to be set to locate of file name
            var foundFileLoc;
            //initalizes that files meta 
            var foundFileMeta;
            //transverses sectors and blocks to find matching filename
            dance: for (var y = 0; y < this.sector; y++) {
                for (var z = 0; z < this.block; z++) {
                    //if block is not in use it becomes next avail directory
                    if (this.removeTrail(sessionStorage.getItem("b0" + y + z).slice(4, (sessionStorage.getItem("b0" + y + z).length)))
                        == this.stringToHex(filename)) {
                        //sets file loc
                        foundFileLoc = "b0" + y + z;
                        //sets file meta
                        foundFileMeta = sessionStorage.getItem("b0" + y + z).slice(1, 4);
                        //breaks loop
                        break dance;
                    }
                }
            }
            //initializes the files next meta
            var nextMeta = sessionStorage.getItem("b" + foundFileMeta).slice(1, 4);
            //while the next meta is not the last
            while (!(nextMeta === "---")) {
                //clears current file
                sessionStorage.setItem("b" + foundFileMeta, this.addTrail("0"));
                //sets current to next meta
                foundFileMeta = nextMeta;
                //finds next meta
                nextMeta = sessionStorage.getItem("b" + foundFileMeta).slice(1, 4);
                //updates mbr
                this.updateMbr();
            }
            //deletes final file in file sys
            sessionStorage.setItem("b" + foundFileMeta, this.addTrail("0"));
            //deletes filename in dir
            sessionStorage.setItem(foundFileLoc, this.addTrail("0"));
            //updates mbr (also prints to hard drive display)
            this.updateMbr();
            //removes filename from filename array
            this.removeFromFileNameArray(filename);
            //prints success message
            if (!(_loadWithoutDisplay)) {
                _StdOut.putText("Successfully deleted: " + filename);
            }
        };
        DeviceDriverFileSystem.prototype.swapper = function () {
            console.log(_currentPcb);
            //
            var swappedOutPID = 0;
            //retrieve pid of first partitioned memory
            for (var x = 0; _readyQueue.length > x; x++) {
                console.log(_readyQueue[x]);
                if ((_readyQueue[x].base == 0) && (!_readyQueue[x].ondisk)) {
                    console.log("worked");
                    swappedOutPID = _readyQueue[x].pid;
                }
            }
            console.log(swappedOutPID);
            console.log("swap");
            //WILL HAVE TO FIX
            // file name 
            //var filename = "process" + _currentPcb.pid;
            var filename = "process3";
            //retrives data from storage
            var data = _krnFileSystemDriver.readFile(filename);
            console.log(data);
            for (var x = 0; x < data.length; x++) {
                //replaces all "-" with ''
                data = data.replace('"', "");
            }
            console.log("data");
            console.log(data);
            //initalizes holder for swapped out data
            var savedMemory = "";
            //save op code in memory and then
            //clear mem of partition 1
            for (var i = 0; i < 256; i++) {
                savedMemory = savedMemory + _Memory.memoryBlocks[i] + " ";
                _Memory.memoryBlocks[i] = '00';
            }
            // for (var x = 0; x < savedMemory.length; x++) {
            // //replaces all "0" with ''
            // savedMemory = savedMemory.replace('0', "");
            //               }
            //makes array of hex code split by spaces
            var inputArray = data.split(" ");
            console.log("inputArray");
            console.log(inputArray);
            //write swapped in data to memory
            for (var i = 0; inputArray.length > i; i++) {
                _MemoryManager.memory.memoryBlocks[i] = inputArray[i];
            }
            //write swapped out data to disk
            _loadWithoutDisplay = true;
            _krnFileSystemDriver.deleteFile(filename);
            _krnFileSystemDriver.writeToFile(filename, savedMemory);
            console.log(savedMemory);
            //change ondisk of swapped out memory
            for (var x = 0; _readyQueue.length > x; x++) {
                console.log(_readyQueue[x].pid);
                console.log(swappedOutPID);
                if (_readyQueue[x].pid == swappedOutPID) {
                    _readyQueue[x].ondisk = true;
                    console.log("does this happen?");
                }
            }
            _MemoryManager.printMemory();
            _currentPcb.ondisk = false;
            _loadWithoutDisplay = false;
        };
        return DeviceDriverFileSystem;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverFileSystem = DeviceDriverFileSystem;
})(TSOS || (TSOS = {}));
