import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Location } from '@angular/common';
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import _ from 'lodash';
import { BreadCrumb } from "../../../../../../common/models";
import { AjaxService, MessageBarService } from "../../../../../../common/services";
import { Int020101Vo } from '../int020101vo.model';
import { Int02010101Service } from './int02010101.service';
import { Int02010101FormVo, Int02010101Vo } from './int02010101vo.model';

declare var $: any;

@Component({
  selector: 'app-int02010101',
  templateUrl: './int02010101.component.html',
  styleUrls: ['./int02010101.component.css'],
  providers: [Int02010101Service]
})
export class Int02010101Component implements OnInit {
  breadcrumb: BreadCrumb[];
  hiddenChildren: boolean = false;
  qtnSide: any;
  id: string = "";
  forms: FormGroup;
  children: FormArray;
  qtnDtls: Int02010101Vo[] = [];
  qtnDtlsAll: Int02010101Vo[] = [];
  flagStr: string;
  idHead: number
  // request
  form: Int02010101FormVo = {
    save: [],
    delete: [],
    idHead: null
  };
  submitDtl: boolean = false;
  isChanged: boolean = false;
  constructor(
    private ajax: AjaxService,
    private router: Router,
    private route: ActivatedRoute,
    private msg: MessageBarService,
    private fb: FormBuilder,
    private selfService: Int02010101Service,
    private location: Location
  ) {
    this.id = this.route.snapshot.queryParams['id'] || "";
    this.breadcrumb = [
      { label: "ตรวจสอบภายใน", route: "#" },
      { label: "แบบสอบถามระบบการควบคุมภายใน", route: "#" },
      { label: "แก้ไขแบบสอบถามระบบการควบคุมภายใน", route: "#" },
      { label: "รายละเอียดด้านแบบสอบถามระบบการควบคุมภายใน", route: "#" }
    ];
    this.qtnSide = {
      id: null,
      idHead: null,
      sideName: "",
      isDeleted: "N",
      version: 1,
      createdBy: "",
      createdDate: null,
      updatedBy: "",
      updatedDate: null,
      quantity: 0
    }
    this.forms = this.fb.group({
      id: [null],
      idSide: [null],
      sideDtl: ['', Validators.required],
      qtnLevel: [1, Validators.required],
      seq: [this.qtnDtlsAll.length + 1, Validators.required],
      seqDtl: [0],
      children: this.fb.array([]),
      idHeading: [null]
    });
    this.children = this.forms.get('children') as FormArray;
    this.qtnDtls = this.children.value;
  }

  ngOnInit() {
    this.id = this.route.snapshot.queryParams['id'] || "";
    this.flagStr = this.route.snapshot.queryParams['flagStr'] || "";
    this.idHead = this.route.snapshot.queryParams['idHead'] || null;
    if (this.id) {
      this.selfService.getQuestionnaireSideDtl(parseInt(this.id)).then((result: Int02010101Vo[]) => {
        this.qtnDtlsAll = _.clone(result);
        this.forms.get('idSide').patchValue(this.id);
        this.forms.get('seq').patchValue(this.qtnDtlsAll.length + 1);
        // this.addDtl();
      });
      this.selfService.getSideById(parseInt(this.id)).then((result: Int020101Vo) => {
        this.qtnSide = result;
      });
      console.log(this.forms.value);
    }
  }

  ngAfterViewInit() { }

  ngOnDestroy() { }

  back() {
    this.location.back();
  }

  chilrenKeyPress(i: number) {
    if (this.forms.get('children')) {
      const array: FormArray = this.forms.get('children') as FormArray;
      this.qtnDtls[i].sideDtl = array.at(i).get('sideDtl').value;
    }
  }

  chilren2KeyPress(i: number, j: number) {
    if (this.forms.get('children')) {
      const arr1: FormArray = this.forms.get('children') as FormArray;
      if (arr1.at(i).get('children')) {
        const arr2: FormArray = arr1.at(i).get('children') as FormArray;
        this.qtnDtls[i].children[j].sideDtl = arr2.at(j).get('sideDtl').value;
      }
    }
  }

