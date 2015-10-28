///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="../host/control.ts" />
///<reference path="shell.ts" />



/* ------------
   processControlBlock.ts

   PCB yo
   ------------ */
module TSOS {

   	export class ProcessControlBlock {

			  constructor(public pid = null,
				 		  public pc = null,
				 		  public acc = null,
				  	      public xreg = null,
				          public yreg = null,
				          public zflag = null,
						  public ir = null,
						  public base = null,
						  public limit = null
		) {

		}

public init(): void {
	//initializes instance of PCB with CPU values
	    this.pid = _residentList.length - 1;
		this.pc = 0;
		this.acc = 0;
		this.xreg = 0;
		this.yreg = 0;
		this.zflag = 0;
		this.ir = "";
		this.base = 0;
		this.limit = 0;
			  };



			  public printReadyQueue(): void {
				//gets table
				  // var pcbTable = document.getElementById("pcbReadyQueueTable");
				  // var pcbTableLength = pcbTable.getElementsByTagName("tr").length;
				  // console.log(pcbTableLength);
				  // var pcbRow = pcbTable.insertRow(pcbTableLength);

				  // var printPidCell = pcbRow.insertCell(0);
				  // var printPcCell = pcbRow.insertCell(1);
				  // var printIrCell = pcbRow.insertCell(2);
				  // var printAccCell = pcbRow.insertCell(3);
				  // var printXCell = pcbRow.insertCell(4);
				  // var printYCell = pcbRow.insertCell(5);
				  // var printZCell = pcbRow.insertCell(6);
				  // var printBaseCell = pcbRow.insertCell(7);
				  // var printLimitCell = pcbRow.insertCell(8);

				  // printPidCell.innerHTML = this.pid;
				  // printPcCell.innerHTML = this.pc;
				  // printIrCell.innerHTML = this.ir;
				  // printAccCell.innerHTML = this.acc;
				  // printXCell.innerHTML = this.xreg;
				  // printYCell.innerHTML = this.yreg;
				  // printZCell.innerHTML = this.zflag;
				  // printBaseCell.innerHTML = this.base;
				  // printLimitCell.innerHTML = this.limit;
				 

				 
				  	  };

			  public printResidentList(): void {
				//gets table
				  var pcbTable = document.getElementById("pcbResidentListTable");
				  var pcbTableLength = pcbTable.getElementsByTagName("tr").length;
				  console.log(pcbTableLength);
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

				  printPidCell.innerHTML = this.pid;
				  printPcCell.innerHTML = this.pc;
				  printIrCell.innerHTML = this.ir;
				  printAccCell.innerHTML = this.acc;
				  printXCell.innerHTML = this.xreg;
				  printYCell.innerHTML = this.yreg;
				  printZCell.innerHTML = this.zflag;
				  printBaseCell.innerHTML = this.base;
				  printLimitCell.innerHTML = this.limit;
				 

				 
				  	  };

public printPCB(): void {
	//retrieves pcb contents
	var printPc = document.getElementById("pcStatusDisplay");
	var printAcc = document.getElementById("accStatusDisplay");
	var printXr = document.getElementById("xrStatusDisplay");
	var printYr = document.getElementById("yrStatusDisplay");
	var printZf = document.getElementById("zfStatusDisplay");
	var printIr = document.getElementById("irStatusDisplay");

	//prints content to screen
    printPc.innerHTML = this.pc;
    printAcc.innerHTML = this.acc;
    printXr.innerHTML = this.xreg;
    printYr.innerHTML = this.yreg;
    printZf.innerHTML = this.zflag;
    printIr.innerHTML = this.ir;

	 		  };



 	  }
}