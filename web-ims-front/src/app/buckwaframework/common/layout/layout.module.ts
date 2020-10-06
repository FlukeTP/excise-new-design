import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { ButtonModule, MessageBarModule, MessageFloatModule, ModalModule, SegmentModule } from "components/index";
// routing
import { LayoutRoutingModule } from "../../common/configs/layout-routing.module";
// pipes
import { TranslatePipe } from "../../common/pipes/translate.pipe";
import { PageComponentComponent } from '../../project/page-component/page-component.component';
import { SharedModule } from '../templates/shared.module';
// components
import { LayoutComponent } from "./layout.component";
import { MenuListComponent } from './menu-list/menu-list.component';

@NgModule({
  declarations: [
    LayoutComponent,
    TranslatePipe,
    PageComponentComponent,
    MenuListComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LayoutRoutingModule,
    HttpModule,
    CommonModule,
    // Components
    ButtonModule,
    ModalModule,
    SegmentModule,
    MessageFloatModule,
    MessageBarModule,
    SharedModule
  ],
})
export class LayoutModule { }