  chilrenClick() {
    console.log("CLICK");
    this.children = this.forms.get('children') as FormArray;
    this.qtnDtls = this.children.value;
    return;
  }

  /**
   * Actions 
   * == CRUD Detail
   * */
  addDtl() {
    const seq: number = this.forms.get('seq').value;
    const idSide: number = this.forms.get('idSide').value;
    this.children = this.forms.get('children') as FormArray;
    this.children.push(
      this.fb.group({
        id: [null],
        idSide: [idSide],
        sideDtl: ['', Validators.required],
        qtnLevel: [2, Validators.required],
        seq: [seq, Validators.required],
        seqDtl: [this.children.length + 1, Validators.required],
        children: this.fb.array([]),
        idHeading: [null]
      })
    );
    this.qtnDtls = this.children.value;
  }
  addDtl2(at: number) {
    this.children = this.forms.get('children') as FormArray;
    let children2: FormArray = this.children.at(at).get('children') as FormArray;
    const seq: number = this.children.at(at).get('seqDtl').value;
    const idSide: number = this.children.at(at).get('idSide').value;
    children2.push(
      this.fb.group({
        id: [null],
        idSide: [idSide],
        sideDtl: ['', Validators.required],
        qtnLevel: [3, Validators.required],
        seq: [seq, Validators.required],
        seqDtl: [children2.length + 1, Validators.required],
        children: this.fb.array([]),
        idHeading: [null]
      })
    );
    this.qtnDtls = this.children.value;
    this.qtnDtls[at].children = children2.value;
  }
  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }
  resetForm() {
    const idSide: number = this.forms.get('idSide').value;
    this.forms = this.fb.group({
      id: [null],
      idSide: [idSide],
      sideDtl: ['', Validators.required],
      qtnLevel: [1, Validators.required],
      seq: [this.qtnDtlsAll.length + 1, Validators.required],
      seqDtl: [0],
      children: this.fb.array([]),
      idHeading: [null]
    });
    // this.addDtl();
    this.qtnDtls = this.children.value;
  }
  saveDtl() {
    this.submitDtl = true;
    if (this.forms.valid) {
      // offline
      let qtnDtl: Int02010101Vo = this.forms.value as Int02010101Vo;
      let qtnDtls: Int02010101Vo[] = this.children.value;
      let qtnDtlsLast: Int02010101Vo[] = [];
      // Level 0
      const data = _.clone(qtnDtl);
      data.children = [];
      qtnDtlsLast.push(data);
      // Level 1
      for (let i = 0; i < qtnDtls.length; i++) {
        const data = _.clone(qtnDtls[i]);
        data.children = [];
        qtnDtlsLast.push(data);
        // Level 2
        for (let j = 0; j < qtnDtls[i].children.length; j++) {
          const data = _.clone(qtnDtls[i].children[j]);
          data.children = [];
          qtnDtlsLast.push(data);
          // Level 3
          for (let k = 0; k < qtnDtls[i].children[j].children.length; k++) {
            const data = _.clone(qtnDtls[i].children[j].children[k]);
            data.children = [];
            qtnDtlsLast.push(data);
          }
        }
      }
      // add save to this.form
      this.form = {
        save: qtnDtlsLast,
        delete: [],
        idHead: this.idHead
      };
      // online
      this.selfService.saveAll(this.form).then((result: Int02010101Vo[]) => {
        this.qtnDtlsAll = _.clone(result);
        this.form = {
          save: [],
          delete: [],
          idHead: null
        };
        this.resetForm();
        this.submitDtl = false;
      }).catch(() => {
        // on error
      });
    }
  }
  updateDtl() {
    this.submitDtl = true;
    if (this.forms.valid) {
      // offline
      let qtnDtl: Int02010101Vo = this.forms.value as Int02010101Vo;
      let qtnDtls: Int02010101Vo[] = this.children.value;
      let qtnDtlsLast: Int02010101Vo[] = [];
      // Level 0
      const data = _.clone(qtnDtl);
      data.children = [];
      qtnDtlsLast.push(data);
      // Level 1
      for (let i = 0; i < qtnDtls.length; i++) {
        const data = _.clone(qtnDtls[i]);
        data.children = [];
        qtnDtlsLast.push(data);
        // Level 2
        for (let j = 0; j < qtnDtls[i].children.length; j++) {
          const data = _.clone(qtnDtls[i].children[j]);
          data.children = [];
          qtnDtlsLast.push(data);
          // Level 3
          for (let k = 0; k < qtnDtls[i].children[j].children.length; k++) {
            const data = _.clone(qtnDtls[i].children[j].children[k]);
            data.children = [];
            qtnDtlsLast.push(data);
          }
        }
      }
      // add save to this.form
      this.form.save = qtnDtlsLast;
      // online
      this.selfService.saveAll(this.form).then((result: Int02010101Vo[]) => {
        this.qtnDtlsAll = _.clone(result);
        this.form = {
          save: [],
          delete: [],
          idHead: null
        };
        this.resetForm();
        this.submitDtl = false;
      }).catch(() => {
        // on error
      });
    }
  }
  cancelDtl() {
    // offline
    this.selfService.getQuestionnaireSideDtl(parseInt(this.id)).then((result: Int02010101Vo[]) => {
      this.qtnDtlsAll = _.clone(result);
      this.form = {
        save: [],
        delete: [],
        idHead: null
      };
      this.resetForm();
    });
    // online
  }
  deleteDtl(id: number, index: number = -1) {
    this.msg.comfirm(event => {
      if (event && (id || index != -1)) {
        if (id) {
          index = this.qtnDtls.findIndex(obj => obj.id == id);
        }
        if (index != -1) {
          // offline
          if (id) {
            this.form.delete.push(this.qtnDtls[index]);
            for (let i = 0; i < this.qtnDtls[index].children.length; i++) {
              this.form.delete.push(this.qtnDtls[index].children[i]);
            }
          }
          this.children = this.forms.get('children') as FormArray;
          this.children.removeAt(index);
          this.qtnDtls.splice(index, 1);
          if (this.qtnDtls.length > 0) {
            this.reSeqDtls(); // refresh sequence detail
          }
        }
      }
    }, MessageBarService.CONFIRM_DELETE);
  }
  deleteDtl2(id: number, index: number = -1, index2: number = -1) {
    this.msg.comfirm(event => {
      if (event && (id || (index != -1 && index2 != -1))) {
        if (index != -1 && index2 != -1) {
          if (id) {
            this.form.delete.push(this.qtnDtls[index].children[index2]);
          }
          this.children = this.forms.get('children') as FormArray;
          const children2 = this.children.at(index).get('children') as FormArray;
          children2.removeAt(index2);
          this.qtnDtls[index].children.splice(index2, 1);
        }
      }
    }, MessageBarService.CONFIRM_DELETE);
  }
  invalid(control: string) {
    return this.forms.get(control).invalid && (this.forms.get(control).touched || this.submitDtl);
  }
  invalidChildren(control: string, at: number) {
    this.children = this.forms.get('children') as FormArray;
    const form: FormGroup = this.children.at(at) as FormGroup;
    return form.get(control).invalid && (form.get(control).touched || this.submitDtl);
  }
  invalidChildren2(control: string, at: number, at2: number) {
    this.children = this.forms.get('children') as FormArray;
    const children2: FormArray = _.clone(this.children.at(at).get('children') as FormArray);
    const form: FormGroup = _.clone(children2.at(at2) as FormGroup);
    return form.get(control).invalid && (form.get(control).touched || this.submitDtl);
  }

  /**
   * Actions 
   * == CRUD Title
   * */
  onSave() {
    let saveObj: Int02010101Vo[] = [];
    let deleteObj: Int02010101Vo[] = [];
    for (let i = 0; i < this.qtnDtlsAll.length; i++) {
      saveObj.push(this.qtnDtlsAll[i]);
      for (let j = 0; j < this.qtnDtlsAll[i].children.length; j++) {
        saveObj.push(this.qtnDtlsAll[i].children[j]);
        for (let k = 0; k < this.qtnDtlsAll[i].children[j].children.length; k++) {
          saveObj.push(this.qtnDtlsAll[i].children[j].children[k]);
        }
      }
    }
    this.form = {
      save: saveObj,
      delete: deleteObj,
      idHead: this.idHead
    };
    this.selfService.saveAll(this.form).then((result: Int02010101Vo[]) => {
      this.qtnDtlsAll = _.clone(result);
      this.form = {
        save: [],
        delete: [],
        idHead: null
      };
      // hide button save
      this.isChanged = false;
    });
  }
  onEdit(id: number, el: HTMLElement) {
    // offline
    // Level 1
    this.selfService.getQuestionnaireSideDtl(parseInt(this.id)).then((result: Int02010101Vo[]) => {
      this.qtnDtlsAll = _.clone(result);
      const index = this.qtnDtlsAll.findIndex(obj => id == obj.id);
      const qtnDtls: Int02010101Vo = _.clone(this.qtnDtlsAll[index]);
      this.forms.get('id').patchValue(qtnDtls.id);
      this.forms.get('idSide').patchValue(qtnDtls.idSide);
      this.forms.get('sideDtl').patchValue(qtnDtls.sideDtl);
      this.forms.get('qtnLevel').patchValue(qtnDtls.qtnLevel);
      this.forms.get('seq').patchValue(qtnDtls.seq);
      this.forms.get('seqDtl').patchValue(qtnDtls.seqDtl);
      this.children = this.forms.get('children') as FormArray;
      this.clearFormArray(this.children);
      this.qtnDtls = [];
      // Level 2
      for (let i = 0; i < qtnDtls.children.length; i++) {
        const formArray: FormArray = this.fb.array([]);
        for (let j = 0; j < qtnDtls.children[i].children.length; j++) {
          formArray.push(
            this.fb.group({
              id: [qtnDtls.children[i].children[j].id],
              idSide: [qtnDtls.children[i].children[j].idSide],
              sideDtl: [qtnDtls.children[i].children[j].sideDtl],
              qtnLevel: [qtnDtls.children[i].children[j].qtnLevel],
              seq: [qtnDtls.children[i].children[j].seq],
              seqDtl: [qtnDtls.children[i].children[j].seqDtl],
              children: this.fb.array([]),
              idHeading: [qtnDtls.children[i].children[j].idHeading]
            })
          );
        }
        this.qtnDtls.push(qtnDtls.children[i]);
        this.children.push(
          this.fb.group({
            id: [qtnDtls.children[i].id],
            idSide: [qtnDtls.children[i].idSide],
            sideDtl: [qtnDtls.children[i].sideDtl],
            qtnLevel: [qtnDtls.children[i].qtnLevel],
            seq: [qtnDtls.children[i].seq],
            seqDtl: [qtnDtls.children[i].seqDtl],
            children: formArray,
            idHeading: [qtnDtls.children[i].idHeading]
          })
        );
      }
      this.form = {
        save: [],
        delete: [],
        idHead: null
      };
      el.scrollIntoView();
    });
  }
  delete(id: number) {
    this.msg.comfirm(event => {
      if (event) {
        const index: number = this.qtnDtlsAll.findIndex(obj => obj.id == id);
        let saveObj: Int02010101Vo[] = [];
        let deleteObj: Int02010101Vo[] = [];
        if (index != -1) {
          // offline
          const firstObj = _.clone(this.qtnDtlsAll[index]);
          firstObj.children = [];
          deleteObj = [firstObj];
          for (let i = 0; i < this.qtnDtlsAll[index].children.length; i++) {
            deleteObj.push(this.qtnDtlsAll[index].children[i]);
            for (let j = 0; j < this.qtnDtlsAll[index].children[i].children.length; j++) {
              deleteObj.push(this.qtnDtlsAll[index].children[i].children[j]);
            }
          }
          this.qtnDtlsAll.splice(index, 1);
          if (this.qtnDtlsAll.length > 0) {
            this.reSeq(); // refresh sequence
          }
          // online
          for (let i = 0; i < this.qtnDtlsAll.length; i++) {
            saveObj.push(this.qtnDtlsAll[i]);
            for (let j = 0; j < this.qtnDtlsAll[i].children.length; j++) {
              saveObj.push(this.qtnDtlsAll[i].children[j]);
            }
          }
          this.form = {
            save: saveObj,
            delete: deleteObj,
            idHead: this.idHead
          }
          this.selfService.saveAll(this.form).then((result: Int02010101Vo[]) => {
            this.qtnDtlsAll = _.clone(result);
            this.form = {
              save: [],
              delete: [],
              idHead: null
            };
            this.resetForm();
          });
        }
      }
    }, MessageBarService.CONFIRM_DELETE);
  }

  /**
   * Events 
   * == Drag and Drop
   * */
  onDrop(event: CdkDragDrop<Int02010101Vo[]>) {
    // first check if it was moved within the same list or moved to a different list
    if (event.previousContainer === event.container) {
      // change the items index if it was moved within the same list
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.reSeq(); // refresh sequence
      this.isChanged = true;
    } else {
      // remove item from the previous list and add it to the new array
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.reSeq(); // refresh sequence
      this.isChanged = true;
    }
  }
  reSeq() {
    for (let i = 0; i < this.qtnDtlsAll.length; i++) {
      this.qtnDtlsAll[i].seq = i + 1;
      for (let j = 0; j < this.qtnDtlsAll[i].children.length; j++) {
        this.qtnDtlsAll[i].children[j].seq = this.qtnDtlsAll[i].seq;
        this.qtnDtlsAll[i].children[j].seqDtl = j + 1;
        for (let k = 0; k < this.qtnDtlsAll[i].children[j].children.length; k++) {
          this.qtnDtlsAll[i].children[j].children[k].seq = this.qtnDtlsAll[i].children[j].seqDtl;
          this.qtnDtlsAll[i].children[j].children[k].seqDtl = k + 1;
        }
      }
    }
    this.selfService.updateQtnDtlsAll(this.qtnDtlsAll);
  }
  onDropDtl(event: CdkDragDrop<Int02010101Vo[]>) {
    if (event.previousContainer === event.container) {
      // change the items index if it was moved within the same list
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.reSeqDtls(); // refresh sequence detail
    } else {
      // remove item from the previous list and add it to the new array
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.reSeqDtls(); // refresh sequence detail
    }
  }
  reSeqDtls() {
    this.children = this.forms.get('children') as FormArray;
    for (let i = 0; i < this.qtnDtls.length; i++) {
      this.qtnDtls[i].seqDtl = i + 1;
    }
    for (let i = this.children.length - 1; i >= 0; i--) {
      this.children.removeAt(i)
    }
    for (let i = 0; i < this.qtnDtls.length; i++) {
      const formArray: FormArray = this.fb.array([]);
      for (let j = 0; j < this.qtnDtls[i].children.length; j++) {
        formArray.push(
          this.fb.group({
            id: [this.qtnDtls[i].children[j].id],
            idSide: [this.qtnDtls[i].children[j].idSide],
            sideDtl: [this.qtnDtls[i].children[j].sideDtl, Validators.required],
            qtnLevel: [this.qtnDtls[i].children[j].qtnLevel],
            seq: [this.qtnDtls[i].seqDtl],
            seqDtl: [this.qtnDtls[i].children[j].seqDtl],
            children: this.fb.array([]),
            idHeading: [this.qtnDtls[i].children[j].idHeading]
          })
        );
      }
      this.children.push(
        this.fb.group({
          id: [this.qtnDtls[i].id],
          idSide: [this.qtnDtls[i].idSide],
          sideDtl: [this.qtnDtls[i].sideDtl, Validators.required],
          qtnLevel: [this.qtnDtls[i].qtnLevel],
          seq: [this.qtnDtls[i].seq],
          seqDtl: [this.qtnDtls[i].seqDtl],
          children: formArray,
          idHeading: [this.qtnDtls[i].idHeading]
        })
      );
    }
  }

}

