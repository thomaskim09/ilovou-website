import { CacheService } from 'ionic-cache';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { RetryService } from '../common/retry.service';
import { environment } from '../environments/environment';
import { map } from 'rxjs/operators/map';
import { retryWhen } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProfileService {

  url: string = environment.url;
  cacheKey: any = 'AngularCache';
  restaurantCacheKey: any = 'RestaurantCache';

  constructor(
    public http: HttpClient,
    public cacheService: CacheService,
    public logger: NGXLogger,
    public rs: RetryService) { }

  getRestaurantFoodType() {
    const api = `${this.url}/v1/tags/all`;
    const req = this.http.get(api).pipe(map(data => {
      this.logger.info('New getRestaurantFoodType is called');
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return this.cacheService.loadFromObservable('Web_Restaurant_Food_Type ' + api, req, this.cacheKey);
  }

  getAllAddress() {
    const api = `${this.url}/v1/tags/address`;
    const req = this.http.get(api).pipe(map(data => {
      this.logger.info('New getAllAddress is called');
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return this.cacheService.loadFromObservable('Web_All_Address ' + api, req, this.cacheKey);
  }

  addRestaurant(object) {
    const api = `${this.url}/v1/restaurants`;
    const req = this.http.post<any>(api, object).pipe(map(data => {
      this.logger.info('New addRestaurant is called');
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  updateRestaurant(restaurantId, restaurant) {
    const api = `${this.url}/v1/restaurants?restaurantId=${restaurantId}`;
    const req = this.http.put<any>(api, restaurant).pipe(map(data => {
      this.logger.info('New updateRestaurant is called');
      this.cacheService.clearGroup(this.restaurantCacheKey);
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  getRestaurantDetails(restaurantId) {
    const api = `${this.url}/v1/restaurants?restaurantId=${restaurantId}`;
    const req = this.http.get<any>(api).pipe(map(data => {
      this.logger.info('New getRestaurantDetails is called');
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return this.cacheService.loadFromObservable('Web_Restaurant_Details ' + api, req, this.restaurantCacheKey);
  }

  getNotification(adminId, type, pageSize, pageNum) {
    const api = `${this.url}/v1/admins/notifications?adminId=${adminId}&type=${type}&page_size=${pageSize}&page_num=${pageNum}`;
    const req = this.http.get<any>(api).pipe(map(res => {
      this.logger.info(`New getNotification ${type} ${pageNum} called`);
      return res;
    }), retryWhen(this.rs.retryFunction()));
    const ttl = 60 * 60 * 1; // 1 hour
    const cacheString = 'Web_Notifications ' + api;
    return this.cacheService.loadFromObservable(cacheString, req, this.cacheKey, ttl);
  }
}
