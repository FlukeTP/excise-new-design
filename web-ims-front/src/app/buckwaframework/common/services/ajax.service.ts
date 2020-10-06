import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Headers, Http } from "@angular/http";
import { Router } from '@angular/router';
import { empty } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class AjaxService {
  public static JSON_HEADER = new Headers({
    "Content-Type": "application/json"
  });
  public static FORM_HEADER = new Headers({
    "Content-Type": "application/x-www-form-urlencoded"
  });

  public static CONTEXT_PATH = "/excise-backend/api/";
  public static isDebug = true;
  z
  constructor(
    private http: Http,
    private httpClient: HttpClient,
    private router: Router
  ) { }

  doPost(url: string, body: any) {
    if (AjaxService.isDebug) {
      console.log("URL : ", AjaxService.CONTEXT_PATH + url);
      console.log("Params : ", body);
    }
    return this.httpClient.post(AjaxService.CONTEXT_PATH + url, body).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((err, caught) => {
        if (err.status == 401 && "security/user-profile" != url) {
          window.location.reload();
          if (AjaxService.isDebug) {
            console.error("Redirect to LoginPage");
          }
        } else {
          if ("security/user-profile" == url) {
            this.router.navigate(["/login"]);
          }
          if (err.status != 401) {
            console.error("Message Error => ", err, caught);
          }
        }
        return empty();
      })
    );
  }

  doGet(url: string) {
    if (AjaxService.isDebug) {
      console.log("URL : ", AjaxService.CONTEXT_PATH + url);
    }
    return this.httpClient.get(AjaxService.CONTEXT_PATH + url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.doHandleError)
    );
  }

  doPut(url: string, body: any) {
    if (AjaxService.isDebug) {
      console.log("URL : ", AjaxService.CONTEXT_PATH + url);
      console.log("Params : ", body);
    }
    return this.httpClient.put(AjaxService.CONTEXT_PATH + url, body).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.doHandleError)
    );
  }

  doDelete(url: string) {
    if (AjaxService.isDebug) {
      console.log("URL : ", AjaxService.CONTEXT_PATH + url);
    }
    return this.httpClient.delete(AjaxService.CONTEXT_PATH + url).pipe(
      map((response: any) => {
        return response;
      }),
      catchError(this.doHandleError)
    );
  }

  private doHandleError(err, caught) {
    if (err.status == 401) {
      window.location.reload();
      if (AjaxService.isDebug) {
        console.error("Redirect to LoginPage");
      }
    } else {
      if (AjaxService.isDebug) {
        console.error("Message Error => ", err, caught);
      }
    }
    return empty();
  }

  post(url: string, body: any, success: any, error?: any, header?: Headers) {
    if (AjaxService.isDebug) {
      console.log("URL : ", AjaxService.CONTEXT_PATH + url);
      console.log("Params : ", body);
    }
    let httpHeader = AjaxService.JSON_HEADER;
    if (header) {
      httpHeader = header;
    }
    let errorFn = this.handleError;
    if (error) {
      errorFn = error;
    }
    return this.http
      .post(AjaxService.CONTEXT_PATH + url, body, { headers: httpHeader })
      .toPromise()
      .then(success)
      .catch(errorFn);
  }

  get(url: string, success: any, error?: any) {
    let errorFn = this.handleError;
    if (error) {
      errorFn = error;
    }
    let res = this.http
      .get(AjaxService.CONTEXT_PATH + url)
      .toPromise()
      .then(success)
      .catch(errorFn);
    return res;
  }

  private handleError(error: any): Promise<any> {
    console.error("An error occurred", error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  delete(url: string, success: any, error?: any) {
    let errorFn = this.handleError;
    if (error) {
      errorFn = error;
    }
    return this.http
      .delete(AjaxService.CONTEXT_PATH + url)
      .toPromise()
      .then(success)
      .catch(errorFn);
  }

  put(url: string, body: any, success: any, error?: any, header?: Headers) {
    if (AjaxService.isDebug) {
      console.log("URL : ", AjaxService.CONTEXT_PATH + url);
      console.log("Params : ", body);
    }
    let httpHeader = AjaxService.JSON_HEADER;
    if (header) {
      httpHeader = header;
      // httpHeader = AjaxService.FORM_HEADER;
    }
    let errorFn = this.handleError;
    if (error) {
      errorFn = error;
    }
    return this.http
      .put(AjaxService.CONTEXT_PATH + url, body, { headers: httpHeader })
      .toPromise()
      .then(success)
      .catch(errorFn);
  }

  upload(url: string, body: any, success: any, error?: any, header?: Headers) {
    if (AjaxService.isDebug) {
      console.log("URL : ", AjaxService.CONTEXT_PATH + url);
      console.log("Params : ", body);
    }
    var headers = new Headers();
    let errorFn = this.handleError;
    if (error) {
      errorFn = error;
    }
    console.log(body, " ", headers);

    return this.http
      .post(AjaxService.CONTEXT_PATH + url, body, { headers: headers })
      .toPromise()
      .then(success)
      .catch(errorFn);
  }

  download(url: string) {
    let full_url = AjaxService.CONTEXT_PATH + url;
    window.open(full_url);
  }

}
