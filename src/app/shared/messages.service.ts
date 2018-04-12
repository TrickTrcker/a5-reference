import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import {Message} from 'primeng/primeng';
import * as _ from "lodash";

@Injectable()
export class MessagesService {

  private messages = new Subject<Message>();
  private successMessage = new Subject<Message>();
  private keepAfterRouteChange = false;

  constructor(private router: Router) {

    // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {        
          // clear alert messages
          this.clearMessages();     
      }
    });

   }

   getMessages(): Observable<any> {
      return this.messages.asObservable();
   }

   getSuccessMessage(): Observable<any> {
      return this.successMessage.asObservable();
   }

   showMessage(messageObj : Message,clearMessage:boolean=true) {
     if(clearMessage) this.clearMessages();    
     this.messages.next(messageObj);
   }

   showAllMessages(messageList : Message[]){   
     this.clearMessages();  
      _.forEach(messageList,(message)=>this.showMessage(message,false));
   }

   showSuccessMessage(messageObj : Message){
     this.successMessage.next(messageObj);
   }

   clearMessages() {
     setTimeout(()=>{  
      this.messages.next();
    },10000) 
   }

}
