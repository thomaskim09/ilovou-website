import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { CacheService } from 'ionic-cache';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { environment } from '../environments/environment';
import { NGXLogger } from 'ngx-logger';
import { retryWhen } from 'rxjs/operators';
import { RetryService } from '../common/retry.service';
import { DataService } from 'src/app/providers/data-service/data.service';
import { map } from 'rxjs/operators/map';

export class Admin {
  _id: string;
  restaurantId?: string;
  restaurantList?: any;
  restaurantName?: string;
  hasReservation?: boolean;
  menuId?: string;
  feature: string;
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService implements OnDestroy {

  url: string = environment.url;
  currentUserKey = 'Web_Current_User';
  cacheKey: any = 'AngularCache';

  // User information
  currentUserSubject: BehaviorSubject<Admin>;

  constructor(
    public cacheService: CacheService,
    public http: HttpClient,
    public logger: NGXLogger,
    public router: Router,
    public rs: RetryService,
    public toastr: ToastrService,
    public dataService: DataService) {
    this.initiateUser();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private initiateUser() {
    this.currentUserSubject = new BehaviorSubject<Admin>(this.getStorageCurrentUser());
  }

  get currentUserValue(): Admin {
    return this.currentUserSubject.value;
  }

  login(object) {
    const api = `${this.url}/v1/admins/login?type=web`;
    this.http.post<any>(api, object).pipe(untilDestroyed(this), retryWhen(this.rs.retryFunction())).subscribe(val => {
      val.feature = this.encrypt(val.feature);
      this.updateCurrentUser(val);
      this.router.navigate(['dashboard']);
      this.toastr.success('Login Successful');
      this.logger.info('New login is called');
      this.dataService.changeLogin({ isLogin: true });
    }, err => {
      if (err.status === 429) {
        this.toastr.error('Exceed login limit, please try again 3 mins later');
      } else {
        this.toastr.error(err.error.message);
      }
      this.dataService.changeLogin({ isLogin: false });
    });
  }

  logout() {
    localStorage.clear();
    this.cacheService.clearAll();
    this.currentUserSubject.next(undefined);
    this.router.navigate(['/home']);
  }

  checkLoginStatus() {
    if (this.currentUserValue) {
      return (this.currentUserValue._id) ? true : false;
    } else {
      return false;
    }
  }

  checkAdminStatus(adminId) {
    const api = `${this.url}/v1/admins/status?adminId=${adminId}`;
    const req = this.http.get<any>(api).pipe(map(res => {
      this.logger.info('New checkAdminStatus called');
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return this.cacheService.loadFromObservable('Web_Check_Admin_Status', req, this.cacheKey);
  }

  updateCurrentUser(currentUser) {
    localStorage.setItem(this.currentUserKey, JSON.stringify(currentUser));
    this.currentUserSubject.next(currentUser);
  }

  private getStorageCurrentUser() {
    return JSON.parse(localStorage.getItem(this.currentUserKey));
  }

  encrypt(val) {
    return String(Number(val) * 2) + 'NO';
  }

  decript(val) {
    return String(Number(val.slice(0, 1)) / 2);
  }

  checkAdminFeature(adminId) {
    const api = `${this.url}/v1/admins/feature?adminId=${adminId}`;
    const req = this.http.get<any>(api).pipe(map(res => {
      this.logger.info('New checkAdminFeature called');
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }
}
