import { AuthenticationService } from 'src/app/providers/authentication/authentication.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/providers/data-service/data.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MenuFormService } from 'src/app/providers/menu/menuForm/menu-form.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-menu-left',
  templateUrl: './menu-left.component.html',
  styleUrls: ['./menu-left.component.scss']
})
export class MenuLeftComponent implements OnInit, OnDestroy {

  // form properties
  settingForm: FormGroup;

  tabs = ['Settings'];
  selected = new FormControl(0);

  // Controller
  menuId: string;

  constructor(
    public menuFormService: MenuFormService,
    public dataService: DataService,
    public authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.setUpForm();
    this.listenHasMenu();
    this.menuId = this.authenticationService.currentUserValue.menuId;
    if (this.menuId) {
      this.tabs = ['Settings', 'Menu', 'Remarks'];
    }
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private setUpForm() {
    this.menuFormService.currentMenuSettingForm.pipe(untilDestroyed(this)).subscribe(form => {
      this.settingForm = form;
    });
  }

  private listenHasMenu() {
    this.dataService.currentMenuCreate.pipe(untilDestroyed(this)).subscribe(val => {
      if (val.menuId && val.needMenu) {
        this.menuId = val.menuId;
        this.tabs = ['Settings', 'Menu', 'Remarks'];
      } else {
        this.tabs = ['Settings'];
      }
    });
  }

  tabChange(ev) {
    this.dataService.changeSettingsTab({
      needMenuRight: false,
      index: ev.index
    });
    this.dataService.changeFoodsContent({
      toComponent: ['hint'],
      isFormChanged: false
    });
  }

}
