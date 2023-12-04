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
export class BillService {

  url: string = environment.url;
  cacheKey: any = 'AngularCache';

  constructor(
    public http: HttpClient,
    public cacheService: CacheService,
    public logger: NGXLogger,
    public rs: RetryService) { }

  getCompanyInfo(adminId) {
    const api = `${this.url}/v1/admins/company_info?adminId=${adminId}`;
    const req = this.http.get<any>(api).pipe(map(res => {
      this.logger.info('New getCompanyInfo called');
      return res;
    }), retryWhen(this.rs.retryFunction()));

    return this.cacheService.loadFromObservable(`Web_Company_Info ${api}`, req, this.cacheKey);
  }

  getTicketSummary(restaurantId, startDate, endDate) {
    const api = `${this.url}/v1/admins/summary_ticket?restaurantId=${restaurantId}&start_date=${startDate}&end_date=${endDate}`;
    const req = this.http.get<any>(api).pipe(map(res => {
      this.logger.info('New getTicketSummary called');
      return res;
    }), retryWhen(this.rs.retryFunction()));
    const ttl = 60 * 60 * 0.5; // 30 mins

    const startDateString = String(startDate).slice(0, -14);
    const endDateString = String(endDate).slice(0, -14);
    const cacheString = 'Web_Ticket_Summary ' + restaurantId + startDateString + endDateString;
    return this.cacheService.loadFromObservable(cacheString, req, this.cacheKey, ttl);
  }

  getOrderSummary(restaurantId, startDate, endDate) {
    const api = `${this.url}/v1/admins/summary_order?restaurantId=${restaurantId}&start_date=${startDate}&end_date=${endDate}`;
    const req = this.http.get(api).pipe(map(res => {
      this.logger.info('New getOrderSummary called');
      return res;
    }), retryWhen(this.rs.retryFunction()));
    const ttl = 60 * 60 * 0.5; // 30 mins

    const startDateString = startDate.slice(0, -14);
    const endDateString = endDate.slice(0, -14);
    const cacheString = 'Web_Order_Summary ' + restaurantId + startDateString + endDateString;
    return this.cacheService.loadFromObservable(cacheString, req, this.cacheKey, ttl);
  }
}
