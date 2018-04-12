import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';
import { AppConstant } from '../app.constant';
import { PrimengConstant } from '../app.primeconfig';
import { LocalStorageService } from './local-storage.service';
import { MessagesService } from '../shared/messages.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
@Injectable()
export class JWTTokenInterceptorService {

    constructor(private localStorageService: LocalStorageService, private messageservice: MessagesService,
        private route: ActivatedRoute, private confirmationservice: ConfirmationService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        var authToken: any = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.TOKEN);
        var user: any = this.localStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
        if (authToken && authToken.token) {
            req = req.clone({
                setHeaders: {
                    'x-access-token': authToken.token,
                    'user-data': [user.userid, user.tenantid, AppConstant.APP.MODULE_NAME]
                }
                 });
        }
        else {
            console.error('Token Empty');
        }

        return next.handle(req)
            .do(event => {
                console.log(this.route.paramMap);
                var res: any = event;
                if (res.type > 1) {
                    if (res.status == 203) {
                        if (window.location.hash.indexOf("#/ibacus") < 0 && res.url.indexOf('/role/') < 0 ) {
                            if (res.body.code == "403") {
                                this.localStorageService.clearAllItem();
                                var confirmobject = {
                                    message: res.body.message,
                                    rejectVisible : false,
                                    // acceptVisible : false,
                                    // rejectLabel : "Ok", 
                                    acceptIcon : "fa-check",
                                    acceptLabel : "OK",
                                    accept: () => {
                                        //Actual logic to perform a confirmation
                                        window.location.href = AppConstant.ACCOUNT.ACC_URL + "/appcenter";
                                    },
                                    // reject:() => {
                                    //     window.location.href = "./assets/access.html";
                                    // }
                                };
                                this.confirmationservice.confirm(confirmobject);
                            }
                            else {
                                window.location.href = "./assets/access.html";
                            }

                            return false;
                        }

                    }
                }
            },
            error => {
                if (error instanceof HttpErrorResponse && error.status == 0 && PrimengConstant.GLOBAL_ERROR.SERVER_PROB_MSG_ENABLE) {
                    this.messageservice.showMessage({ severity: 'error', summary: 'Error ', detail: PrimengConstant.GLOBAL_ERROR.SERVER_PROBLEM });
                    return false;
                }
                else if (error instanceof HttpErrorResponse && error.status >= 400) {
                    // Handle Error
                    console.error("Error Happend while communicating API");
                    console.error(`Info: url : ${error.url} status: ${error.status}`);
                    this.messageservice.showMessage({ severity: 'error', summary: 'Error ', detail: PrimengConstant.GLOBAL_ERROR.SERVER_PROBLEM });
                }
            }
            );
    }

}
