import lo_isEmpty from 'lodash/isEmpty';
import { AuthenticationService } from 'src/app/providers/authentication/authentication.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/providers/data-service/data.service';
import { HintService } from 'src/app/providers/hint/hint.service';
import { MenuFormService } from 'src/app/providers/menu/menuForm/menu-form.service';
import { MenuService } from 'src/app/providers/menu/menu.service';
import { ToastrService } from 'ngx-toastr';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-m-l-remark',
  templateUrl: './m-l-remark.component.html',
  styleUrls: ['./m-l-remark.component.scss']
})
export class MLRemarkComponent implements OnInit, OnDestroy {

  menuId: string;
  isEditMode: boolean = false;
  remarkList: any = [];

  // Controller
  timer: any;

  constructor(
    public menuService: MenuService,
    public menuFormService: MenuFormService,
    public dataService: DataService,
    public authenticationService: AuthenticationService,
    public toastr: ToastrService,
    public hintService: HintService) { }

  ngOnInit() {
    this.menuId = this.authenticationService.currentUserValue.menuId;
    this.setUpRemarkList();
    this.listenToVRSubmit();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearTimeout(this.timer);
  }

  private setUpRemarkList(refresh?) {
    this.menuService.getRemarks(this.menuId, refresh).pipe(untilDestroyed(this)).subscribe(val => {
      this.remarkList = val.remarkShortCuts;
    });
  }

  private listenToVRSubmit() {
    this.dataService.currentRemarkContent.pipe(untilDestroyed(this)).subscribe(val1 => {
      if (lo_isEmpty(val1)) {
        return;
      }
      if (val1.MLRefresh) {
        this.setUpRemarkList(true);
      }
    });
  }

  getType(type) {
    switch (type) {
      case 'RB': return 'Single Select';
      case 'CB': return 'Multiple Select';
    }
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  addNewRemark() {
    this.dataService.changeRemarksContent({
      needMenuRight: true,
      needRemarkForm: true,
    });
  }

  viewRemark(id) {
    this.dataService.changeRemarksContent({
      needMenuRight: true,
      needRemarkForm: true,
      remarkId: id
    });
  }

  removeRemark(remarkId) {
    const title = 'Confirm to delete this remark?';
    const subTitle = 'Warning, remark from food item which used this remark will be deleted too. Please proceed with caution :)';
    this.hintService.showModal(title, subTitle, 'Confirm', 'Nope').pipe(untilDestroyed(this)).subscribe(result => {
      if (result !== 'yes') {
        return;
      }
      this.menuService.deleteRemarks(this.menuId, remarkId).pipe(untilDestroyed(this)).subscribe(val => {
        this.toastr.success('Remark deleted');
        this.dataService.changeRemarksContent({
          needRemarkForm: false,
        });
        this.setUpRemarkList(true);
      });
    });
  }

  hintSender(id) {
    this.hintService.changeMessage(id);
  }
}
