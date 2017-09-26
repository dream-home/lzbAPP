import { Component ,ViewChild} from '@angular/core';
import {Platform, Keyboard,Nav,ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppMinimize } from '@ionic-native/app-minimize';

import {NativeService} from "../providers/NativeService";
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { TranslateService} from 'ng2-translate/ng2-translate';
@Component({
    templateUrl: 'app.html'
})
export class MyApp {

    public rootPage:any = LoginPage;
    backButtonPressed:boolean = false;
    @ViewChild(Nav) nav: Nav;
    constructor(public keyboard: Keyboard,
        public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        public nativeService: NativeService,
        public appMinimize: AppMinimize,
        public toastCtrl: ToastController,
        public translateService: TranslateService
    ) {
        platform.ready().then(() => {
            statusBar.overlaysWebView(false);
            statusBar.styleDefault();
            splashScreen.hide();
            this.registerBackButtonAction();//注册返回按键事件
            this.assertNetwork();//检测网络
            translateService.setDefaultLang('zh-cn');//设置语言包
            // translateService.setDefaultLang('en-ww');//设置语言包
        });
    }

    assertNetwork() {
        if (!this.nativeService.isConnecting()) {
            this.nativeService.showToast('请连接网络');
        }
    }

    registerBackButtonAction() {
        this.platform.registerBackButtonAction(() => {
            if (this.keyboard.isOpen()) {//如果键盘开启则隐藏键盘
                this.keyboard.close();
                return;
            }

             let activeVC = this.nav.getActive();
              let page = activeVC.instance;




              if(page instanceof LoginPage){
                     return this.appMinimize.minimize();
              }


              if (!(page instanceof TabsPage)) {
                      if (!this.nav.canGoBack()) {
                        //当前页面为tabs，退出APP
                        return this.appMinimize.minimize();;
                      }
                  //当前页面为tabs的子页面，正常返回
                  return this.nav.pop();
                }
                let tabs = page.tabs;
                let activeNav = tabs.getSelected();
                if (!activeNav.canGoBack()) {
                  //当前页面为tab栏，退出APP
                  return this.appMinimize.minimize();
                }
                //当前页面为tab栏的子页面，正常返回
                return activeNav.pop();
              /*if ((page instanceof TabsPage) || (page instanceof LoginPage)) {

                    let activePortal = this.ionicApp._modalPortal.getActive();
                        if (activePortal) {
                            activePortal.dismiss();
                            return;
                        }
                    return this.appMinimize.minimize();//程序最小化

              }else{
                  if((page instanceof TabsPage) || (page instanceof LoginPage) ){
                    return;
                  }
                 return this.nav.pop();

              }*/



        }, 1);
    }


}
