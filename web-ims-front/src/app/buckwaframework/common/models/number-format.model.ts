import { FormGroup } from '@angular/forms';

export interface NFDirective {
    form: FormGroup;
    control: string;
    format?: string;
}