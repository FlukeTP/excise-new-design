import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from '@ngrx/store';
import { EnYearToThYear, TextDateTH } from "helpers/index";
import { UserModel } from 'models/user.model';
import * as moment from 'moment';
import { Observable, Subject } from "rxjs";
import { catchError, map } from 'rxjs/operators';
// model
import { ResponseData, User } from "../models";
import { AjaxService } from "./ajax.service";
import { MessageService } from './message.service';
import * as UserAction from "../../../store/actions/user.action";
import _ from 'lodash';

declare var $: any;

@Injectable()
export class AuthService {
  readonly LOGIN_URL = "security/login";
  private userSubject = new Subject<User>();
  private user: User = new User();
  private userDetails: UserModel;
  private userDetailsSub: Observable<UserModel>;
  private isLoggedIn: boolean = false;
  private role: string[] = [];
  // store the URL so we can redirect after logging in
  redirectUrl: string;
  private authenPages: String[];
  constructor(
    private ajaxService: AjaxService,
    private router: Router,
    private store: Store<AppState>,
  ) {
    this.userDetailsSub = this.store.select(state => state.user);
    this.userDetailsSub.subscribe((user: UserModel) => {
      this.userDetails = user;
    });
  }

  login(userBean: User): Promise<any> {
    let body = `username=${userBean.username}&password=${userBean.password}`;
    let _promise = new Promise((resolve, reject) => {
      this.ajaxService.post(
        this.LOGIN_URL,
        body,
        res => {
          this.isLoggedIn = true;
          this.router.navigate(["/home"]);
          resolve("OK");
        },
        (resp: Response) => {
          this.isLoggedIn = false;
          reject("FAIL");
        },
        AjaxService.FORM_HEADER
      );
    });
    return _promise;
  }

  logout(): void {
    this.isLoggedIn = false;
    this.user = new User();
    this.router.navigate(["/login"]); // comment
    this.ajaxService.delete(this.LOGIN_URL, (res: Response) => {
      this.router.navigate(["/login"]);
    });
  }

  reRenderVersionProgram(pageCode) {
    return new Promise<any>((resolve, reject) => {
      resolve(true);
    });
  }

  authState(): Observable<User> {
    return this.userSubject.asObservable();
  }

  getLogin(): boolean {
    return _.clone(this.isLoggedIn);
  }

  getUser(): User {
    return _.clone(this.user);
  }

  getUserDetails(): UserModel {
    return _.clone(this.userDetails);
  }

  getRole(): string[] {
    return _.clone(this.role);
  }

  renderByPage(pages) {
    var countInpage = 0;
    if (
      this.authenPages != null &&
      this.authenPages != undefined &&
      this.authenPages.length > 0
    ) {
      var pageList = pages.split(",");
      pageList.forEach(element => {
        if (this.authenPages.indexOf(element) >= 0) {
          countInpage++;
        }
      });
    } else {
      return this.isLoggedIn;
    }
    return this.isLoggedIn && countInpage > 0;
  }

  getUserProfile(): Promise<boolean> {
    const userProfile = "security/user-profile";
    return new Promise<boolean>((resolve, reject) => {
      this.ajaxService.doPost(userProfile, {})
        .pipe(
          map((response: ResponseData<UserModel>) => {
            if (MessageService.MSG.SUCCESS != response.status) {
              throw response.message;
            }
            return response;
          }),
          catchError(err => {
            throw 'getUserProfile: ' + err;
          }),
        )
        .subscribe((response: ResponseData<UserModel>) => {
          if (MessageService.MSG.SUCCESS == response.status) {
            if (AjaxService.isDebug) {
              console.log("USER PROFILE => ", response.data);
            }
            // this.userDetails = response.data;
            this.user.username = response.data.username;
            this.role = response.data.authorityList;
            this.isLoggedIn = true;
            this.store.dispatch(new UserAction.UpdateUser(response.data));

            // Render Page
            moment().locale('th');
            const day = moment().format('DD');
            const month = TextDateTH.months[parseInt(moment().format('MM')) - 1];
            const year = EnYearToThYear(moment().format('YYYY'));
            const time = moment().format('HH.mm');
            $("#userDetail").html(
              `ชื่อ: ${response.data.userThaiName} ${response.data.userThaiSurname}<br>` +
              `ตำแหน่ง: ${response.data.title}<br>` +
              `สำนักงาน: ${response.data.departmentName}`
            );
            $("#versionProgram").html(`<br>วันที่ ${day} เดือน ${month} พ.ศ. ${year} <br> เวลา ${time} น.`);

            resolve(true);
          } else {
            resolve(false);
            this.isLoggedIn = false;
            this.router.navigate(["/login"]);
          }
        }, error => {
          if (AjaxService.isDebug) {
            console.error("AuthService::getUserProfile => ", error);
          }
          resolve(false);
          this.isLoggedIn = false;
          this.router.navigate(["/login"]);
        });
    });
  }

  public roleMatch(role: string): boolean {
    for (let i = 0; i < this.userDetails.authorityList.length; i++) {
      if (this.userDetails.authorityList[i] == role) {
        return true;
      }
    }
    return false;
  }
}

class AppState {
  user: UserModel
}

export const ROLES = {
  ROLE_OA_AUDITOR: "ROLE_OA_AUDITOR",
  ROLE_OA_OPERATOR: "ROLE_OA_OPERATOR",
  ROLE_OA_HEAD: "ROLE_OA_HEAD",
};
