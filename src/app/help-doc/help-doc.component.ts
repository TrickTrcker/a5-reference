import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-help-doc',
  templateUrl: './help-doc.component.html',
  styleUrls: ['./help-doc.component.scss']
})
export class HelpDocComponent implements OnInit,OnChanges {
  @Input() cheatsheet: any;
  cheatsheetvalues : any;
  constructor() { 
   
  }

  ngOnInit() {
    console.log("cheatsheet: ",this.cheatsheet);
  }
  ngOnChanges(changes: SimpleChanges): void {
 console.log("cheatsheet changes: ",changes);
 if(changes.cheatsheet)
 {
  this.cheatsheetvalues = changes.cheatsheet.currentValue;
 }
  }

}
