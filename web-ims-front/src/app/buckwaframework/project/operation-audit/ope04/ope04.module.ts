import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { reducers } from '../ope02/ope02.reducers';
import { Ope04RoutingModule } from './ope04-routing.module';
import { Ope04Component } from './ope04.component';
import { Ope0402Component } from './ope0402/ope0402.component';
import { Ope0403Component } from './ope0403/ope0403.component';
import { Ope0404Component } from './ope0404/ope0404.component';
import { Ope0405Component } from './ope0405/ope0405.component';
import { Ope0408Component } from './ope0408/ope0408.component';
import { Ope0410Component } from './ope0410/ope0410.component';
import { Ope0412Component } from './ope0412/ope0412.component';
import { Ope041201Component } from './ope0412/ope041201/ope041201.component';
import { Ope041202Component } from './ope0412/ope041202/ope041202.component';

@NgModule({
  declarations: [
    Ope04Component,
    Ope0402Component,
    Ope0403Component,
    Ope0404Component,
    Ope0405Component,
    Ope0408Component,
    Ope0410Component,
    Ope0412Component,
    Ope041201Component,
    Ope041202Component,
  ],
  imports: [
    CommonModule,
    Ope04RoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    StoreModule.forFeature('Ope02', reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states      
    }),
  ]
})
export class Ope04Module { }
