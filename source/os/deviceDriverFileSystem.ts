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
            super(this.krnFsDriverEntry, this.fsIsr);

        }

           public krnFsDriverEntry() {
            this.status = "loaded";
            // More?
            this.init();
        }

           public fsIsr(params) {
            console.log("Isr");
        }


        public init(): void {

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
                        for (var b = 0; b < this.bytes; b++){
                            newBlock = newBlock + "-";
                        }
                        sessionStorage.setItem("b" + x + y + z, newBlock);
                      
                    }
                }
            }

            //initializes master boot record
            var mbr =    "001" //next avail file nme
                       + "100"; //next avail data block

            sessionStorage.setItem("b000", 
                "1000"+ //in use byte + address
                //chnage mbr to hex and add trail
                this.addTrail(this.stringToHex(mbr)));
             

            //prints...
           _Display.printFullHardDrive();
           console.log(this.createfile("alex"));


           }


           public stringToHex(str){
              //inital temp string
               var tempStr = "";
               //for length of given string
             for (var x = 0; x < str.length; x++) {
                // acquires CharCode of char
                var charCode =  str.charCodeAt(x);
                var decToHex = charCode.toString(16).toUpperCase();

                tempStr = tempStr + decToHex;
            }
             return tempStr;
        }


        public addTrail(str){
            //while given string is less than bytes amount
            while(str.length < this.bytes){
                //add trail of "-"
                str = str + "-";
            }
            return str;

        }

        public removeTrail(str){
            //records inital string length
            var initStrLength = str.length;
            for  (var x = 0; x < initStrLength; x++) {
                //replaces all "-" with ''
                var removedTrail = str.replace("-", "");
            }

            return removedTrail;

        }

        public hexToString(hex){
            //temp string
            var tempStr = "";
            //transverses by 2
            for (var x = 0; x < hex.length; x+=2) {
                //gets 2 chars from hex, converts to decimal
               var twoHex = parseInt(hex.charAt(x) + hex.charAt(x + 1), 16);
               //fins unicode for decimal and adds to tempStr
               tempStr = tempStr + String.fromCharCode(twoHex);

            }
            return tempStr;

        }


        public createfile(filename){
            var mbrNoTrail = this.removeTrail(sessionStorage.getItem("b000"));
            var mbrToString = this.hexToString(mbrNoTrail.slice(4, mbrNoTrail.length));
                console.log(mbrToString);
                console.log(this.stringToHex(filename));

        }






    }
}

