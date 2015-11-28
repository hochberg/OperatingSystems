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
            this.init();
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
                        var newBlock = "";
                        for (var b = 0; b < this.bytes; b++) {
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
            // console.log(this.stringToHex("1111"));
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
            console.log(str.length);
            return str;
        };
        return DeviceDriverFileSystem;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverFileSystem = DeviceDriverFileSystem;
})(TSOS || (TSOS = {}));
