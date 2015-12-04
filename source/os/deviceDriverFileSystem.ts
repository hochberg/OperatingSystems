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

            //this.init();
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

                        var newBlock = "0";
                        for (var b = 0; b < this.bytes-1; b++){
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
           
           console.log(this.getNextAvailableDir());
           console.log(this.getNextAvailableFile());


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
            var removedTrail = str;
            for  (var x = 0; x < initStrLength; x++) {
                //replaces all "-" with ''
                removedTrail = removedTrail.replace("-", "");

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

        public updateMbr(){
            var nextAvailDir = "";
            var nextAvailFile = "";

            //finds next available directory
            dance:
            for (var y = 0; y < this.sector; y++) {
                for (var z = 0; z < this.block; z++) {
                    //if block is not in use it becomes next avil directory
                    if (sessionStorage.getItem("b0" + y + z).charAt(0)=="0"){
                        nextAvailDir = "0" + y + "" + z;
                        //breaks loop
                        break dance;
                    }
            }
            }

            //finds next available file
            room:
            for (var x = 1; x < this.track; x++) {
                for (var y = 0; y < this.sector; y++) {
                    for (var z = 0; z < this.block; z++) {
                        //if block is not in use, it becomes next avil file
                        if (sessionStorage.getItem("b"+ x + y + z).charAt(0)=="0"){
                            nextAvailFile = "" + x + y + z;
                            //breaks loop
                            break room;
                        }

                    }
                }
            }

            //updates the mbr
            sessionStorage.setItem("b000", 
                "1000"+ 
                this.addTrail(
                    this.stringToHex(nextAvailDir+nextAvailFile
                    )));
            //prints
            _Display.printFullHardDrive();


        }

        public getNextAvailableDir(){
            
            var mbr = this.hexToString(sessionStorage.getItem("b000"));
            console.log(mbr);
            var dir = mbr.slice(2,5);

            return dir;


        }

        public getNextAvailableFile(){
            var mbr = this.hexToString(sessionStorage.getItem("b000"));
            var file = mbr.slice(5,8);

            return file;
            
        }

        public createFile(filename){
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
            sessionStorage.setItem("b" + nextAvailDir, newBlock );

            //changes associated file to in use
            sessionStorage.setItem("b" + nextAvailFile, this.addTrail("1") );


            //prints hard drive
            _Display.printFullHardDrive();
            //updates mbr
            this.updateMbr();
            //success message
            _StdOut.putText("Successfully Created: " + filename);

        }

        public writeToFile(filename, data){
            //loop through all of directory to find filename
            //finds next available directory
            var foundFileMeta;
            dance:
            for (var y = 0; y < this.sector; y++) {
                for (var z = 0; z < this.block; z++) {
                    //if block is not in use it becomes next avail directory
                    if (this.removeTrail(sessionStorage.getItem("b0" + y + z).slice(4, (sessionStorage.getItem("b0" + y + z).length)))
                        == this.stringToHex(filename))
                    {
                        //set found meta data of filename
                        foundFileMeta = sessionStorage.getItem("b0" + y + z).slice(1,4);
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
                for (var x = 0; x < hexData.length; x){
                    var firstDataSeg = hexData.slice(x, (x + (this.bytes - 4)));
                    dataArray.push(firstDataSeg);
                    console.log(this.hexToString(firstDataSeg));
                    x = x + (this.bytes - 4);
                }

                //if no overflow, meta data doesn't change
                var meta = "---";
                //if overflow, sets to next avail file
                if(!(dataArray[1] == null)) {
                    meta = this.getNextAvailableFile();
                }

                //sets data file in storage
                //of first file (in case of overflow)
                sessionStorage.setItem("b" + foundFileMeta, this.addTrail("1" + meta + dataArray[0]));
                
                 console.log(this.hexToString(dataArray[0]));

                //takes first elements off of array
                dataArray.shift();

                //if ther are more elements in data array ( overflow )
            if(!(dataArray[0] == null)) {

                //loops through data array
                for (var x = 0; x < dataArray.length; x) {
                    //updates mbr to next avil file
                    this.updateMbr();
                    //initalizes next meta if no more overflow
                    var nextMeta = "---";
                    //
                    sessionStorage.setItem("b" + meta, this.addTrail("1" ));
                    this.updateMbr();
                    //if there is more overflow, finds next avail file for meta
                    if (!(dataArray[1] == null)){
                       nextMeta = this.getNextAvailableFile();
                    }
                    console.log(this.hexToString(dataArray[0]));
                    console.log(meta);
                    console.log(nextMeta);
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

            //prints success message to console
            _StdOut.putText("Successfully Written To: " + filename);

        }

        public inFileNameArray(filename){
            var inArray = false;
            for (var i = 0; _fileNameArray.length > i; i++){
                if (filename==_fileNameArray[i]){
                    inArray = true;
                }
            }
            return inArray;
        }

        public removeFromFileNameArray(filename){
            console.log(_fileNameArray);
            for (var i = 0; _fileNameArray.length > i; i++){

                if (filename==_fileNameArray[i]){
                    _fileNameArray.splice(i, 1);
                    console.log(_fileNameArray)
                }
            }

        }

        public readFile(filename){
            var foundFileMeta;
            dance:
            for (var y = 0; y < this.sector; y++) {
                for (var z = 0; z < this.block; z++) {
                    //if block is not in use it becomes next avil directory
                    console.log(this.removeTrail(sessionStorage.getItem("b0" + y + z).slice(4, (sessionStorage.getItem("b0" + y + z).length))));
                    console.log(this.stringToHex(filename));
                    if (this.removeTrail(sessionStorage.getItem("b0" + y + z).slice(4, (sessionStorage.getItem("b0" + y + z).length)))
                        == this.stringToHex(filename))
                    {
                        foundFileMeta = sessionStorage.getItem("b0" + y + z).slice(1,4);
                        console.log(foundFileMeta);
                        //breaks loop
                        break dance;
                    }
            }
            }
            console.log(foundFileMeta);
            var rawData = sessionStorage.getItem("b" + foundFileMeta);

            console.log(rawData.slice(1, 4));

            var dataString = "";
            //there exists overflow
              while(!(rawData.slice(1, 4)==="---")){
                  var stringChunck = this.hexToString(rawData.slice(4, rawData.length));
                  console.log(stringChunck);
                  dataString = dataString + stringChunck ;
                  console.log(dataString);
                  var nextMeta = rawData.slice(1, 4);
                  console.log(nextMeta);
                  rawData = sessionStorage.getItem("b" + nextMeta);
                  console.log(rawData);
                  console.log("do you work?");
             }


            //no overflow
            if (rawData.slice(1, 4)==="---"){
                console.log("word")

            var dataWithMeta = this.removeTrail(rawData);
            console.log(dataWithMeta);
            var data = dataWithMeta.slice(1, dataWithMeta.length);
            console.log(data);
            var dataToString = this.hexToString(data);
            var fullData = dataString + dataToString;
            _StdOut.putText(filename + " reads: " + fullData);
              }
              // else{
              //     //TODO check overlfow first!!! and make string
              //    //overflow
              //   console.log("overflow");

              //   var metaForNext = rawData.slice(1, 4);
              //   console.log(metaForNext);

              //   var dataWithMeta = this.removeTrail(rawData);
              //   console.log(dataWithMeta);
              //   var data = dataWithMeta.slice(4, dataWithMeta.length);
              //   console.log(data);
              //   var dataToString = this.hexToString(data);

                
              //   _StdOut.putText(filename + " reads: " + dataToString );




              // }
            
        }

        public deleteFile(filename){
            var foundFileMeta;
            var foundFileLoc;
            dance:
            for (var y = 0; y < this.sector; y++) {
                for (var z = 0; z < this.block; z++) {
                    //if block is not in use it becomes next avail directory
                    console.log(this.removeTrail(sessionStorage.getItem("b0" + y + z).slice(4, (sessionStorage.getItem("b0" + y + z).length))));
                    console.log(this.stringToHex(filename));
                    if (this.removeTrail(sessionStorage.getItem("b0" + y + z).slice(4, (sessionStorage.getItem("b0" + y + z).length)))
                        == this.stringToHex(filename))
                    {
                        foundFileLoc = "b0" + y + z;
                        foundFileMeta = sessionStorage.getItem("b0" + y + z).slice(1,4);

                        console.log(foundFileMeta);
                        //breaks loop
                        break dance;
                    }
                }
            }
            console.log(foundFileMeta);

            var nextMeta = sessionStorage.getItem("b" + foundFileMeta).slice(1,4);

            while(!(nextMeta ===  "---")){
                sessionStorage.setItem("b" + foundFileMeta, this.addTrail("0"));
                foundFileMeta = nextMeta;
                nextMeta = sessionStorage.getItem("b" + foundFileMeta).slice(1,4);
                this.updateMbr();
            }
            console.log("Meta");
            console.log(foundFileMeta);
            sessionStorage.setItem("b" + foundFileMeta, this.addTrail("0"));

            console.log(foundFileLoc);
            sessionStorage.setItem(foundFileLoc, this.addTrail("0"));
            this.updateMbr();


            this.removeFromFileNameArray(filename);




            _StdOut.putText("Successfully deleted: " +filename);





        }









    }
}

