///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverFileSystem extends DeviceDriver {

        constructor(public track : number,
                    public sector : number,
                    public block : number,
                    public bytes : number ) {
            super(this.krnFsDriverEntry, this.isrtest);

        }

           public krnFsDriverEntry() {
            this.status = "loaded";
            // More?
            console.log("hey");
            this.init();
        }

           public isrtest(params) {
            //this.status = "loaded";
            // More?
            console.log("hey");
        }


        public init(): void {
            //initializes hard drive
            this.track = 4;
            this.sector = 8;
            this.block = 8;
            this.bytes = 64;
            //prints...
            //this.printHardDrive();
                    }




    }
}

