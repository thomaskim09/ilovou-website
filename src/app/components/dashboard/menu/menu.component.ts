import lo_isEmpty from 'lodash/isEmpty';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/providers/data-service/data.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {

  needMenuRight: boolean = false;

  constructor(public dataService: DataService) { }

  ngOnInit() {
    this.listenIfNeedMenuRight();
  }

  ngOnDestroy() {
    // Left of untilDestroyed
  }

  listenIfNeedMenuRight() {
    this.dataService.currentSettingsTab.pipe(untilDestroyed(this)).subscribe(val => {
      if (!lo_isEmpty(val)) {
        this.needMenuRight = val.needMenuRight || false;
      }
    });
    this.dataService.currentFoodContent.pipe(untilDestroyed(this)).subscribe(val => {
      if (lo_isEmpty(val)) {
        return;
      }
      if (!val.toComponent.includes('menu')) {
        return;
      }
      this.needMenuRight = val.needMenuRight || false;
    });
    this.dataService.currentRemarkContent.pipe(untilDestroyed(this)).subscribe(val => {
      if (!lo_isEmpty(val)) {
        this.needMenuRight = val.needMenuRight || false;
      }
    });
  }

}
