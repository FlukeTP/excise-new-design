import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonFooterReportComponent } from './button-footer-report.component';
import { SharedModule } from 'app/buckwaframework/common/templates/shared.module';

@NgModule({
  declarations: [ButtonFooterReportComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ButtonFooterReportComponent
  ]
})
export class ButtonFooterReportModule { }
