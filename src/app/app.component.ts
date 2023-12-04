import { CacheService } from 'ionic-cache';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ConnectionService } from 'ng-connection-service';
import { FacebookService, InitParams } from 'ngx-facebook';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from './providers/authentication/token.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Router, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

  title: string = 'Vouchy';
  isConnected: boolean = true;
  loading: boolean = false;

  constructor(
    public cacheService: CacheService,
    public connectionService: ConnectionService,
    public facebookService: FacebookService,
    public toastr: ToastrService,
    public tokenService: TokenService,
    public router: Router) { }

  ngOnInit() {
    this.loading = true;
    this.tokenService.setUpToken();
    this.setUpCacheService();
    this.listenNetworkConnection();
    this.initFacebookService();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  ngAfterViewInit() {
    this.listenPageLoadStatus();
  }

  private listenPageLoadStatus() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        this.loading = false;
      }
    });
  }

  private setUpCacheService() {
    this.cacheService.setDefaultTTL(60 * 60 * 24);
    this.cacheService.setOfflineInvalidate(false);
  }

  private listenNetworkConnection() {
    this.connectionService.monitor().pipe(untilDestroyed(this)).subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.toastr.success('You are connected to internet');
      } else {
        this.toastr.error('No internet connection', '', { timeOut: 10000 });
      }
    });
  }

  private initFacebookService(): void {
    const initParams: InitParams = { xfbml: true, version: 'v3.2' };
    this.facebookService.init(initParams);
  }
}
