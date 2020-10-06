import { Component } from "@angular/core";
import { AuthService } from "services/auth.service";
import { Router } from "@angular/router";

declare var $: any;

@Component({
  selector: "page-home",
  templateUrl: "home.html",
  styleUrls: ["./home.css"]
})
export class HomePage {
  position: string;
  constructor(private authService: AuthService, private router: Router) {
    // TODO
  }
}
