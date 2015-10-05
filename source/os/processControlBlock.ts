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
				          public zflag = null
		) {

		}

public init(): void {
	//initializes instance of PCB with CPU values
	    this.pid = _CPU.PIDArray.length;
		this.pc = _CPU.PC;
		this.acc = _CPU.Acc;
		this.xreg = _CPU.Xreg;
		this.yreg = _CPU.Yreg;
		this.zflag = _CPU.Zflag;
			  };

public printPCB(): void {
	//prints pcb properties to diplay
	var printPc = document.getElementById("pcStatusDisplay");
	//var printIr = document.getElementById("irStatusDisplay");
	var printAcc = document.getElementById("accStatusDisplay");
	var printXr = document.getElementById("xrStatusDisplay");
	var printYr = document.getElementById("yrStatusDisplay");
	var printZf = document.getElementById("zfStatusDisplay");


   printPc.innerHTML = this.pc;
   //printIr.innerHTML = this.ir;
   printAcc.innerHTML = this.acc;
   printXr.innerHTML = this.xreg;
   printYr.innerHTML = this.yreg;
   printZf.innerHTML = this.zflag;
			  };



 	  }
}