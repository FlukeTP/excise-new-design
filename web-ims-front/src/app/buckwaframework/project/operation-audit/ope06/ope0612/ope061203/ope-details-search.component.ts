import { Component, SimpleChange, EventEmitter, Output, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'ope-details-search',
    template: `
        <div class="ui grid">
            <div class="eight wide right floated column">
            <div class="ui one column centered grid">
                <form (submit)="addname($event)">
                <label>เพิ่มพนักงาน</label>&nbsp;
                <div class="ui input">
                    <input type="text" #skill placeholder="กรุณาเพิ่มพนักงาน">
                </div>
                </form>
            </div>
            <br>
            <ul class="ui raised segments" style="padding-left: 0px;" *ngIf="show">
                <li class="ui segment" style="list-style-type:none" *ngFor="let skill of skills;let i = index;">
                <div class="ui equal width grid">
                    <div class="column">
                    <div class="ui text-left" style="margin-top: 10px;">
                        {{i+1}}&nbsp;&nbsp;{{skill}}
                    </div>
                    </div>
                    <div class="eight wide column">
                    <div class="ui text-center" style="margin-top: 10px;">
                    </div>
                    </div>
                    <div class="column">
                    <div class="ui text-right">
                        <button class="ui icon button" (click)="removeNmae(skill)">
                        <i class="close icon"></i>
                        </button>
                    </div>
                    </div>
                </div>
                </li>
            </ul>
            </div>
        </div>
    `
})
export class OpeDetailsSearchComponent {
    @ViewChild("skill") skill: ElementRef;
    @Input() lists: string[] = [];
    @Output() listsChange: EventEmitter<string[]> = new EventEmitter<string[]>();
    skills: string[] = [];
    show: boolean = false;
    constructor() { }

    ngOnInit() {
        if (this.lists) {
            this.skills = this.lists;
        }
    }

    ngOnChanges(changes: SimpleChange) {
        if (changes.currentValue != changes.previousValue && this.lists) {
            this.skills = this.lists;
        }
    }

    addname(event) {
        event.preventDefault();
        this.skills.unshift(this.skill.nativeElement.value);
        this.skill.nativeElement.value = "";
        this.show = true;
        this.listsChange.emit(this.skills);
    }

    removeNmae(name) {
        this.skills.forEach((element, index) => {
            if (name == element) {
                this.skills.splice(index, 1)
            }
        })
        if (this.skills.length == 0) {
            this.show = false
        }
    }

}