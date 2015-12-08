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
						  public limit = null,
						  public state = null,
						  public priority = null
		) {

		}

public init(): void {
	//initializes instance of PCB with CPU values
	    this.pid = _pidCount++;
		this.pc = 0;
		this.acc = 0;
		this.xreg = 0;
		this.yreg = 0;
		this.zflag = 0;
		this.ir = "";
		this.base = 0;
		this.limit = 0;
		this.state = "New";
		//initalized to 5
		this.priority = 5;
			  };






 	  }
}