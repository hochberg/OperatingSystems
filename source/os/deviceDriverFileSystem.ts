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
            console.log("hey2");
        }


        public init(): void {

          //initializes hard drive
            this.track = 4;
            this.sector = 8;
            this.block = 8;
            this.bytes = 64;

            for (var x = 0; x < this.track; x++) {
                for (var y = 0; y < this.sector; y++) {
                    for (var z = 0; z < this.block; z++) {

                        var newBlock = "";
                        for (var b = 0; b < this.bytes; b++){
                            newBlock = newBlock + "-";
                        }
                        sessionStorage.setItem("b" + x + y + z, newBlock);
                      
                    }
                }
            }

            //prints...
           _Display.printFullHardDrive();
                    }






    }
}

