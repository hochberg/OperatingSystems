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
            _super.call(this, this.krnFsDriverEntry, this.isrtest);
            this.track = track;
            this.sector = sector;
            this.block = block;
            this.bytes = bytes;
        }
        DeviceDriverFileSystem.prototype.krnFsDriverEntry = function () {
            this.status = "loaded";
            // More?
            console.log("hey");
            this.init();
        };
        DeviceDriverFileSystem.prototype.isrtest = function (params) {
            //this.status = "loaded";
            // More?
            console.log("hey");
        };
        DeviceDriverFileSystem.prototype.init = function () {
            //initializes hard drive
            this.track = 4;
            this.sector = 8;
            this.block = 8;
            this.bytes = 64;
            //prints...
            //this.printHardDrive();
        };
        return DeviceDriverFileSystem;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverFileSystem = DeviceDriverFileSystem;
})(TSOS || (TSOS = {}));
