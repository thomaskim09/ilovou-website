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
export class ReservationService {

  url: string = environment.url;
  cacheKey: any = 'AngularCache';
  tempCacheKey: any = 'ReservationTempCache';

  constructor(
    public http: HttpClient,
    public cacheService: CacheService,
    public logger: NGXLogger,
    public rs: RetryService) { }

  updateReservationSettings(restaurantId, settings) {
    const api = `${this.url}/v1/reservations/restaurants?restaurantId=${restaurantId}`;
    const req = this.http.put<any>(api, { settings: settings }).pipe(map(data => {
      this.logger.info('New updateReservationSettings is called');
      this.cacheService.clearGroup('ReservationTempCache');
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  getReservationSettings(restaurantId) {
    const api = `${this.url}/v1/reservations/restaurants?restaurantId=${restaurantId}`;
    const req = this.http.get<any>(api).pipe(map(data => {
      this.logger.info('New getReservationSettings is called');
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return this.cacheService.loadFromObservable('Web_Reservation_Settings ' + api, req, this.tempCacheKey);
  }
}
