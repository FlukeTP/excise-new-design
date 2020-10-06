import { AfterViewInit, Component, OnInit } from "@angular/core";
import { NavigationCancel, NavigationEnd, NavigationStart, Router } from "@angular/router";
import { BreadcrumbContant } from 'projects/tax-audit/tax-audit-new/BreadcrumbContant';
import { MessageBarService } from "services/message-bar.service";
import { AjaxService } from 'services/ajax.service';
import { ResponseData, UserDetail } from 'models/index';
import { MessageService } from 'services/message.service';
import { COLOR } from "../constants/color";
// models
import { User } from "../models";
// services
import { AuthService } from "../services/auth.service";
import { TranslateService } from "../services/translate.service";

import { NavItem } from './nav-item';
import { UserModel } from 'models/user.model';
declare var $: any;

@Component({
    selector: 'app-layout',
    templateUrl: 'layout.component.html',
    styleUrls: ['layout.component.css']
})
export class LayoutComponent implements OnInit, AfterViewInit {
    b: BreadcrumbContant = new BreadcrumbContant();
    user: User;
    userdetail: UserModel = {
        authorityList: [],
        officeCode: "",
        title: "",
        userThaiName: "",
        userThaiSurname: "",
        username: "",
        departmentName: "",
        subdeptCode: "",
        subdeptLevel: "",
        isCentral: false,
        systemName: ""
    };
    role: string[] = [];
    loading: boolean;
    navbarStyles: any = {
        ...COLOR.NAVBAR,
        "z-index": 999,
        "height": '71px',
    };
    footerStyles = {
        ...COLOR.NAVBAR
    };
    sidebarStyles = {
        ...COLOR.SIDEBAR,
        'font-size': 'small',
        'width': '19.5%'
    };
    headerStyles = {
        ...COLOR.SEGMENT_HEADER,
        // More styles
    };
    onLoginPage: boolean = false;
    TaRoleShowMenu: boolean = true;
    menuList: NavItem[] = [];
    constructor(
        public authService: AuthService,
        private router: Router,
        private translateService: TranslateService,
        private messageBarService: MessageBarService,
        private ajax: AjaxService
    ) {
        this.getMenuList();
    }

    async ngOnInit() {
        $('.ui.accordion').accordion();
        this.translateService.use("th");
        await this.authService.getUserProfile().then(res => {
            if (res) {
                this.role = this.authService.getRole();
            }
        });
        this.user = this.authService.getUser();
        this.userdetail = this.authService.getUserDetails();
    }

    ngAfterViewInit(): void {
        $(".ui.modal.condition").modal({
            centered: false
        });
        $(".dropdown").dropdown();
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                setTimeout(() => {

                    this.loading = false;
                }, 500);
                $('body').css({
                    overflow: 'hidden !important',
                    height: '100vh !important'
                });
            } else if (
                event instanceof NavigationEnd ||
                event instanceof NavigationCancel
            ) {
                $('body').css({
                    overflowY: 'auto !important',
                    height: '100% !important'
                });
                this.loading = false;
                if (!this.authService.getLogin()) {
                    this.authService.getUserProfile().then(obj => {
                        this.onLoginPage = event.url === '/login' && !obj;
                        if (this.onLoginPage) {
                            this.navbarStyles = {
                                "display": 'none'
                            }
                        } else {
                            this.navbarStyles = {
                                ...COLOR.NAVBAR,
                                "z-index": 999,
                                "height": '71px'
                            }
                        }
                    });
                }
            }
        });
    }

    logout(): void {
        this.messageBarService.comfirm((res) => {
            if (res) {
                $('.ui.sidebar').sidebar({
                    context: '.ui.grid.pushable'
                })
                    .sidebar('setting', 'transition', 'push')
                    .sidebar('setting', 'dimPage', false)
                    .sidebar('hide');
                this.authService.logout();
            }
        }, "ยืนยันการออกจากระบบ")
    }

    menuToggle(): void {
        $('.ui.sidebar').sidebar({
            context: '.ui.grid.pushable'
        })
            .sidebar('setting', 'transition', 'push')
            .sidebar('setting', 'dimPage', false)
            .sidebar('toggle')
            // fix slidebar menu push any class .item
            // .sidebar('attach events', '.item')

            .sidebar('attach events', '.title.sub.empty.acd-text')
        //'.menu .item',
        setTimeout(() => {
            $('.dropdown').dropdown();
        }, 200);
    }

    urlActivate(urlMatch): boolean {
        return this.router.url == urlMatch;
    }

    changeToEnglish(): void {
        this.translateService.use("en");
    }

    changeToThai(): void {
        this.translateService.use("th");
    }

    checkRole(listAuthRole: string[], listRole: string[]): boolean {
        for (let i = 0; i < listAuthRole.length; i++) {
            for (let j = 0; j < listRole.length; j++) {
                if (listAuthRole[i] == listRole[j]) {
                    return true;
                }
            }
        }
        return false;
    }

    getMenuList(): void {
        const URL = "access-control/menu/list";
        this.ajax.doPost(URL, {}).subscribe((res: ResponseData<NavItem[]>) => {
            if (MessageService.MSG.SUCCESS == res.status) {
                if (0 < res.status.length) {
                    this.menuList = []
                    this.menuList = res.data;
                    console.log("menuList => ", this.menuList);
                }
            } else {
                this.messageBarService.errorModal(res.message);
            }
        })
    }

    routeClick(): void {
        console.log("TOGGLE");
    }

}
