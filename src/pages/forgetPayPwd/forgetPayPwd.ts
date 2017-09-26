import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpService } from "../../providers/HttpService";
import { NativeService } from "../../providers/NativeService";
import { GlobalData } from "../../providers/GlobalData";


@Component({
  selector: 'page-forgetPayPwd',
  templateUrl: 'forgetPayPwd.html'
})
export class ForgetPayPwdPage{

    telPhone:string;//手机/UID
    msgCode:string;//短信验证码
    newPayPassword:string;//新密码
    timeNum:number = 0;//倒计时数字
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
            this.nativeService.showToast("手机号码不能为空");
        }else if(!(/^1[34578]\d{9}$/).test(this.telPhone)){
            this.nativeService.showToast("手机号码有误，请重填");
        }else{
            this.msgButton = true;
            var paramMap = {
                mobile:this.telPhone
            };
            this.httpService.get('/common/sendSms',paramMap).subscribe((respData:any)=>{
                if(respData.code=='0000'){

                   this.globalData.forgetPayPwdTimeNum = 60;
                    let regObj = this;
                    let intervalObj = setInterval(function () {
                        regObj.globalData.forgetPayPwdTimeNum--;
                        if(regObj.globalData.forgetPayPwdTimeNum==0){
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

    //找回支付密码提交
    submitFindPwd(){
        if(this.validator()){
            this.loadingButton = true;
            var paramMap = {
                payPwd:this.newPayPassword,
                smsCode:this.msgCode,
                mobile:this.telPhone
            };
            this.httpService.post('/setting/user/backPayPwd',paramMap).subscribe((respData:any)=>{
                if(respData.code=='0000'){
                    this.nativeService.showToast("新支付密码设置成功");
                     this.navCtrl.pop();
                    this.navCtrl.pop();
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
        if(this.newPayPassword == null || this.newPayPassword == ''){
            this.nativeService.showToast("新支付密码不能为空");
            return false;
        }
        /*if(this.newPayPassword.trim().length  == 0 ){
            this.nativeService.showToast("新支付密码不能为空字符串");
            return false;
        }*/
        if(!(/^[0-9]{6}$/.test(this.newPayPassword))){
            this.nativeService.showToast("新支付密码只能为6位数字");
            return false;
        }

        return true;
    }
}
