import { Injectable } from "@angular/core";
import { Headers, Http } from "@angular/http";

import { ParameterInfo } from "../../common/models";

@Injectable()
export class ParameterInfoService {
  readonly url = "preferences/parameterInfo";
  private headers = new Headers({ "Content-Type": "application/json" });

  constructor(private http: Http) {}

  create(parameterInfo: ParameterInfo): Promise<ParameterInfo> {
    return this.http
      .post(this.url, parameterInfo, { headers: this.headers })
      .toPromise()
      .then(res => JSON.parse(res["_body"]).data as ParameterInfo)
      .catch(this.handleError);
  }

  delete(parameterInfo: string): Promise<ParameterInfo> {
    return this.http
      .delete(this.url + "/" + parameterInfo, { headers: this.headers })
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  update(parameterInfo: ParameterInfo): Promise<ParameterInfo> {
    return this.http
      .put(this.url, parameterInfo, { headers: this.headers })
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  read(parameterInfo: ParameterInfo): Promise<ParameterInfo> {
    return this.http
      .get(this.url + "/" + parameterInfo.paramInfoId, {
        headers: this.headers
      })
      .toPromise()
      .then(res => JSON.parse(res["_body"]).data as ParameterInfo)

      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error("An error occurred", error); // for demo purposes only
    return Promise.reject(error.parameterInfo || error);
  }
}
