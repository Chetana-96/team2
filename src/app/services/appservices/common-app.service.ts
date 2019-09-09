import { Injectable } from '@angular/core';
import { CommonHttpService } from '../../shared/common-http.service';
import { AppConstant } from '../../app.constant';
import * as appSettings from '../../../assets/constant.json';
import { LocalStorageService } from '../../shared/local-storage.service';
import * as _ from 'lodash';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/components/common/messageservice';
import * as CryptoJS from 'crypto-js';
@Injectable()
export class CommonAppService {
  appSettings: any = appSettings;
  api_url: string;
  appendpoint: string;
  statusbase: string;
  paytypebase: string;
  accountbase: string;
  registerurl: string;
  loginurl: string;
  userinfourl: string;
  logouturl: string;
  uploginurl: string;
  empcategorybase: string;
  queryparams: any = {};
  feesdetailsurl: string;
  CpAgreementurl: string;
  CpPaymentTypeurl: string;
  CpCardTypeurl: string;
  CompanyRegistrationurl: string;
  RegisterEmployeeurl: string;
  upForgotPwdurl: string;
  upResetPwdurl: string;
  CpDefaulturl: string;
  pinmodluebase: string;
  IspinLogin: boolean;
  pinId: any; 
  private preferenceSubject = new Subject<any>();
  public displayFormat = AppConstant.API_CONFIG.DATE.displayFormat;
  public apiFormat = AppConstant.API_CONFIG.DATE.apiFormat;
  key: string = AppConstant.ENCRYPTDECRIYPTKEY;
  constructor(private httpService: CommonHttpService, private LocalStorageService: LocalStorageService,
    private Router: Router, private MessageService: MessageService) {
    this.api_url = this.appSettings.API_ENDPOINT;
    this.appendpoint = this.api_url + AppConstant.API_CONFIG.M_BASE_URL;
    this.statusbase = this.appendpoint + AppConstant.API_CONFIG.API_URL.COMMON.StatusList;
    this.empcategorybase = this.appendpoint + AppConstant.API_CONFIG.API_URL.COMMON.EmpCategoryList;
    this.paytypebase = this.appendpoint + AppConstant.API_CONFIG.API_URL.COMMON.CpPayTypeList;
    this.accountbase = this.appendpoint + AppConstant.API_CONFIG.API_URL.account.BASE;
    this.registerurl = this.accountbase + AppConstant.API_CONFIG.API_URL.account.REGISTER;
    this.loginurl = this.api_url + AppConstant.API_CONFIG.M_CONNECT_URL + AppConstant.API_CONFIG.API_URL.UP_Login;
    this.userinfourl = this.api_url + AppConstant.API_CONFIG.M_CONNECT_URL + AppConstant.API_CONFIG.API_URL.UP_userinfo;
    this.logouturl = this.accountbase + AppConstant.API_CONFIG.API_URL.account.LOGOUT;
    this.uploginurl = this.accountbase + AppConstant.API_CONFIG.API_URL.account.LOGIN;
    
    this.CompanyRegistrationurl = this.appendpoint + AppConstant.API_CONFIG.API_URL.account.BASE;
    this.RegisterEmployeeurl = this.appendpoint + AppConstant.API_CONFIG.API_URL.account.BASE;
    this.upForgotPwdurl = this.appendpoint + AppConstant.API_CONFIG.API_URL.account.BASE;
    this.upResetPwdurl = this.appendpoint + AppConstant.API_CONFIG.API_URL.account.BASE;
  }
  public Login(data, role): Promise<any> {
    let formData: FormData = new FormData();
    formData.append('grant_type', AppConstant.API_CONFIG.IDENTITY_CONFIG.GRAND_TYPE);
    formData.append('username', data.controls["username"].value);
    formData.append('password', data.controls["password"].value);
    formData.append('scope', AppConstant.API_CONFIG.IDENTITY_CONFIG.SCOPE);
    formData.append('client_id', AppConstant.API_CONFIG.IDENTITY_CONFIG.CLIENTID);
    formData.append('client_secret', AppConstant.API_CONFIG.IDENTITY_CONFIG.CLIENTSECRET);
    formData.append('l_t', "U");
    return this.httpService.globalPostService(this.api_url + AppConstant.API_CONFIG.M_CONNECT_URL + AppConstant.API_CONFIG.API_URL.UP_Login, formData)
      .then((data: any) => {
        if (data != null) {
          if (data.access_token != null) {
            // this.LocalStorageService.clearAllItem();

            //remove
            this.LocalStorageService.removeAllExtItems();
            // remove
            this.LocalStorageService.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.TOKEN, data.access_token);
            this.LocalStorageService.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.TOKEN_TYPE, data.token_type);
            this.LocalStorageService.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.TOKEN_EXPIRES, data.expires_in);
            this.LocalStorageService.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.ROLE, role);
            //this.LocalStorageService.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.IS_ACTINGCP, false);
            this.LocalStorageService.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.USERINFO, "{}");
            this.LocalStorageService.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.IS_ACTINGUP, false);

          }
        }
        return data;
      });
  }

  public upLogin(data, role): Promise<any> {
    let formData = {
      grant_type: AppConstant.API_CONFIG.IDENTITY_CONFIG.GRAND_TYPE,
      username: data.username,
      password: data.password,
      isReLogin: (data.isReLogin != undefined && data.isReLogin != null ? data.isReLogin : false),
      scope: AppConstant.API_CONFIG.IDENTITY_CONFIG.SCOPE,
      client_id: AppConstant.API_CONFIG.IDENTITY_CONFIG.CLIENTID,
      client_secret: AppConstant.API_CONFIG.IDENTITY_CONFIG.CLIENTSECRET,
      l_t: "U"
    };
    return this.httpService.globalPostService(this.uploginurl, formData)
      .then((resData: any) => {
        if (resData != null) {
          if (resData.result != null) {
            // this.LocalStorageService.clearAllItem();
            var token = resData.result.tokenobj;
            //remove
            if (token) {
              this.LocalStorageService.removeAllExtItems();
              // remove
              this.LocalStorageService.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.TOKEN, token.access_token);
              this.LocalStorageService.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.TOKEN_TYPE, token.token_type);
              this.LocalStorageService.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.TOKEN_EXPIRES, token.expires_in);
              this.LocalStorageService.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.ROLE, role);
              this.LocalStorageService.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.USERINFO, "{}");
              this.LocalStorageService.addItem(AppConstant.API_CONFIG.LOCALSTORAGE.IS_ACTINGUP, false);

            }

          }
        }
        return resData;
      });
  }

  
  public getUserInfo(data: any): Promise<any> {
    return this.httpService.globalGetServiceByUrl(this.userinfourl, data)
      .then(data => {
        return data;
      });
  }

  public cpCompanyRegistration(data: any): Promise<any> {
    return this.httpService.globalPostService(this.CompanyRegistrationurl + "/registercompany", data) // + "/registercompany"
      .then(data => {
        return data;
      });
  }

  public findUserNameAndEmail(data: any): Promise<any> {
    return this.httpService.globalPostService(this.CompanyRegistrationurl + "/findUserNameAndEmail", data) // + "/registercompany"
      .then(data => {
        return data;
      });
  }
  public RegisterEmployee(data: any): Promise<any> {
    return this.httpService.globalPostService(this.RegisterEmployeeurl + "/registeremployee", data)
      .then(data => {
        return data;
      });
  }

  public getCompanyID(data: any): Promise<any> {
    return this.httpService.globalPostService(this.CompanyRegistrationurl + "/gecompanydetails", data)
      .then(data => {
        return data;
      });
  }

  public getAll(data: any): Promise<any> {
    return this.httpService.globalGetService(this.CpAgreementurl + "/GetAll", data)
      .then(data => {
        return data;
      });
  }

  public upForgotPwd(data: any): Promise<any> {
    return this.httpService.globalPostService(this.upForgotPwdurl + "/forgotPwd", data)
      .then(data => {
        return data;
      });
  }
  public upResetPwd(data: any): Promise<any> {
    return this.httpService.globalPostService(this.upResetPwdurl + "/resetPassword", data)
      .then(data => {
        return data;
      });
  }

  public logOut(data: any): Promise<any> {
    // $("#session_expireId").hide();
    var userinfo = this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USERINFO);
    
    var employeeId = 0;
    if (userinfo != undefined && userinfo != null) {
      employeeId = parseInt(userinfo.EmployeeId);
    }
    return this.httpService.globalGetServiceByUrl(this.logouturl, employeeId)
      .then(data => {
        // return data;
        this.makeSessionOut();
      });

  }
  public makeSessionOut() {
    var role = _.clone(this.LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.ROLE));
    // this.LocalStorageService.clearAllItem();
    this.LocalStorageService.removeAllExtItems();
    
    if (this.Router.url.indexOf("/master/") >= 0) {
      this.Router.navigate(['mp-login']);
    }
    else if (this.Router.url.indexOf("/controls/") >= 0) {
      this.Router.navigate(['cp-login']);
    }
    else {
      var lId, lLvl, pos, mode;
      this.Router.routerState.root.queryParams.subscribe((params: Params) => {
        this.queryparams.lId = params['lId'];
        this.queryparams.pId = params['pId'];
        this.queryparams.lLvl = params['lLvl'];
        this.queryparams.pos = params['pos'];
        this.queryparams.mode = params['mode'];
        this.queryparams.t = params['t'];
      });
      this.Router.navigate(['user-login'], { queryParams: this.queryparams });
    }    
    return false;
  }
  // get status list
  public getStatusAll(data: any): Promise<any> {
    return this.httpService.globalGetServiceByUrl(this.statusbase, data)
      .then(data => {
        return data;
      });
  }
  public getEmpCategoryAll(data: any): Promise<any> {
    return this.httpService.globalGetServiceByUrl(this.empcategorybase, data)
      .then(data => {
        return data;
      });
  }
  public getPaytypeAll(data: any): Promise<any> {
    return this.httpService.globalGetServiceByUrl(this.paytypebase, data)
      .then(data => {
        return data;
      });
  }
  public getCpDefaults(data: any): Promise<any> {
    return this.httpService.globalPostService(this.CpDefaulturl + "/getCpDefaultValue", data)
      .then(data => {
        return data;
      });
  }
  // reference https://github.com/jigneshkhatri/primeng-treenode-preselect/blob/master/treeNodes.component.ts
  checkNode(nodes, str: string[], selectedNodes) {
    for (let i = 0; i < nodes.length; i++) {
      if ((!(nodes[i].children.length > 0))) {
        for (let j = 0; j < nodes[i].children.length; j++) {
          if (str.includes(nodes[i].children[j].id)) {
            if (!selectedNodes.includes(nodes[i].children[j])) {
              selectedNodes.push(nodes[i].children[j]);
            }
          }
        }
      }
      if (nodes[i].leaf) {
        return;
      }
      this.checkNode(nodes[i].children, str, selectedNodes);
      let count = nodes[i].children.length;
      let c = 0;
      for (let j = 0; j < nodes[i].children.length; j++) {
        if (selectedNodes.includes(nodes[i].children[j])) {
          c++;
        }
        if (nodes[i].children[j].partialSelected) nodes[i].partialSelected = true;
      }
      if (c == 0) { }
      else if (c == count) {
        nodes[i].partialSelected = false;
        if (!selectedNodes.includes(nodes[i])) {
          selectedNodes.push(nodes[i]);
        }
      }
      else {
        nodes[i].partialSelected = true;
      }
    }
  }
  
  
  public detechBrowserCompatibility() {
    var objappVersion = navigator.appVersion;
    var objAgent = navigator.userAgent;
    var objbrowserName = navigator.appName;
    var objfullVersion = '' + parseFloat(navigator.appVersion);
    var objBrMajorVersion = parseInt(navigator.appVersion, 10);
    var objOffsetName, objOffsetVersion, ix;
    // In Chrome /Opera|OPR\//
    if (((objOffsetVersion = objAgent.indexOf("Chrome")) != -1) && (objAgent.indexOf("Opera") == -1) && (objAgent.indexOf("OPR") == -1)) {
      objbrowserName = "Chrome";
      objfullVersion = objAgent.substring(objOffsetVersion + 7);
    } // In Microsoft internet explorer
    else if ((objOffsetVersion = objAgent.indexOf("MSIE ")) != -1 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      objbrowserName = "Microsoft Internet Explorer";
      objfullVersion = objAgent.substring(objOffsetVersion + 5);
    }
    // In Firefox 
    else if ((objOffsetVersion = objAgent.indexOf("Firefox")) != -1) {
      var res = objAgent.split("/");
      if (res.length) {
        objBrMajorVersion = parseInt(res[res.length - 1]);
      }
      objbrowserName = "Firefox";
    }
    // In Opera 
    else if ((objAgent.indexOf("Opera") == -1) || (objAgent.indexOf("OPR") == -1)) {
      objbrowserName = "Opera";
      objOffsetVersion = objAgent.match(/Opera|OPR\//).index
      objfullVersion = objAgent.substring(objOffsetVersion + 4, objOffsetVersion + 8)
    }
    // In Safari 
    else if ((objOffsetVersion = objAgent.indexOf("Safari")) != -1) {
      objbrowserName = "Safari";
      objfullVersion = objAgent.substring(objOffsetVersion + 7);
      if ((objOffsetVersion = objAgent.indexOf("Version")) != -1)
        objfullVersion = objAgent.substring(objOffsetVersion + 8);
    }
    // For other browser "name/version" is at the end of userAgent
    else if ((objOffsetName = objAgent.lastIndexOf(' ') + 1) < (objOffsetVersion = objAgent.lastIndexOf('/'))) {
      objbrowserName = objAgent.substring(objOffsetName, objOffsetVersion);
      objfullVersion = objAgent.substring(objOffsetVersion + 1);
      if (objbrowserName.toLowerCase() == objbrowserName.toUpperCase()) {
        objbrowserName = navigator.appName;
      }
    }
    // trimming the fullVersion string at semicolon/space if present
    if ((ix = objfullVersion.indexOf(";")) != -1)
      objfullVersion = objfullVersion.substring(0, ix);
    if ((ix = objfullVersion.indexOf(" ")) != -1)
      objfullVersion = objfullVersion.substring(0, ix);
    if (objbrowserName != "Firefox")
      objBrMajorVersion = parseInt('' + objfullVersion, 10);
    if (isNaN(objBrMajorVersion)) {
      objfullVersion = '' + parseFloat(navigator.appVersion);
      objBrMajorVersion = parseInt(navigator.appVersion, 10);
    }
    if ((objAgent.indexOf("Edge")) != -1) {
      objbrowserName = "Edge";
    }
    var browserUncomportable = false;
    var message = `The browser version being used is not supported.  You can continue using ChatApp, but please be aware that there are features which may
     not work as expected.  We recommend you upgrade your browser to a supported version. 
     See Help for the listing of supported browsers`;
    switch (objbrowserName) {
      case "Chrome":
        if (objBrMajorVersion < 72) {
          browserUncomportable = true;
        }
        break;
      case "Microsoft Internet Explorer":
        var msie = objAgent.indexOf("MSIE ");
        var rv = -1;
        var version = 0;
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer, return version number
        {
          if (isNaN(parseInt(objAgent.substring(msie + 5, objAgent.indexOf(".", msie))))) {
            //For IE 11 >
            if (navigator.appName == 'Netscape') {
              var ua = navigator.userAgent;
              var re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
              if (re.exec(ua) != null) {
                rv = parseFloat(RegExp.$1);
                objBrMajorVersion = rv;
              }
            }
            else {
              alert('otherbrowser');
            }
          }
          else {
            //For < IE11
            objBrMajorVersion = parseInt(objAgent.substring(msie + 5, objAgent.indexOf(".", msie)));
          }
        }
        if (objBrMajorVersion < 11) {
          browserUncomportable = true;
        }
        break;
      case "Firefox":
        if (objBrMajorVersion < 35) {
          browserUncomportable = true;
        }

        break;
      case "Opera":
        if (objBrMajorVersion < 50) {
          browserUncomportable = true;
        }
        break;
      case "Safari":
        if (objBrMajorVersion < 12) {
          browserUncomportable = true;
        }
        break;
      case "Edge":

        break;
      default:
        message = `The browser being used is not supported.  You can continue using ChatApp,
       but please be aware that there are features which may not work as expected.  We recommend you use a supported browser. 
        See Help for the listing of supported browsers`;
        browserUncomportable = true;
        break;
    }   
    console.log('' + 'Browser name = ' + objbrowserName, 'Full version = ' + objfullVersion + '<br>' + 'Major version = ' + objBrMajorVersion + '<br>' + 'navigator.appName = ' + navigator.appName + '<br>' + 'navigator.userAgent = ' + navigator.userAgent + '<br>')
    return browserUncomportable;
  }
  encryptdata(data, key?) {
    let encrypt = null
    if (data != undefined && data != null) {
      encrypt = CryptoJS.SKY.encrypt(data.trim(), this.key).toString();
    }
    return encrypt;
  }
  decryptdata(data, key?) {
    let decrypt = null
    if (data != undefined && data != null) {
      decrypt = CryptoJS.SKY.decrypt(data.trim(), this.key).toString(CryptoJS.enc.Utf8);
    }
    return decrypt;
  }

}
