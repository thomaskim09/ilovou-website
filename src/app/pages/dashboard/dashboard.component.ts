import lo_isEmpty from 'lodash/isEmpty';
import { AuthenticationService } from '../../providers/authentication/authentication.service';
import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { DataService } from 'src/app/providers/data-service/data.service';
import { MatDialog, MatSidenav } from '@angular/material';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  statusText: string;
  restaurantId: string;
  restaurantName: string;
  feature: string;

  // Controller
  isEmpty: boolean = true;

  // Listen to screen resize
  @ViewChild('sidenav') sidenav: MatSidenav;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 800) {
      this.sidenav.close();
      this.sidenav.mode = 'over';
    } else {
      this.sidenav.open();
      this.sidenav.mode = 'side';
    }
  }

  constructor(
    public authenticationService: AuthenticationService,
    public dataService: DataService,
    public dialog: MatDialog,
    public router: Router) { }

  ngOnInit() {
    this.sidenav.mode = (screen.width < 500) ? 'over' : 'side';
    const currentUser = this.authenticationService.currentUserValue;
    this.restaurantName = currentUser.restaurantName;
    this.restaurantId = currentUser.restaurantId;
    this.feature = this.authenticationService.decript(currentUser.feature);
    this.listenToDashboard();
    this.isEmpty = this.router.url === '/dashboard';
    this.listenToRouterChange();
    this.checkAdminStatus(currentUser._id);
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private listenToRouterChange() {
    this.router.events.pipe(untilDestroyed(this)).subscribe(val => {
      this.isEmpty = this.router.url === '/dashboard';
    });
  }

  private listenToDashboard() {
    this.dataService.currentDashboard.pipe(untilDestroyed(this)).subscribe(val => {
      if (lo_isEmpty(val)) {
        return;
      }
      if (val.createStatus) {
        const currentUser = this.authenticationService.currentUserValue;
        if (val.createStatus === 'restaurant') {
          this.restaurantName = currentUser.restaurantName;
          this.restaurantId = currentUser.restaurantId;
        }
      }
    });
  }

  private checkAdminStatus(adminId) {
    this.authenticationService.checkAdminStatus(adminId).pipe(untilDestroyed(this)).subscribe(val => {
      if (val) {
        return;
      }
      this.authenticationService.logout();
    });
  }

  logout() {
    this.authenticationService.logout();
  }
}
