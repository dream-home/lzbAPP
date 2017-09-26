import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpService } from "../../providers/HttpService";
import { NativeService } from "../../providers/NativeService";
import { LoginPage } from '../login/login';
import { GlobalData } from "../../providers/GlobalData";


@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage{

    invitationCode:string;//邀请码
    nickName:string;//昵称
    telPhone:string;//手机号码
    loginPwd:string;//登录密码
    payforPwd:string;//支付密码
    msgCode:string;//短信验证码
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
                    this.globalData.registerTimeNum = 60;
                    let regObj = this;
                    let intervalObj = setInterval(function () {
                        regObj.globalData.registerTimeNum--;
                        if(regObj.globalData.registerTimeNum==0){
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

    //提交注册信息
    submitRegistr(){
        if(this.validator()){
            this.loadingButton = true;
            var paramMap = {
                loginPwd:this.loginPwd,
                mobile:this.telPhone,
                nickName:this.nickName,
                parentId:this.invitationCode,
                payPwd:this.payforPwd,
                smsCode:this.msgCode
            };
            this.httpService.post('/user/register',paramMap).subscribe((respData:any)=>{
                if(respData.code=='0000'){
                    this.nativeService.showToast("注册成功!");
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
        if(this.invitationCode == null || this.invitationCode == ''){
            this.nativeService.showToast("邀请码不能为空");
            return false;
        }
        if(!/[^\s]+/.test(this.nickName)){
            this.nativeService.showToast("昵称不能全为空格");
            return false;
        }
        if(this.nickName == null || this.nickName.trim() == ''){
            this.nativeService.showToast("昵称不能为空");
            return false;
        }
        if((/[^\w\u4e00-\u9fa5]+/).test(this.nickName)){
            this.nativeService.showToast("昵称不能为特殊字符");
            return false;
        }
        if(this.telPhone == null || this.telPhone.trim() == ''){
            this.nativeService.showToast("手机号码不能为空");
            return false;
        }
        if(!(/^1[34578]\d{9}$/).test(this.telPhone)){
            this.nativeService.showToast("手机号码有误，请重填");
            return false;
        }
        if(!/[^\s]+/.test(this.loginPwd)){
            this.nativeService.showToast("登录密码不能全为空格");
            return false;
        }
        if(this.loginPwd == null || this.loginPwd.trim() == ''){
            this.nativeService.showToast("登录密码不能为空");
            return false;
        }
        if(this.loginPwd.length < 6){
            this.nativeService.showToast("登录密码最少6位数");
            return false;
        }
        if(this.loginPwd.length > 32){
            this.nativeService.showToast("登录密码最多32位数");
            return false;
        }
        if(!/[^\s]+/.test(this.payforPwd)){
            this.nativeService.showToast("支付密码不能全为空格");
            return false;
        }
        if(this.payforPwd == null || this.payforPwd.trim() == ''){
            this.nativeService.showToast("支付密码不能为空");
            return false;
        }
        if(!(/^[0-9]{6}$/.test(this.payforPwd))){
            this.nativeService.showToast("支付密码必须是6位数字");
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
        return true;
    }
}
