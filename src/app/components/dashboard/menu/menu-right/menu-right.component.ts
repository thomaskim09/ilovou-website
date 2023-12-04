import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/providers/data-service/data.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-menu-right',
  templateUrl: './menu-right.component.html',
  styleUrls: ['./menu-right.component.scss']
})
export class MenuRightComponent implements OnInit, OnDestroy {

  index: Number;

  constructor(public dataService: DataService) { }

  ngOnInit() {
    this.listenToMainTabChange();
  }

  ngOnDestroy() {
    // Left of untilDestroyed
  }

  listenToMainTabChange() {
    this.dataService.currentSettingsTab.pipe(untilDestroyed(this)).subscribe(val => {
      this.index = val.index;
    });
  }

}
