import lo_isEmpty from 'lodash/isEmpty';
import { AuthenticationService } from 'src/app/providers/authentication/authentication.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/providers/data-service/data.service';
import { FormGroup } from '@angular/forms';
import { HintService } from 'src/app/providers/hint/hint.service';
import { MenuFormService } from 'src/app/providers/menu/menuForm/menu-form.service';
import { MenuService } from 'src/app/providers/menu/menu.service';
import { ToastrService } from 'ngx-toastr';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CommonFormService } from './../../../../../providers/common/common-form.service';

@Component({
  selector: 'app-m-r-remark',
  templateUrl: './m-r-remark.component.html',
  styleUrls: ['./m-r-remark.component.scss']
})
export class MRRemarkComponent implements OnInit, OnDestroy {

  // form properties
  form: FormGroup;

  // Common properties
  menuId: string;
  remarkId: string;

  validation_messages: any;

  typeList: any = [
    { name: 'Single Select', value: 'RB' },
    { name: 'Multiple Select', value: 'CB' },
  ];

  // Controller
  isFirstCreate: boolean = true;
  formChanged: boolean = false;
  needRemarkForm: boolean = false;
  needSpinner: boolean = false;
  timer1: any;
  timer2: any;

  constructor(
    public menuService: MenuService,
    public menuFormService: MenuFormService,
    public dataService: DataService,
    public authenticationService: AuthenticationService,
    public toastr: ToastrService,
    public hintService: HintService,
    public cfs: CommonFormService) { }

  ngOnInit() {
    this.menuId = this.authenticationService.currentUserValue.menuId;
    this.validation_messages = this.menuFormService.mLRemarkValidationMessage();
    this.createRemarkForm();
    this.listenToFormChanges();
    this.listenToMLRemark();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearTimeout(this.timer1);
    clearTimeout(this.timer2);
  }

  private createRemarkForm() {
    this.menuFormService.currentMenuRemarkForm.pipe(untilDestroyed(this)).subscribe(form => {
      this.form = form;
    });
  }

  addChildren() {
    this.menuFormService.addRemarkDetails();
  }

  deleteChildren(i) {
    this.menuFormService.deleteRemarkDetails(i);
  }

  private listenToFormChanges() {
    this.timer1 = setTimeout(() => {
      this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(val => {
        this.formChanged = true;
      });
    }, 1500);
  }

  private listenToMLRemark() {
    this.dataService.currentRemarkContent.pipe(untilDestroyed(this)).subscribe(val => {
      if (!lo_isEmpty(val)) {
        if (val.remarkId !== undefined) {
          this.isFirstCreate = false;
          this.needRemarkForm = val.needRemarkForm;
          this.remarkId = val.remarkId;
          this.resetRemarkForm();
          this.timer2 = setTimeout(() => {
            this.setUpRemarkForm(val.remarkId);
          }, 250);
        } else {
          this.isFirstCreate = true;
          this.needRemarkForm = val.needRemarkForm;
          this.resetRemarkForm();
        }
      }
    });
  }

  addRemarks() {
    this.hintService.showModal('Confirm to add new remark?', '', 'Confirm', 'Not Yet').pipe(untilDestroyed(this)).subscribe(result => {
      if (result !== 'yes') {
        return;
      }
      this.needSpinner = true;
      const content = this.menuFormService.remarksSetter(this.form);
      this.menuService.createRemarks(this.menuId, content).pipe(untilDestroyed(this)).subscribe(val => {
        this.needSpinner = false;
        this.success('New remark added');
      });
    });
  }

  updateRemarks() {
    this.hintService.showModal('Confirm to update remark?', '', 'Confirm', 'Not Yet').pipe(untilDestroyed(this)).subscribe(result => {
      if (result !== 'yes') {
        return;
      }
      this.needSpinner = true;
      const content = this.menuFormService.remarksSetter(this.form);
      this.menuService.updateRemarks(this.menuId, this.remarkId, content).pipe(untilDestroyed(this)).subscribe(val => {
        this.needSpinner = false;
        this.success('Remark updated');
      });
    });
  }

  private success(text) {
    this.toastr.success(text);
    this.needRemarkForm = false;
    this.dataService.changeRemarksContent({ MLRefresh: true });
  }

  private setUpRemarkForm(remarkId) {
    this.menuService.getRemarks(this.menuId, false).pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        const result = val.remarkShortCuts.filter(val1 => val1._id === remarkId);
        const oldLength = this.form.value.remarkDetails.length;
        const newLength = result[0].remarkDetails.length;
        if (oldLength !== newLength) {
          for (let j = 1; j < result[0].remarkDetails.length; j++) {
            this.addChildren();
          }
        }
        this.form.patchValue(result[0], { emitEvent: false, onlySelf: true });
        this.formChanged = false;
      }
    });
  }

  private resetRemarkForm() {
    this.form.reset({}, { emitEvent: false, onlySelf: true });
    this.menuFormService.resetRemarkContent();
    this.formChanged = false;
  }

  hintSender(id) {
    this.hintService.changeMessage(id);
  }
}
