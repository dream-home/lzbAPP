import { Injectable } from '@angular/core';
import { ToastController, LoadingController, Platform, Loading, AlertController } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppVersion } from '@ionic-native/app-version';
import { Toast } from '@ionic-native/toast';
import { Network } from '@ionic-native/network';

import {Observable} from "rxjs";

import { REQUEST_TIMEOUT } from "./Constants";
import { GlobalData } from "./GlobalData";

import { TranslateService} from 'ng2-translate/ng2-translate';
@Injectable()
export class NativeService {
    private loading: Loading;
    private loadingIsOpen: boolean = false;

    constructor(private platform: Platform,
        private toastCtrl: ToastController,
        private alertCtrl: AlertController,
        private statusBar: StatusBar,
        private splashScreen: SplashScreen,
        private appVersion: AppVersion,
        private toast: Toast,
        private globalData: GlobalData,
        private network: Network,
        private loadingCtrl: LoadingController,
        private translateService: TranslateService) {

    }

    /**
     * 获取国际化语言.json文件相对于的键值对
     */
    getTranslateValue(key:string): string {
        var map:any = {
          _isScalar:'',
          value:'',
          scheduler:''
        }
        map = this.translateService.get(key);
        // console.log(" 国际化 "+map.value+"   "+JSON.stringify(this.translateService.get(key)));
        return map.value;
    }
    /**
     * 使用默认状态栏
     */
    statusBarStyleDefault(): void {
        this.statusBar.overlaysWebView(false);
        this.statusBar.styleDefault();
    }

    /**
     * 隐藏启动页面
     */
    splashScreenHide(): void {
        this.splashScreen.hide();
    }

    /**
     * 获取网络类型 如`unknown`, `ethernet`, `wifi`, `2g`, `3g`, `4g`, `cellular`, `none`
     */
    getNetworkType(): string {
        if (!this.isMobile()) {
            return 'wifi';
        }
        return this.network.type;
    }

    /**
     * 判断是否有网络
     */
    isConnecting(): boolean {
        return this.getNetworkType() != 'none';
    }

    /**
     * 是否真机环境
     */
    isMobile(): boolean {
        return this.platform.is('mobile') && !this.platform.is('mobileweb');
    }

    /**
     * 是否android真机环境
     */
    isAndroid(): boolean {
        return this.isMobile() && this.platform.is('android');
    }

    /**
     * 是否ios真机环境
     */
    isIos(): boolean {
        return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
    }

    /**
     * 弹出框
     * @param title 标题
     * @param subTitle 小标题
     */
    alert(title: string, subTitle: string = "",): void {
        this.alertCtrl.create({
            title: title,
            subTitle: subTitle,
            buttons: [{text: '确定'}]
        }).present();
    }

    /**
    * 统一调用此方法显示提示信息
    * @param message 信息内容
    * @param duration 显示时长
    */
    showToast(message: string = '操作完成', duration: number = 2000): void {
        if (this.isMobile()) {
            this.toast.show(message, String(duration), 'center').subscribe();
        } else {
            this.toastCtrl.create({
                message: message,
                duration: duration,
                position: 'bottom',
                showCloseButton: false
            }).present();
        }
    }

    /**
    * 统一调用此方法显示loading
    * @param content 显示的内容
    */
    showLoading(content: string = '正在加载中....'): void {
        if (!this.globalData.showLoading) {
            return;
        }
        if (!this.loadingIsOpen) {
            this.loadingIsOpen = true;
            this.loading = this.loadingCtrl.create({
                content: content,
                showBackdrop: false
            });
            this.loading.present();
            setTimeout(() => {
                this.loadingIsOpen && this.loading.dismiss();
                this.loadingIsOpen = false;
            }, REQUEST_TIMEOUT);
        }
    }


     /**
    * 此方法显示带图片loading
    * @param content 显示带图片的内容
    * @param status 1:操作成功，0:操作失败
    */
    showImgLoading(content: string = '操作成功',status: any='1'): void {

            this.loading = this.loadingCtrl.create({
                spinner: 'hide',
                content: status =='1'?'<div ><center><img src="assets/img/success.png"><br/><ion-label>'+content+'</ion-label></center></div>':'<div ><center><img src="assets/img/error.png"><br/><ion-label>'+content+'</ion-label></center></div>',
                 duration: 1000
            });
            this.loading.present();



    }




    /**
    * 关闭loading
    */
    hideLoading(): void {
        if (!this.globalData.showLoading) {
            this.globalData.showLoading = true;
        }
        this.loadingIsOpen && this.loading.dismiss();
        this.loadingIsOpen = false;
    }

    /**
    * 获得app版本号,如0.01
    * @description  对应/config.xml中version的值
    */
    getVersionNumber(): Observable<string> {
        return Observable.create(observer => {
            this.appVersion.getVersionNumber().then((value: string) => {
                observer.next(value);
            }).catch(err => {
                this.alert('获得app版本号失败');
            });
        });
    }

    /**
    * 获得app name,如现场作业
    * @description  对应/config.xml中name的值
    */
    getAppName(): Observable<string> {
        return Observable.create(observer => {
            this.appVersion.getAppName().then((value: string) => {
                observer.next(value);
            }).catch(err => {
                this.alert('获得app name失败');
            });
        });
    }

    /**
    * 获得app包名/id,如com.kit.ionic2tabs
    * @description  对应/config.xml中id的值
    */
    getPackageName(): Observable<string> {
        return Observable.create(observer => {
            this.appVersion.getPackageName().then((value: string) => {
                observer.next(value);
            }).catch(err => {
                this.alert('获得app包名失败');
            });
        });
    }


     //保留n为小数
    getFloat2(number,n) {
      /* n = n ? parseInt(n) : 0;
      if (n <= 0) return Math.round(number);
       number = Math.round(number * Math.pow(10, n)) / Math.pow(10, n); */

      let s = number.toString();

        let rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
          while (s.length <= rs + n) {
                s += '0';
            }

        }
        if (rs > 0) {
            let next=s.split(".");
            let small=next[1].length;
            if(small>n){
                s=next[0]+"."+next[1].substring(0,n);
            }
            if(small<n){
                let m=n-small;

              for (var i=0;i<m;i++) {
                   s += '0';
                }
            }
        }
      // s=parseFloat(s);
        return s;
      //return number;
    };

}
