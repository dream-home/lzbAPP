import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpService } from "../../providers/HttpService";
import { NativeService } from "../../providers/NativeService";
import { GlobalData } from "../../providers/GlobalData";
import { LoginPage } from '../login/login';


@Component({
  selector: 'page-forgetPwd',
  templateUrl: 'forgetPwd.html'
})
export class ForgetPwdPage{

    telPhone:string;//手机/UID
    msgCode:string;//短信验证码
    newPassword:string;//新密码
    loadingButton:boolean = false; //登录按钮是否禁用
    msgButton:boolean = false;
    constructor(
        public navCtrl: NavController,
        public httpService: HttpService,
        public nativeService:NativeService,
        public globalData: GlobalData
    ){

    }

    /*页面事件*/
    ionViewWillEnter(){
            this.loadingButton = false;
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    //发送短信验证码
    sendMsgCode(){
      if(this.telPhone == null || this.telPhone == ''){
          this.nativeService.showToast("手机/UID不能为空");
      }else{
            this.msgButton = true;
            var paramMap = {
                mobile:this.telPhone
            };
            this.httpService.get('/common/sendSmsByUid',paramMap).subscribe((respData:any)=>{
                if(respData.code=='0000'){
                    this.globalData.forgetPwdTimeNum = 60;
                    let regObj = this;
                    let intervalObj = setInterval(function () {
                        regObj.globalData.forgetPwdTimeNum--;
                        if(regObj.globalData.forgetPwdTimeNum==0){
                            clearInterval(intervalObj);
                        }
                    }, 1000);
                    this.nativeService.showToast("短信验证码已发送，请注意查收");
                }else{
                    this.nativeService.showToast(respData.message);
                }
                this.msgButton = false;
            });
        }
    }

    //找回密码提交
    submitFindPwd(){
        if(this.validator()){
            this.loadingButton = true;
            var paramMap = {
                mobile:this.telPhone,
                loginPwd:this.newPassword,
                smsCode:this.msgCode
            };
            this.httpService.post('/user/forget',paramMap).subscribe((respData:any)=>{
                if(respData.code=='0000'){
                    localStorage.removeItem("loginInfo");
                    this.nativeService.showImgLoading("新密码设置成功",1);
                    this.navCtrl.push(LoginPage);



                }else{
                    this.nativeService.showToast(respData.message);
                }

                 this.loadingButton = false;
            });
        }
    }

    //验证
    validator(){
        if(this.telPhone == null || this.telPhone == ''){
            this.nativeService.showToast("手机/UID不能为空");
            return false;
        }
        if(this.msgCode == null || this.msgCode == ''){
            this.nativeService.showToast("短信验证码不能为空");
            return false;
        }
        if(!(/^[0-9]{6}$/.test(this.msgCode))){
            this.nativeService.showToast("短信验证码必须是6位数字");
            return false;
        }
        if(this.newPassword == null || this.newPassword == ''){
            this.nativeService.showToast("新密码不能为空");
            console.log(this.newPassword);
            return false;
        }
        if(this.newPassword.trim().length ==0 ){
            this.nativeService.showToast("新密码不能为空字符串");

            return false;
        }

        if(!(/^[0-9a-zA-Z]{6,32}$/.test(this.newPassword.trim()) || /^[\x00-\xff]{6,32}$/.test(this.newPassword.trim())) ){
            this.nativeService.showImgLoading("新密码必须为6-32位字符",0);
            return false;
        }



        /*if(this.newPassword.trim().length < 6){
            this.nativeService.showToast("新密码最少6位数");
            return false;
        }
        if(this.newPassword.trim().length > 32){
            this.nativeService.showToast("新密码最多32位数");
            return false;
        }*/
        return true;
    }
}
