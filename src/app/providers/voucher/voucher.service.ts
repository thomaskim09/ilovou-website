import { CacheService } from 'ionic-cache';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { RetryService } from '../common/retry.service';
import { environment } from '../environments/environment';
import { map } from 'rxjs/operators/map';
import { retryWhen } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {

  url: string = environment.url;
  cacheKey: any = 'AngularCache';
  vouListCacheKey: any = 'VoucherListCache';

  constructor(
    public http: HttpClient,
    public cacheService: CacheService,
    public logger: NGXLogger,
    public rs: RetryService) { }

  addVoucher(restaurantId, voucher) {
    const api = `${this.url}/v1/vouchers`;
    const req = this.http.post<any>(api, {
      restaurantId: restaurantId,
      voucher: voucher
    }).pipe(map(res => {
      this.logger.info('New addVoucher is called');
      this.cacheService.clearGroup(this.vouListCacheKey);
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  getVoucher(voucherId) {
    const api = `${this.url}/v1/vouchers?voucherId=${voucherId}`;
    const req = this.http.get<any>(api).pipe(map(data => {
      this.logger.info('New getVoucher is called');
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return this.cacheService.loadFromObservable('Web_Voucher ' + api, req, this.cacheKey);
  }

  getVoucherList(restaurantId, type, pageSize, pageNum, refresher) {
    const api = `${this.url}/v1/vouchers/restaurants?restaurantId=${restaurantId}&type=${type}&page_size=${pageSize}&page_num=${pageNum}`;
    const req = this.http.get<any>(api).pipe(map(data => {
      this.logger.info(`New getVoucherList ${type} ${pageSize} ${pageNum} is called`);
      return data;
    }), retryWhen(this.rs.retryFunction()));

    const ttl = 60 * 60 * 24; // 1 day
    const cacheString = `Web_Voucher_List ${api}`;
    if (refresher) {
      return this.cacheService.loadFromDelayedObservable(cacheString, req, this.vouListCacheKey, ttl, 'all');
    }
    return this.cacheService.loadFromObservable(cacheString, req, this.vouListCacheKey);
  }

  changeVoucherStatus(voucherId, status, restaurantId, restaurantStatus) {
    const api = `${this.url}/v1/vouchers?voucherId=${voucherId}`;
    const req = this.http.put<any>(api, {
      status: status,
      restaurantId: restaurantId,
      restaurantStatus: restaurantStatus,
    }).pipe(map(res => {
      this.logger.info('New changeVoucherStatus is called');
      this.cacheService.clearGroup(this.vouListCacheKey);
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  updateVoucherOrder(idList) {
    const api = `${this.url}/v1/vouchers/order`;
    const req = this.http.put<any>(api, {
      idList: idList
    }).pipe(map(res => {
      this.logger.info('New updateVoucherOrder is called');
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  getBranchList(adminId) {
    const api = `${this.url}/v1/admins/branch?adminId=${adminId}`;
    const req = this.http.get<any>(api).pipe(map(res => {
      this.logger.info('New getBranchList is called');
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return this.cacheService.loadFromObservable(`Web_Branch_List ${adminId}`, req, this.cacheKey);
  }

  checkRestaurantListVoucher(restaurantList) {
    const api = `${this.url}/v1/admins/branch_vouchers`;
    const req = this.http.put<any>(api, {
      restaurantList: restaurantList
    }).pipe(map(res => {
      this.logger.info('New checkRestaurantListVoucher is called');
      return res;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }
}
