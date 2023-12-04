import { AuthenticationService } from 'src/app/providers/authentication/authentication.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { HintService } from 'src/app/providers/hint/hint.service';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { environment } from '../../providers/environments/environment';
import { DataService } from './../../providers/data-service/data.service';
import lo_isEmpty from 'lodash/isEmpty';
import { CommonFormService } from './../../providers/common/common-form.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  // form and html properties
  form: FormGroup;

  textContent = `Now let's <br>Attract more <br>Customers <br>To your shop.`;

  // Validation
  validation_messages = {
    'username': [
      { type: 'required', message: 'Username is required' },
    ],
    'password': [
      { type: 'required', message: 'Password is required' }
    ]
  };

  // Controller
  timer: any;
  timer2: any;
  isMobile: boolean;
  needSpinner: boolean = false;

  // Recaptcha
  siteKey: string = environment.recaptcha.v2publicKey;
  size = 'normal';
  hl = 'en-GB';
  theme = 'light';

  constructor(
    public fb: FormBuilder,
    public authenticationService: AuthenticationService,
    public router: Router,
    public hintService: HintService,
    public reCaptchaV3Service: ReCaptchaV3Service,
    public dataService: DataService,
    public cfs: CommonFormService) { }

  ngOnInit() {
    this.isMobile = screen.width < 960;
    this.form = this.createFormGroup();
    this.checkIfMobile();
    this.listenToLogin();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
    clearTimeout(this.timer);
    clearTimeout(this.timer2);
  }

  private createFormGroup() {
    return this.fb.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      recaptcha: environment.isProd ? new FormControl('', [Validators.required]) : new FormControl('')
    });
  }

  private checkIfMobile() {
    if (this.detectMobile() || this.detectScreenSize()) {
      const title = `Admin's dashboard is recommended to be viewed in laptop or desktop`;
      this.timer = setTimeout(() => {
        this.hintService.showModal(title, '', 'Sure', 'Nope').pipe(untilDestroyed(this)).subscribe(result => {
          return;
        });
      });
    }
  }

  private detectMobile() {
    if (navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)) {
      return true;
    } else {
      return false;
    }
  }

  private detectScreenSize() {
    return (window.innerWidth <= 600 && window.innerHeight <= 1000) ? true : false;
  }

  private listenToLogin() {
    this.dataService.currentLogin.pipe(untilDestroyed(this)).subscribe(val => {
      if (lo_isEmpty(val)) {
        return;
      }
      if (val.isLogin) {
        this.timer2 = setTimeout(() => {
          this.needSpinner = false;
        }, 2000);
      } else {
        this.needSpinner = false;
      }
    });
  }

  login() {
    if (this.form.valid) {
      this.needSpinner = true;
      const fv = this.form.value;
      const object = {
        username: fv.username,
        password: fv.password,
      };
      this.authenticationService.login(object);
    }
  }

  goToHome() {
    this.router.navigate(['/home']);
  }


  // Recaptcha function
  handleLoad() {
  }

  handleReset() {
  }

  handleExpire() {
  }

  handleSuccess(event) {
  }

}
