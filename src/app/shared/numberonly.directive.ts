import { Directive, Input,Output , Inject, HostListener, OnChanges, ElementRef, Renderer2,
     AfterViewInit, OnInit,ChangeDetectorRef,NgZone,EventEmitter } from "@angular/core";
import { FormControl,NgControl,NgModel } from '@angular/forms';

@Directive({
  selector: '[appNumberonly]'
})
export class NumberonlyDirective {

  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef,
  private chRef: ChangeDetectorRef,
  private zone: NgZone,
  private formControl: NgControl) 
  {
    this.el = this.elementRef.nativeElement;   
  }
   
  ngOnInit() {
    this.el.value = this.parse(this.el.value);
   }

  @HostListener("focus", ["$event.target.value"])
  onFocus(value) {
    this.el.value = this.parse(value);
    
    this.zone.runOutsideAngular(()=>{
     this.formControl.control.setValue(this.el.value);
     this.chRef.detectChanges();  
    }); 
  }

  @HostListener("blur", ["$event.target.value"])
  onBlur(value) {
    this.el.value = this.parse(value);
    
    this.zone.runOutsideAngular(()=>{
     this.formControl.control.setValue(this.el.value);
     this.chRef.detectChanges();  
    });
  }

  @HostListener("keyup", ["$event.target.value","$event"]) 
  onKeyUp(value,$event) {
  
    this.el.value = this.parse(value);
    
    this.zone.runOutsideAngular(()=>{
     this.formControl.control.setValue(this.el.value);
     this.chRef.detectChanges();  
    });   
    
  }

   parse(value: string, fractionSize: number = 2): string {
    
    var clean = value.replace(/[^-0-9\.]/g, '');
    var negativeCheck = clean.split('-');
    var decimalCheck = clean.split('.');

     if (negativeCheck[1] != undefined) {
                        negativeCheck[1] = negativeCheck[1].slice(0, negativeCheck[1].length);
                        clean = negativeCheck[0] + '-' + negativeCheck[1];
                        if (negativeCheck[0].length > 0) {
                            clean = negativeCheck[0];
                        }

                    }
        if (decimalCheck[1] != undefined) {
                        decimalCheck[1] = decimalCheck[1].slice(0, 2);
                        clean = decimalCheck[0] + '.' + decimalCheck[1];
                    }

    return clean;
  }

}
