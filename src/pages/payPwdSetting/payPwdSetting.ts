import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ForgetPayPwdPage } from '../forgetPayPwd/forgetPayPwd';
import { HttpService } from "../../providers/HttpService";
import { NativeService } from "../../providers/NativeService";


@Component({
    selector: 'page-payPwdSetting',
    templateUrl: 'payPwdSetting.html'
})
export class PayPwdSettingPage {
    oldPayPwd:string = "";
    newPayPwd:string = "";
    loadingButton:boolean = false; //登录按钮是否禁用
    constructor(public navCtrl: NavController,public httpService: HttpService,public nativeService:NativeService,) {

    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    /*修改支付密码*/
    submitData(){
            if(this.validator()){
                var pwd = {
                    newPwd:this.newPayPwd,
                    oldPwd:this.oldPayPwd
                }   
                 this.loadingButton = true;
                this.httpService.post('/setting/user/modfiyPayPwd',pwd).subscribe((respData:any)=>{
                    if(respData.code=='0000'){
                         this.nativeService.showImgLoading("修改成功",1);
                         this.navCtrl.pop();
                         
                    }else{
                        this.nativeService.showImgLoading(respData.message,0);
                    }
                     this.loadingButton = false;
                });    
            }else{
                    //this.nativeService.showImgLoading("支付密码只能为6位数字",2); 
            }
            



    }


    /*忘记支付密码*/
    gotoFindPayPwdPage(){
        this.navCtrl.push(ForgetPayPwdPage);
        
    }

    validator(){
        
        
       

        if(this.oldPayPwd.trim().length ==0){
            this.nativeService.showImgLoading("旧支付密码不能为空",2); 
            return false;

        }


        if(this.newPayPwd.trim().length ==0){
            this.nativeService.showImgLoading("新支付密码不能为空",2); 
            return false;

        }    


        if(!(/^\d{6}$/.test(this.newPayPwd.trim()))){
            this.nativeService.showImgLoading("新支付密码只能为6位数字",2); 
            return false;
        }

        
        
        if(!(/^\d{6}$/.test(this.oldPayPwd.trim()))){
            this.nativeService.showImgLoading("旧支付密码只能为6位数字",2); 
            return false;
        }
       
        
        return true;
    }

}
