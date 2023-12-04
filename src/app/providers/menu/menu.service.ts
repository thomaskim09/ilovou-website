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
export class MenuService {

  url: string = environment.url;
  cacheKey: any = 'AngularCache';
  menuCacheKey: any = 'MenuCache';
  remarkCacheKey: any = 'RemarkCache';
  categoryCacheKey: any = 'CategoryCache';
  foodListCacheKey: any = 'FoodListCache';
  foodCacheKey: any = 'FoodCache';

  constructor(
    public http: HttpClient,
    public cacheService: CacheService,
    public logger: NGXLogger,
    public rs: RetryService) { }

  // Menu Settings Section
  getMenuSettings(menuId) {
    const api = `${this.url}/v1/menus/settings?menuId=${menuId}&type=web`;
    const req = this.http.get(api).pipe(map(data => {
      this.logger.info('New getMenuSettings is called');
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return this.cacheService.loadFromObservable('Web_Menu_Settings ' + api, req, this.menuCacheKey);
  }

  createMenu(restaurantId, settings) {
    const api = `${this.url}/v1/menus/settings?restaurantId=${restaurantId}`;
    const req = this.http.post<any>(api, { settings: settings }).pipe(map(data => {
      this.logger.info('New createMenu is called');
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  updateMenuSettings(restaurantId, menuId, settings) {
    const api = `${this.url}/v1/menus/settings?menuId=${menuId}`;
    const req = this.http.put(api, {
      restaurantId: restaurantId,
      settings: settings
    }).pipe(map(data => {
      this.logger.info('New updateMenuSettings is called');
      this.cacheService.clearGroup(this.menuCacheKey);
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  // Remark Section
  getRemarks(menuId, refresher) {
    const api = `${this.url}/v1/menus/remarks?menuId=${menuId}`;
    const req = this.http.get<any>(api).pipe(map(data => {
      this.logger.info('New getRemarks is called');
      return data;
    }), retryWhen(this.rs.retryFunction()));
    const ttl = 60 * 60 * 24; // 1 day
    const cacheString = `Web_Remarks ${api}`;
    if (refresher) {
      return this.cacheService.loadFromDelayedObservable(cacheString, req, this.remarkCacheKey, ttl, 'all');
    }
    return this.cacheService.loadFromObservable(cacheString, req, this.remarkCacheKey);
  }

  createRemarks(menuId, content) {
    const api = `${this.url}/v1/menus/remarks?menuId=${menuId}`;
    const req = this.http.post(api, { content: content }).pipe(map(data => {
      this.logger.info('New createRemarks is called');
      this.cacheService.clearGroup(this.remarkCacheKey);
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  updateRemarks(menuId, remarkId, content) {
    const api = `${this.url}/v1/menus/remarks?menuId=${menuId}&remarkId=${remarkId}`;
    const req = this.http.put(api, { content: content }).pipe(map(data => {
      this.logger.info('New updateRemarks is called');
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  deleteRemarks(menuId, remarkId) {
    const api = `${this.url}/v1/menus/remarks?menuId=${menuId}&remarkId=${remarkId}`;
    const req = this.http.delete(api).pipe(map(data => {
      this.logger.info('New deleteRemarks is called');
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  // Category Sections
  getCategory(menuId, refresher) {
    const api = `${this.url}/v1/menus/categories?menuId=${menuId}`;
    const req = this.http.get<any>(api).pipe(map(data => {
      this.logger.info('New getCategory is called');
      return data;
    }), retryWhen(this.rs.retryFunction()));
    const ttl = 60 * 60 * 24; // 1 day
    const cacheString = `Web_Category ${api}`;
    if (refresher) {
      return this.cacheService.loadFromDelayedObservable(cacheString, req, this.categoryCacheKey, ttl, 'all');
    }
    return this.cacheService.loadFromObservable(cacheString, req, this.categoryCacheKey);
  }

  createCategory(menuId, content) {
    const api = `${this.url}/v1/menus/categories?menuId=${menuId}`;
    const req = this.http.post<any>(api, { content: content }).pipe(map(data => {
      this.logger.info('New createCategory is called');
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  updateCategory(menuId, categoryId, content) {
    const api = `${this.url}/v1/menus/categories?menuId=${menuId}&categoryId=${categoryId}`;
    const req = this.http.put<any>(api, { content: content }).pipe(map(data => {
      this.logger.info('New updateCategory is called');
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  deleteCategory(menuId, categoryId) {
    const api = `${this.url}/v1/menus/categories?menuId=${menuId}&categoryId=${categoryId}`;
    const req = this.http.delete<any>(api).pipe(map(data => {
      this.logger.info('New deleteCategory is called');
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  changeCategoryStatus(menuId, categoryId, status) {
    const api = `${this.url}/v1/menus/categories/status?menuId=${menuId}&categoryId=${categoryId}&status=${status}`;
    const req = this.http.put<any>(api, {}).pipe(map(data => {
      this.logger.info('New changeCategoryStatus is called');
      this.cacheService.clearGroup(this.categoryCacheKey);
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  updateCategoryOrder(menuId, idList) {
    const api = `${this.url}/v1/menus/categories/order?menuId=${menuId}`;
    const req = this.http.put<any>(api, { idList: idList }).pipe(map(data => {
      this.logger.info('New updateCategoryOrder is called');
      this.cacheService.clearGroup(this.categoryCacheKey);
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  // Food section
  getFoodList(menuId, categoryId, refresher) {
    const api = `${this.url}/v1/menus/categories/foods?menuId=${menuId}&categoryId=${categoryId}`;
    const req = this.http.get<any>(api).pipe(map(data => {
      this.logger.info('New getFoodList is called');
      return data;
    }), retryWhen(this.rs.retryFunction()));
    const ttl = 60 * 60 * 24; // 1 day
    const cacheString = `Web_Food_List ${api}`;
    const cacheKey = this.foodListCacheKey + categoryId;
    if (refresher) {
      return this.cacheService.loadFromDelayedObservable(cacheString, req, cacheKey, ttl, 'all');
    }
    return this.cacheService.loadFromObservable(cacheString, req, cacheKey);
  }

  getFood(menuId, foodId) {
    const api = `${this.url}/v1/menus/foods?menuId=${menuId}&foodId=${foodId}`;
    const req = this.http.get<any>(api).pipe(map(data => {
      this.logger.info('New getFood is called');
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return this.cacheService.loadFromObservable('Web_Food ' + api, req, this.foodCacheKey + foodId);
  }

  createFood(menuId, categoryId, content) {
    const api = `${this.url}/v1/menus/categories/foods?menuId=${menuId}&categoryId=${categoryId}`;
    const req = this.http.post<any>(api, { content: content }).pipe(map(data => {
      this.logger.info('New createFood is called');
      this.cacheService.clearGroup(this.foodListCacheKey + categoryId);
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  updateFood(menuId, categoryId, foodId, content, ctrl) {
    const api = `${this.url}/v1/menus/foods?menuId=${menuId}&foodId=${foodId}`;
    const req = this.http.put<any>(api, { content: content }).pipe(map(data => {
      this.logger.info('New updateFood is called');
      this.cacheService.clearGroup(this.foodCacheKey + foodId);
      if (ctrl.isFoodNameChanged || ctrl.isCategoryChanged) {
        this.cacheService.clearGroup(this.foodListCacheKey + categoryId);
        if (ctrl.oldCategory) {
          this.cacheService.clearGroup(this.foodListCacheKey + ctrl.oldCategory);
        }
      }
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  deleteFood(menuId, foodId, categoryId) {
    const api = `${this.url}/v1/menus/foods?menuId=${menuId}&foodId=${foodId}`;
    const req = this.http.delete<any>(api).pipe(map(data => {
      this.logger.info('New deleteFood is called');
      this.cacheService.clearGroup(this.foodListCacheKey + categoryId);
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  changeFoodStatus(menuId, foodId, status, categoryId) {
    const api = `${this.url}/v1/menus/foods/status?menuId=${menuId}&foodId=${foodId}&status=${status}`;
    const req = this.http.put<any>(api, {}).pipe(map(data => {
      this.logger.info('New changeFoodStatus is called');
      this.cacheService.clearGroup(this.foodListCacheKey + categoryId);
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

  updateFoodOrder(menuId, idList, categoryId) {
    const api = `${this.url}/v1/menus/foods/order?menuId=${menuId}`;
    const req = this.http.put<any>(api, { idList: idList }).pipe(map(data => {
      this.logger.info('New updateFoodOrder is called');
      this.cacheService.clearGroup(this.foodListCacheKey + categoryId);
      return data;
    }), retryWhen(this.rs.retryFunction()));
    return req;
  }

}
