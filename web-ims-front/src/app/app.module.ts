import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from '@angular/http';
import { BrowserModule } from "@angular/platform-browser";
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AuthGuardChild } from 'services/auth-guard-child.service';
// components
import { AppComponent } from "./app.component";
import { reducers } from './app.reducers';
// routing
import { AppRoutingModule } from "./buckwaframework/common/configs/app-routing.module";
// services
import { AjaxService, AuthGuard, AuthService, CanDeactivateGuard, DialogService, ExciseService, IaService, MessageBarService, MessageService, ParameterGroupService, ParameterInfoService, ProvinceService, UnauthGuard } from "./buckwaframework/common/services";
import { TranslateService } from './buckwaframework/common/services/translate.service';
import { SharedModule } from './buckwaframework/common/templates/shared.module';
import { LoginPage } from "./buckwaframework/project/pages/login/login";
import { DepartmentDropdownService } from 'services/department-dropdown.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginPage,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpModule,
    HttpClientModule,
    CommonModule,
    SharedModule,
    DragDropModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states      
    }),
  ],
  providers: [
    AuthGuard,
    AuthGuardChild,
    AuthService,
    MessageBarService,
    MessageService,
    TranslateService,
    ParameterGroupService,
    ParameterInfoService,
    AjaxService,
    ExciseService,
    CanDeactivateGuard,
    DialogService,
    IaService,
    UnauthGuard,
    ProvinceService,
    DepartmentDropdownService //departmentVo
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
