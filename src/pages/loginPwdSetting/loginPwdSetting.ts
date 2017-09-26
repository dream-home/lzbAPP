import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ForgetPwdPage } from '../forgetPwd/forgetPwd';
import { HttpService } from "../../providers/HttpService";
import { NativeService } from "../../providers/NativeService";
import { LoginPage } from '../login/login';

@Component({
    selector: 'page-loginPwdSetting',
    templateUrl: 'loginPwdSetting.html'
})
export class LoginPwdSettingPage {
    oldPwd:string='';
    newPwd:string;
   loadingButton:boolean = false; //登录按钮是否禁用
    constructor(public navCtrl: NavController,public httpService: HttpService,public nativeService:NativeService,) {

    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }


    /*修改密码*/
    submitData(){


            if(this.validator()){
                var pwd = {
                    newLoginPwd:this.newPwd,
                    oldLoginPwd:this.oldPwd
                }   
                 this.loadingButton = true;
                this.httpService.post('/setting/user/modfiyLoginPwd',pwd).subscribe((respData:any)=>{
                    if(respData.code=='0000'){
                         this.nativeService.showImgLoading("修改成功",1);
                         this.navCtrl.push(LoginPage);
                         this.nativeService.showImgLoading("已退出登录",1);
                          localStorage.removeItem("loginInfo");
                         
                    }else{
                        this.nativeService.showImgLoading(respData.message,0);
                    }
                     this.loadingButton = false;
                });    

            }
            


    }


    validator(){
        if(this.oldPwd.trim().length ==0){
             this.nativeService.showImgLoading("旧密码不能输入空字符",0);     
               return false;              
        }


        if(!(/^[0-9a-zA-Z]{6,32}$/.test(this.oldPwd.trim()) || /^[\x00-\xff]{6,32}$/.test(this.oldPwd.trim()))){
            this.nativeService.showImgLoading("旧密码必须为6-32位字符",0);
            return false;
        }
        if(this.newPwd.trim().length ==0){
             this.nativeService.showImgLoading("新密码不能输入空字符",0);     
               return false;              
        }
    



        if(!(/^[0-9a-zA-Z]{6,32}$/.test(this.newPwd.trim()) || /^[\x00-\xff]{6,32}$/.test(this.newPwd.trim())) ){
            this.nativeService.showImgLoading("新密码必须为6-32位字符",0);     
            return false;
        }
        
       
        return true;
    }


    //跳转到忘记密码页面
    gotoForgetPwd(){
        this.navCtrl.push(ForgetPwdPage);
    }





}
