import { Component } from '@angular/core';
import {Platform,NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { HttpService } from "../../providers/HttpService";
import { NativeService } from "../../providers/NativeService";
import { GlobalData } from "../../providers/GlobalData";
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import { ForgetPwdPage } from '../forgetPwd/forgetPwd';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

    userName:string;//用户名
    passWord:string;//密码
    showClear:boolean = false;//显示清除输入框按钮
    showType:boolean = false;//显示密码
    loginButton:boolean = false;//登录按钮

    saveLogin:any= {
        saveLoginName:"",
        saveLoginPwd:"",
        curtime:new Date().getTime()//获取当前时间
    };//用于保存登录信息
    constructor(
        private platform: Platform,
        public navCtrl: NavController,
        public httpService: HttpService,
        public nativeService:NativeService,
        public globalData: GlobalData,
        private alertCtrl: AlertController

    ){
        
    }

    /*页面事件*/
    ionViewWillEnter(){
        this.isServletUpdate(); 
        var str=localStorage.getItem("loginInfo");
        var s=JSON.parse(str);
        if(s!=null){
            let exp=1000*60*60*24*7;
            if((new Date().getTime() - s.curtime) > exp){//如果当前时间-减去存储的元素在创建时候设置的时间 > 过期时间
                this.nativeService.showToast("保存登录已经过期，请重新登录");//提示过期
            }else{
                this.userName=s.saveLoginName;
                this.passWord=s.saveLoginPwd;
              //  console.log("没有过期啊没有过期");
                this.goLogin();
            }
       }
    }

    //跳转到首页
    gotoHomePage(){
        this.navCtrl.push(HomePage);
    }

    //跳转到注册页面
    gotoRegister(){
        this.navCtrl.push(RegisterPage);
    }

    //跳转到忘记密码页面
    gotoForgetPwd(){
        this.navCtrl.push(ForgetPwdPage);
    }

    //是否显示清除输入框
    showClearInput(e){
        e.stopPropagation();
        if(this.userName.length > 0){
            this.showClear = true;
        }else{
            this.showClear = false;
        }
    }

    //清除输入框
    clearInput(){
        this.userName = '';
        this.showClear = false;
    }

    //显示/不显示密码
    showPassWord(){
        if(this.showType){
            this.showType = false;
        }else{
            this.showType = true;
        }
    }

    //登录
    goLogin(){
        if(this.validator()){
            this.loginButton = true;
            var paramMap = {
                mobile:this.userName,//手机号/UID
                loginPwd:this.passWord
            };
            this.httpService.post('/user/login',paramMap).subscribe((respData:any)=>{
                if(respData.code=='0000'){
                    //this.nativeService.showToast("登录成功!");
                    this.globalData.token = respData.data;
                    this.saveLogin.saveLoginName = this.userName;
                    this.saveLogin.saveLoginPwd = this.passWord;
                    var str=JSON.stringify(this.saveLogin);
                    localStorage.setItem("loginInfo",str);
                    this.navCtrl.push(TabsPage);
                    this.globalData.showSignRed = false;
                }else{
                    this.nativeService.showToast(respData.message);
                }
                this.loginButton = false;
            });
        }
    }

    //是否弹出服务器更新

    isServletUpdate(){
        var isServerUpdate1 = {
            paraName:"isServerUpdate"

        }
        this.httpService.get('/common/findParameter',isServerUpdate1).subscribe((respData:any)=>{
            if(respData.code=='0000'){
                     if(respData.data =="1"){
                           var serverContent1 = {
                                paraName:"serverContent"

                             }
                             this.httpService.get('/common/findParameter',serverContent1).subscribe((respData:any)=>{
                                if(respData.code=='0000'){


                                        localStorage.removeItem("loginInfo");
                                        
                                         let alert = this.alertCtrl.create({
                                            title: respData.data,
                                            enableBackdropDismiss:false,
                                            message: '',
                                            buttons: [
                                              {
                                                text: '退出',
                                                role: '退出',
                                                handler: () => {
                                                  this.platform.exitApp();     
                                                }
                                              },
                                              {
                                                text: '确定',
                                                handler: () => {
                                                  this.platform.exitApp();     
                                                }
                                              }
                                            ]
                                          });
                                          alert.present();   




                                        
                                }else{
                                    
                                }
                            }); 
                     }   
                     



                     
            }else{
                 this.nativeService.showToast(respData.message); 
            }
        });



    }






    //验证
    validator(){
        if(this.userName == null || this.userName == ''){
            this.nativeService.showToast("手机/UID不能为空");
            return false;
        }
        if(this.passWord == null || this.passWord == ''){
            this.nativeService.showToast("登录密码不能为空");
            return false;
        }
        if(this.passWord.length < 6){
            this.nativeService.showToast("登录密码最少6位数");
            return false;
        }
        if(this.passWord.length > 32){
            this.nativeService.showToast("登录密码最多32位数");
            return false;
        }
        return true;
    }
}
