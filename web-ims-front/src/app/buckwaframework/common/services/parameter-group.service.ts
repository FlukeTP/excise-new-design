import { Injectable } from "@angular/core";
import { Headers, Http } from "@angular/http";

import { ParameterGroup } from "../../common/models";

@Injectable()
export class ParameterGroupService {
  readonly url = "preferences/parameterGroup";
  private headers = new Headers({ "Content-Type": "application/json" });

  constructor(private http: Http) {}

  create(parameterGroup: ParameterGroup): Promise<ParameterGroup> {
    return this.http
      .post(this.url, parameterGroup, { headers: this.headers })
      .toPromise()
      .then(res => JSON.parse(res["_body"]).data as ParameterGroup)
      .catch(this.handleError);
  }

  delete(parameterGroup: string): Promise<ParameterGroup> {
    return this.http
      .delete(this.url + "/" + parameterGroup, { headers: this.headers })
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  update(parameterGroup: ParameterGroup): Promise<ParameterGroup> {
    return this.http
      .put(this.url, parameterGroup, { headers: this.headers })
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  read(parameterGroup: ParameterGroup): Promise<ParameterGroup> {
    return this.http
      .get(this.url + "/" + parameterGroup.operationId, {
        headers: this.headers
      })
      .toPromise()
      .then(res => JSON.parse(res["_body"]).data as ParameterGroup)

      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error("An error occurred", error); // for demo purposes only
    return Promise.reject(error.parameterGroup || error);
  }
}
