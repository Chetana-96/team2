import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { MasterService } from '../services/master.service';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { CommonAppService } from '../services/appservices/common-app.service';
import { CookieService } from '../services/cookie.service';
import { LocalStorageService } from '../shared/local-storage.service';
import { AppConstant } from '../app.constant';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as _ from 'lodash';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit, AfterViewInit {
    upLoginForm: FormGroup;
    upForgotPwdForm: FormGroup;
    resetPwdForm: FormGroup;
    msgs: Message[] = [];
    upLoginformObj = {} as any;
    upForgotPwdformObj = {} as any;
    upResetPwdFormObj = {} as any;
    queryparams: any = {};
    showLoginUser: boolean = true;
    showForgotPwd: boolean = false;
    model: any = {};
    loginHeaderText: string = "Member Login";
    showResetPassForm: boolean = false;
    disableLoginSubmit: boolean = false;
    constructor(private _router: Router, private formBuilder: FormBuilder,
      private MasterService: MasterService, private messageService: MessageService, private CookieService: CookieService,
      private CommonAppService: CommonAppService, private LocalStorageService: LocalStorageService, private ActivatedRoute: ActivatedRoute) {
      this.LocalStorageService.removeAllExtItems();
      this.LocalStorageService.clearAllItem();
      this._router.navigate(['/login']);
      this.loginHeaderText = "Member Login";
      this.showLoginUser = true;
  
      this.upLoginformObj = {
        username: {
          required: "Please Enter Username",
        },
        password: {
          required: "Please Enter Password"
        },
        remember_me: false
      }
  
      this.upForgotPwdForm = this.formBuilder.group(
        {
          Email: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]))
        });
      this.upForgotPwdformObj = {
        email: {
          Email: { required: "Email is required", pattern: "Enter a valid primary email", }
        }
      }
      this.resetPwdForm = this.formBuilder.group(
        {
          Username: new FormControl('', Validators.compose([Validators.required])),
          Password: new FormControl('', Validators.compose([Validators.required])),
          ConfirmPassword: new FormControl('', Validators.compose([Validators.required])),
          Token: new FormControl(''),
        });
      this.upResetPwdFormObj = {
        Username: { required: "User Name can not be empty", minlength: "Username required minimum 6 characters.", },
        Password: { required: "Password can not be empty", minlength: "Password required minimum 6 characters.", },
        ConfirmPassword: { required: "Confirm Password can not be empty", minlength: "Password required minimum 6 characters.", },
      }
  
      this.upLoginForm = this.formBuilder.group(
        {
          username: [null, Validators.required],
          password: [null, Validators.required],
          remember_me: [null]
        }
      );
      this.changePassword();
    }
    intialize();
    intialize() {
      this.loginHeaderText = "Member Login";
      this.showLoginUser = true;
      this.showForgotPwd = false;
    }
  
  
    hideall() {
    }
    showservicemodel(model) {
      this.hideall();
      this[model] = true;
      model = true;
    }
  
  
    userLogin() {
      localStorage.setItem('isControlLogin', 'false');
      localStorage.setItem('isMasterLogin', 'false');
      localStorage.setItem('isUserLogin', 'true');
      this._router.navigate(['/dashboard']);
    }
  
  
    forgotPassword() {
      this.loginHeaderText = "Forgot Password";
      this.showForgotPwd = true;
      this.showLoginUser = false;
      this.showResetPassForm = false;
    }
    changePassword() {
      this.ActivatedRoute.queryParams.subscribe(queryParams => {
        if (queryParams.token != undefined && queryParams.token != null) {
          this.loginHeaderText = "Change Password";
          this.showLoginUser = false;
          this.showForgotPwd = false;
          this.showResetPassForm = true;
          this.resetPwdForm.controls["Token"].setValue(queryParams.token);
        };
      })
    }
    ngOnInit() {
  
      // this.elementRef.nativeElement.focus();
      this.ActivatedRoute.queryParams.subscribe(queryParams => {
        // do something with the query params
        //console.log(queryParams);
        if (queryParams.token != undefined && queryParams.token != null) {
          this.loginHeaderText = "Change Password";
          this.showLoginUser = false;
          this.showForgotPwd = false;
          this.showResetPassForm = true;
          this.resetPwdForm.controls["Token"].setValue(queryParams.token);
        };
      })
      this.checkrememberMe();
    }
    ngAfterViewInit() {
    }
    ForgotPwd_up(ForgotPwd_up) {
      var temp_url = window.location.origin;
      // console.log("forgot password", ForgotPwd_up)
      var req = {
        Email: ForgotPwd_up.controls.Email.value,
        CommunicationEmail: temp_url
      };
      if (ForgotPwd_up.status == "INVALID") {
        var errmsg = this.MasterService.getFormErrorMessage(this.upForgotPwdForm, this.upForgotPwdformObj);
        //this.messageService.add({ severity: 'error', summary: 'Error', detail: errmsg })
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errmsg })
        return false;
      } else {
        this.CommonAppService.upForgotPwd(req)
          .then((data) => {
            if (data.status != 0) {
              //localStorage.setItem('sessionForgotPwd', data.result);
              this.messageService.add({ severity: 'success', summary: 'success', detail: 'Reset password url will be generated and sent to your Email' })
              this.upForgotPwdForm.reset();
            }
            else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Email.' })
            }
          })
      }
    }
    ResetPwd_up(form) {
      var externalvalid = true;
      var externalvalidation_msg = "";
      //console.log(form);
      if (this.resetPwdForm.status == "INVALID") {
        var errorMessage = this.MasterService.getFormErrorMessage(this.resetPwdForm, this.upResetPwdFormObj);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
        return false;
      }
      else {
        var formdata = this.resetPwdForm.getRawValue();
        formdata.Username = _.trim(formdata.Username);
        formdata.Password = _.trim(formdata.Password);
        formdata.ConfirmPassword = _.trim(formdata.ConfirmPassword);
        if (formdata.ConfirmPassword != formdata.Password) {
          externalvalid = false;
          externalvalidation_msg = "Password does not match the confirm password.";
        }
        if (externalvalid) {
          this.CommonAppService.upResetPwd(formdata)
            .then((data) => {
              // debugger;
              if (data.status != 0) {
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password reset successful!' });
                this.backLoginForm();
              }
              else {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message })
              }
            })
        }
        else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: externalvalidation_msg });
          return false;
        }
      }
  
    }
    returnLoginForm() {
      this.loginHeaderText = "Member Login";
      this.showLoginUser = true;
      this.showForgotPwd = false;
      this.showResetPassForm = false;
    }
    backLoginForm() {
      this._router.navigate(['/login']);
      this.loginHeaderText = "Member Login";
      this.showLoginUser = true;
      this.showForgotPwd = false;
      this.showResetPassForm = false;
      this.resetPwdForm.reset();
    }
    Login_up(upLoginForm) {
      if (upLoginForm.status == "INVALID") {
  
        var errorMessage = this.MasterService.getFormErrorMessage(this.upLoginForm, this.upLoginformObj);
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: 'Error', detail: errorMessage });
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
        return false;
      }
      this.rememberMe();
      var loginFormdata = {
        username: upLoginForm.controls["username"].value,
        password: upLoginForm.controls["password"].value,
        pinId: null,
        isPin: false,
        isCpMp: false,
      }     
      
       {
        this.LocalStorageService.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.ISLOGGEDIN, false);
        // this.upLoginMethod(loginFormdata)
        this._router.navigate(['/dashboard']);
      }
    }
    public upLoginMethod(req) {
      this.disableLoginSubmit = true;
      $("#login_submit").addClass("btn_disabled");
      this.CommonAppService.upLogin(req, "up_user")
        .then(res => {
          if (res) {
            if (!_.isEmpty(res)) {
              if (res.status == 1) {
                var result = res.result;
                if (result) {
                  var userinfo: any = result.userinfo;
                  var companyinfo = result.group_info.company_info[0];
                  userinfo.username = this.upLoginForm.controls['username'].value;
                  userinfo.displayName = userinfo.given_name;
                  if (result.group_info.emp_info) {
                    var employeeInfo: any = result.group_info.emp_info[0];
                    userinfo.displayName = employeeInfo.FirstName + " " + employeeInfo.LastName;
                  }
                  this.LocalStorageService.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.USERINFO, userinfo);
                  this.LocalStorageService.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.COMPANYINFO, companyinfo);
                  
                  if (userinfo.role == "up_general" || userinfo.role == "up_user" || userinfo.role == "up_manager") {
  
                    this._router.navigate(['/dashboard'], { queryParams: this.queryparams });
                  }
                  else {
                    this.disableLoginSubmit = false;
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: "you are not authorized" });
                  }
                }
                else {
                  this.disableLoginSubmit = false;
                }
              }
              else {
                this.disableLoginSubmit = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: "Incorrect Username/Password." });
                return false;
              }
  
            }
            else {
              this.disableLoginSubmit = false;
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "Something went wrong.Please try again." });
              return false;
            }
          }
          else
            this.disableLoginSubmit = false;
        }, error => {
          this.disableLoginSubmit = false;
        });
    }
    public getUserInfoData() {
      this.CommonAppService.getUserInfo("").then((res) => {
        if (res) {     
  
          this.LocalStorageService.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.USERINFO, res);
          if (res.role == "mp_user")
            setTimeout(() => {
              this._router.navigate(['master/home']);
            }, 1000)
          else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "You are not authorized" });
          }
        }
  
      }).catch(e => {
      });
    }
    checkrememberMe() {
      const value = this.CookieService.get('u_rmp');
      if (value == "true") {
        this.upLoginForm.patchValue(
          {
            username: this.CookieService.get("u_u"),
            remember_me: this.CookieService.get("u_rmp")
          }
        );
      }
    }
    rememberMe() {
      if ($('#remember_me').is(':checked')) {
  
        this.CookieService.set('u_rmp', this.upLoginForm.controls["remember_me"].value, 30);
        this.CookieService.set('u_u', this.upLoginForm.controls["username"].value, 30);
        // this.CookieService.set('u_p',this.upLoginForm.controls["password"].value,30);
      }
      else {
        this.CookieService.set('u_rmp', "false", 30);
        this.CookieService.delete('u_u');
        this.CookieService.delete('u_p');
      }
    }

    onLoggedin() {
      this.LocalStorageService.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.ISLOGGEDIN, false);
        // localStorage.setItem('isLoggedin', 'true');
        // this._router.navigate(['/dashboard']);
    }
}
