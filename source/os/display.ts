///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="../host/control.ts" />
///<reference path="shell.ts" />



/* ------------
   display.ts

   Holds function that prints values to the display.
   ------------ */
module TSOS {

   	export class Display {

   		  public printFullReadyQueue(): void {
   		  var pcbTable = document.getElementById("pcbReadyQueueTable");
   		  var pcbTableLength = pcbTable.getElementsByTagName("tr").length;
   		  //first clear
   		  for (var i = 1; pcbTableLength > i; i++) {
   			  pcbTable.deleteRow(1);
   		  }

   		  	  for (var i = 0; _readyQueue.length > i; i++) {
   		  		  this.printOneReadyQueue(_readyQueue[i]);

   		    	}
   		    }


   		  public printOneReadyQueue(pcb): void {
   			//gets table
   			  var pcbTable = document.getElementById("pcbReadyQueueTable");
   			  var pcbTableLength = pcbTable.getElementsByTagName("tr").length;
   			  var pcbRow = pcbTable.insertRow(pcbTableLength);

   			  var printPidCell = pcbRow.insertCell(0);
   			  var printPcCell = pcbRow.insertCell(1);
   			  var printIrCell = pcbRow.insertCell(2);
   			  var printAccCell = pcbRow.insertCell(3);
   			  var printXCell = pcbRow.insertCell(4);
   			  var printYCell = pcbRow.insertCell(5);
   			  var printZCell = pcbRow.insertCell(6);
   			  var printBaseCell = pcbRow.insertCell(7);
   			  var printLimitCell = pcbRow.insertCell(8);
   			  var printStateCell = pcbRow.insertCell(9);

   			  printPidCell.innerHTML = pcb.pid;
   			  printPcCell.innerHTML = pcb.pc;
   			  printIrCell.innerHTML = pcb.ir;
   			  printAccCell.innerHTML = pcb.acc;
   			  printXCell.innerHTML = pcb.xreg;
   			  printYCell.innerHTML = pcb.yreg;
   			  printZCell.innerHTML = pcb.zflag;
   			  printBaseCell.innerHTML = pcb.base;
   			  printLimitCell.innerHTML = pcb.limit;
   			  printStateCell.innerHTML = pcb.state;
   			 
   			  	  };
   		

   		  public printFullResidentList(): void {
   		var pcbTable = document.getElementById("pcbResidentListTable");
   		var pcbTableLength = pcbTable.getElementsByTagName("tr").length;
   		//first clear
   		for (var i = 1; pcbTableLength > i; i++) {
   			pcbTable.deleteRow(1);
   		}

   			  for (var i = 0; _residentList.length > i; i++) {
   				  this.printOneResidentList(_residentList[i]);

   		  	}
   		  }



   		  public printOneResidentList(pcb): void {
   			//gets table
   			  var pcbTable = document.getElementById("pcbResidentListTable");
   			  var pcbTableLength = pcbTable.getElementsByTagName("tr").length;
   			  var pcbRow = pcbTable.insertRow(pcbTableLength);

   			  var printPidCell = pcbRow.insertCell(0);
   			  var printPcCell = pcbRow.insertCell(1);
   			  var printIrCell = pcbRow.insertCell(2);
   			  var printAccCell = pcbRow.insertCell(3);
   			  var printXCell = pcbRow.insertCell(4);
   			  var printYCell = pcbRow.insertCell(5);
   			  var printZCell = pcbRow.insertCell(6);
   			  var printBaseCell = pcbRow.insertCell(7);
   			  var printLimitCell = pcbRow.insertCell(8);
   			  var printStateCell = pcbRow.insertCell(9);

   			  printPidCell.innerHTML = pcb.pid;
   			  printPcCell.innerHTML = pcb.pc;
   			  printIrCell.innerHTML = pcb.ir;
   			  printAccCell.innerHTML = pcb.acc;
   			  printXCell.innerHTML = pcb.xreg;
   			  printYCell.innerHTML = pcb.yreg;
   			  printZCell.innerHTML = pcb.zflag;
   			  printBaseCell.innerHTML = pcb.base;
   			  printLimitCell.innerHTML = pcb.limit;
   			  printStateCell.innerHTML = pcb.state;
   		


   		  };

          public printFullHardDrive(): void {
             var hdTable = document.getElementById("hardDriveTable");
             var hdTableLength = hdTable.getElementsByTagName("tr").length;
             //first clear
             for (var i = 1; hdTableLength > i; i++) {
                hdTable.deleteRow(1);
             }

             for (var x = 0; x < _krnFileSystemDriver.track; x++) {
                 for (var y = 0; y < _krnFileSystemDriver.sector; y++) {
                     for (var z = 0; z < _krnFileSystemDriver.block; z++) {

                   this.printOneHardDrive((x +":"+ y+":" + z),sessionStorage.getItem("b" + x + y + z));
                       
                     }
                 }
             }
     
    

              };

           public printOneHardDrive(tsb,hdEntry): void {
            //gets table
              var hdTable = document.getElementById("hardDriveTable");
              var hdTableLength = hdTable.getElementsByTagName("tr").length;
              var hdRow = hdTable.insertRow(hdTableLength);

              var printTSBCell = hdRow.insertCell(0);
              var printMetaCell = hdRow.insertCell(1);
              var printDataCell = hdRow.insertCell(2);



              printTSBCell.innerHTML = tsb;
              printMetaCell.innerHTML = hdEntry.slice(0, 4);
              printDataCell.innerHTML = hdEntry.slice(4,64);


           };










 	  }
}