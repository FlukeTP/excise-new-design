import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Int09RoutingModule } from './int09-routing.module';
import { Int0902Component } from './int0902/int0902.component';
import { Int0904Component } from './int0904/int0904.component';
import { Int0905Component } from './int0905/int0905.component';
import { Int0906Component } from './int0906/int0906.component';
import { Int0907Component } from './int0907/int0907.component';
import { Int0908Component } from './int0908/int0908.component';
import { Int0909Component } from './int0909/int0909.component';
import { Int0910Component } from './int0910/int0910.component';
import { Int0911Component } from './int0911/int0911.component';
import { Int0912Component } from './int0912/int0912.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Int090201Component } from './int0902/int090201/int090201.component';
import { Int091201Component } from './int0912/int091201/int091201.component';
import { Int091202Component } from './int0912/int091202/int091202.component';

@NgModule({
  declarations: [
    Int0902Component,
    Int0904Component,
    Int0905Component,
    Int0906Component,
    Int0907Component,
    Int0908Component,
    Int0909Component,
    Int0910Component,
    Int0911Component,
    Int0912Component,
    Int090201Component,
    Int091201Component,
    Int091202Component
  ],
  imports: [
    CommonModule,
    Int09RoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class Int09Module { }
