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
						  public ir = null
		) {

		}

public init(): void {
	//initializes instance of PCB with CPU values
	    this.pid = _pcbArray.length - 1;
		this.pc = 0;
		this.acc = 0;
		this.xreg = 0;
		this.yreg = 0;
		this.zflag = 0;
		this.ir = "";
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