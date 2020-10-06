import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Ope06Component } from "./ope06.component";
import { Ope0610Component } from "./ope0610/ope0610.component";
import { Ope0611Component } from "./ope0611/ope0611.component";
// import { Ope0612Component } from "./ope0612/ope0612.component";
import { Ope0613Component } from "./ope0613/ope0613.component";
import { Ope0614Component } from "./ope0614/ope0614.component";
import { Ope06RoutingModule } from "./ope06-routing.module";
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    Ope06Component,
    Ope0610Component,
    Ope0611Component,
    // Ope0612Component,
    Ope0613Component,
    Ope0614Component
  ],
  imports: [
    CommonModule,
    Ope06RoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class Ope06Module {}
