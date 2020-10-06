import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonAddComponent } from './button-add/button-add.component';
import { ButtonBackComponent } from './button-back/button-back.component';
import { ButtonCancelComponent } from './button-cancel/button-cancel.component';
import { ButtonCheckComponent } from './button-check/button-check.component';
import { ButtonClearComponent } from './button-clear/button-clear.component';
import { ButtonConfirmComponent } from './button-confirm/button-confirm.component';
import { ButtonCustomComponent } from './button-custom/button-custom.component';
import { ButtonDeleteComponent } from './button-delete/button-delete.component';
import { ButtonDetailComponent } from './button-detail/button-detail.component';
import { ButtonDownloadComponent } from './button-download/button-download.component';
import { ButtonEditComponent } from './button-edit/button-edit.component';
import { ButtonExportComponent } from './button-export/button-export.component';
import { ButtonFinishComponent } from './button-finish/button-finish.component';
import { ButtonHomeComponent } from './button-home/button-home.component';
import { ButtonSaveComponent } from './button-save/button-save.component';
import { ButtonSearchComponent } from './button-search/button-search.component';
import { ButtonUploadComponent } from './button-upload/button-upload.component';

@NgModule({
    imports: [CommonModule],
    declarations: [
        ButtonAddComponent,
        ButtonClearComponent,
        ButtonDeleteComponent,
        ButtonEditComponent,
        ButtonSaveComponent,
        ButtonHomeComponent,
        ButtonCancelComponent,
        ButtonExportComponent,
        ButtonConfirmComponent,
        ButtonUploadComponent,
        ButtonSearchComponent,
        ButtonCheckComponent,
        ButtonDetailComponent,
        ButtonBackComponent,
        ButtonCustomComponent,
        ButtonDownloadComponent,
        ButtonFinishComponent
    ],
    exports: [
        ButtonAddComponent,
        ButtonClearComponent,
        ButtonDeleteComponent,
        ButtonEditComponent,
        ButtonSaveComponent,
        ButtonHomeComponent,
        ButtonCancelComponent,
        ButtonExportComponent,
        ButtonConfirmComponent,
        ButtonUploadComponent,
        ButtonSearchComponent,
        ButtonCheckComponent,
        ButtonDetailComponent,
        ButtonBackComponent,
        ButtonCustomComponent,
        ButtonDownloadComponent,
        ButtonFinishComponent
    ],
    providers: [],
})
export class ButtonModule { }