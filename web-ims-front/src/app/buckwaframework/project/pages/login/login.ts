import { Component, OnInit } from "@angular/core";
import { User, ResponseData } from "../../../common/models";
import { MessageBarService, AjaxService } from "../../../common/services";
import { AuthService } from "../../../common/services/auth.service";
const URLS = {
GET_VERSION: "preferences/parameter/SYSTEM_CONFIG/APP_VERSION"
}

@Component({
  selector: "page-login",
  templateUrl: "login.html",
  styleUrls: ["login.css"]
})
export class LoginPage implements OnInit {
  username: string = "pccoisadm";
  password: string = "password";
  loading: boolean;
  varsion: any;

  constructor(
    public authService: AuthService,
    private messageBarService: MessageBarService,
    private ajax: AjaxService
  ) { }

  ngOnInit() {
    this.getDorpdownCoa()
   }

  onLogin() {
    this.loading = true;
    const user: User = {
      username: this.username,
      password: this.password,
      exciseBaseControl: null
    };
    this.authService
      .login(user)
      .then(ok => {
        this.loading = false;
      })
      .catch(error => {
        this.messageBarService.errorModal(
          "ไม่สามารถเข้าสู่ระบบได้",
          "เกิดข้อผิดพลาด"
        );
        this.loading = false;
      });
  }

  onKey(event: KeyboardEvent) {
    let keyCode = event.code || event.keyCode;
    if (keyCode === "Enter" || keyCode === 13) {
      this.onLogin();
    }
  }

  getDorpdownCoa() {
    this.ajax.doGet(`${URLS.GET_VERSION}`).subscribe((res: ResponseData<any>) => {
      this.varsion = res.data;
      console.log(this.varsion);
    });
  }
}
