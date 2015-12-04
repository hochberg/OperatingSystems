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
                    //sets current file to being used
                    sessionStorage.setItem("b" + meta, this.addTrail("1" ));
                    //updates mbr
                    this.updateMbr();
                    //if there is more overflow, finds next avail file for meta
                    if (!(dataArray[1] == null)){
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

            //prints success message to console
            _StdOut.putText("Successfully Written To: " + filename);

        }

        //loops through global file array to check if specified filename is within
        public inFileNameArray(filename){
            var inArray = false;
            for (var i = 0; _fileNameArray.length > i; i++){
                if (filename==_fileNameArray[i]){
                    inArray = true;
                }
            }
            return inArray;
        }

        //removes given filename from gloabl filename array
        public removeFromFileNameArray(filename){
            for (var i = 0; _fileNameArray.length > i; i++){
                if (filename==_fileNameArray[i]){
                    _fileNameArray.splice(i, 1);
                }
            }
        }

        public readFile(filename){
            //initializes variable to be set to the file's meta
            var foundFileMeta;
            //loops through block and sector to find specified filename
            dance:
            for (var y = 0; y < this.sector; y++) {
                for (var z = 0; z < this.block; z++) {
                    //if block is not in use it becomes next avil directory
                    if (this.removeTrail(sessionStorage.getItem("b0" + y + z).slice(4, (sessionStorage.getItem("b0" + y + z).length)))
                        == this.stringToHex(filename))
                    {
                        //when found, records meta data of file
                        foundFileMeta = sessionStorage.getItem("b0" + y + z).slice(1,4);
                        //breaks loop
                        break dance;
                    }
                }
            }
            //retrieves the data (unformatted) from the specfied file
            var rawData = sessionStorage.getItem("b" + foundFileMeta);

            //initalizes string to hole data
            var dataString = "";
            //while there exists overflow
              while(!(rawData.slice(1, 4)==="---")){
                  //connvert current file's data to hex
                  var stringChunck = this.hexToString(rawData.slice(4, rawData.length));
                  //tack it onto the datastring (back of)
                  dataString = dataString + stringChunck ;
                  //record the meta to point to the next file
                  var nextMeta = rawData.slice(1, 4);
                  //continues by setting rawdata to next file's data
                  rawData = sessionStorage.getItem("b" + nextMeta);
             }


            //when there no longer exists overflow
            if (rawData.slice(1, 4)==="---"){
                //remove trail of last data
                var dataWithMeta = this.removeTrail(rawData);
                //remove meta
                var data = dataWithMeta.slice(1, dataWithMeta.length);
                //convert to string
                var dataStringCaboose = this.hexToString(data);
                //tack onto end of dataString
                var fullData = dataString + dataStringCaboose;
                
                //print to console
                _StdOut.putText(filename + " reads: " + fullData);
              }

            
        }

        public deleteFile(filename){
            //initializes variable to be set to locate of file name
            var foundFileLoc;
            //initalizes that files meta 
            var foundFileMeta;
            
            //transverses sectors and blocks to find matching filename
            dance:
            for (var y = 0; y < this.sector; y++) {
                for (var z = 0; z < this.block; z++) {
                    //if block is not in use it becomes next avail directory
                    if (this.removeTrail(sessionStorage.getItem("b0" + y + z).slice(4, (sessionStorage.getItem("b0" + y + z).length)))
                        == this.stringToHex(filename))
                    {
                        //sets file loc
                        foundFileLoc = "b0" + y + z;
                        //sets file meta
                        foundFileMeta = sessionStorage.getItem("b0" + y + z).slice(1,4);
                        //breaks loop
                        break dance;
                    }
                }
            }

            //initializes the files next meta
            var nextMeta = sessionStorage.getItem("b" + foundFileMeta).slice(1,4);

            //while the next meta is not the last
            while(!(nextMeta ===  "---")){
                //clears current file
                sessionStorage.setItem("b" + foundFileMeta, this.addTrail("0"));
                //sets current to next meta
                foundFileMeta = nextMeta;
                //finds next meta
                nextMeta = sessionStorage.getItem("b" + foundFileMeta).slice(1,4);
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
            _StdOut.putText("Successfully deleted: " +filename);

        }



    }
}

