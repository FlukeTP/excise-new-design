import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';
import { Ope01RoutingModule } from './ope01-routing.module';
import { Ope01Component } from './ope01.component';
import { Ope0102Component } from './ope0102/ope0102.component';
import { Ope0103Component } from './ope0103/ope0103.component';
import { Ope0104Component } from './ope0104/ope0104.component';
import { Ope0105Component } from './ope0105/ope0105.component';
import { Ope0106Component } from './ope0106/ope0106.component';
import { Ope0107Component } from './ope0107/ope0107.component';
import { Ope010701Component } from './ope0107/ope010701/ope010701.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers } from './ope01.reducers';

@NgModule({
  declarations: [
    Ope01Component,
    Ope0102Component,
    Ope0103Component,
    Ope0104Component,
    Ope0105Component,
    Ope0106Component,
    Ope0107Component,
    Ope010701Component,
  ],
  imports: [
    CommonModule,
    Ope01RoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    StoreModule.forFeature('Ope02',reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states      
    }),
  ]
})
export class Ope01Module { }
