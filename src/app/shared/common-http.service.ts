import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Headers, Response,ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as $ from 'jquery';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
@Injectable()
export class CommonHttpService {
  constructor(private http: HttpClient,private AngHttp: Http) { }
  public globalPostService(url: string, data: any) {
    return this.http.post(url, data).toPromise().catch(e => {
      console.log("error happend", e);
      if (e.status == 401) {
        console.log(e.statusText);
        // window.location.href = "../../access.html"; 
      }
    });

  }
  public globalGetService(url: string, data: any) {
    var querystring = "?" + $.param(data);
    return this.http.get(url + querystring).toPromise().
      catch(e => {
        console.log("error happend", e);
      });
  }

  public globalGetServiceByUrl(url: string, data: any) {
    return this.http.get(url + data).toPromise().
      catch(e => {
        console.log("error Shappend", e);
      });
  }
  public globalPostStreamService(url: string, data: any,header) {
    return this.http.post(url, data,header).toPromise().catch(e => {
      console.log("error happend", e);
      if (e.status == 401) {
        console.log(e.statusText);
        // window.location.href = "../../access.html"; 
      }
    });

  }
  downloadfile(url,data) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url,true);
    xhr.responseType = 'blob';
    xhr.send(JSON.stringify(data));
    xhr.onload = function (e) {
      console.log("downloaded file",e);
      // if (this.status == 200) {
      //  console.log("downloaded file",this.response);
      // } else {
      //   //deal with your error state here
      // }
    };
  }

  HttpBlobPostService(url: string, data: any) {
    return this.AngHttp.post(url,data,{responseType: ResponseContentType.Blob })
    .map(this.extractData)
    .catch(this.handleError);
  }
  private extractData(res: Response) {
    // let body = res.json();
    return res || {};
  }
 
  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
