import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
import { DigitalAssetRecordPage } from '../digitalAssetRecord/digitalAssetRecord';
import { HttpService } from "../../providers/HttpService";
import { ForgetPayPwdPage } from '../forgetPayPwd/forgetPayPwd';
import {GlobalData} from "../../providers/GlobalData";
@Component({
  selector: 'page-digitalRollOut',
  templateUrl: 'digitalRollOut.html'
})

export class DigitalRollOutPage{
   
    index:number=-1;
    show:boolean=true;
    pwdIndex:any=["","","","","",""];//6个密码数字
    num1_3:any=[1,2,3];
    num4_6:any=[4,5,6];
    num7_9:any=[7,8,9];
    nums:any=[];
   
    bottoem_set:number=-100;
    int:any;//设置定时器
    payPwd:any="";//支付密码

    balance:any=null;//量子币转出数量
    accountName:any="";//转出地址
    mybalance:number=0;//我的量子币

  
    inputNum:boolean=false;//用来控制点击确定以后，input框禁用
    constructor(
        public navCtrl: NavController,
        public httpService: HttpService,
         public globalData: GlobalData,
        public nativeService:NativeService
    ){
        this.nums=[this.num1_3,this.num4_6,this.num7_9];
    }

    /*页面事件*/
    ionViewWillEnter(){
      this.getInfo();
      //this.closeorshow(false);
     
    }
     //跳转到记录
    gotoDigitalAssetRecordPage(){
        this.navCtrl.push(DigitalAssetRecordPage);
    }
    //动态切换输入密码界面
    closeorshow(t){
        
            if(t){
                this.inputNum=true;
                if(this.validator()){
                 
                    this.pwdIndex=["","","","","",""];//清空密码
                    this.payPwd="";//清空密码
                    this.index=-1;
                        this.inputNum=true;
                        this.int=setInterval(() => {
                               this.bottoem_set+=4;
                              if(this.bottoem_set==0){
                                   this.int=window.clearInterval(this.int);
                                  
                                }
                        },10);
                         
                    
                }else{
                   this.inputNum=false;
                }
            }else{
              this.inputNum=false;
                  this.int=setInterval(() => {
                          this.bottoem_set-=4;
                           if(this.bottoem_set==-100){
                             this.int=window.clearInterval(this.int);
                             
                          }
                  },10);

                
            }
          
        
       
       
    }

    //忘记支付密码
    gotoForgetPayPwdPage(){
      this.navCtrl.push(ForgetPayPwdPage);
    }
 	/*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }
    //控制键盘显示隐藏
    closeNumset(str){
        if(this.show!=str){
            this.show=str;
        }
    }

      //输入密码
    writePwd(num){
        if(this.index<5){
            if(this.index>-2&&this.index<5){
                if(num>-1){
                    this.index++;
                    this.pwdIndex[this.index]=num;
                }
                if(num==-1){
                    
                    if(this.index>-1){
                      this.pwdIndex[this.index]="";
                      this.index--;
                    }
                    
                }

           }
           if(this.index==5){
                var leng=this.pwdIndex.length;
                for (var i=0;i<leng;i++) {
                  this.payPwd+=this.pwdIndex[i].toString();//数字转换成字符
                }

                 //密码输入完成，可以进行检验
                console.log("密码"+this.payPwd);
                 this.closeorshow(false);
                this.transferAccounts();
           }
        }
       
    }

  

    //验证
    validator(){
        if(this.balance==null||this.balance==""){
            this.nativeService.showToast("请输入量子币数量！");
            return false;
        }else{
            
            if(parseFloat(this.balance)>=0.1){

               
                if(parseFloat(this.balance)<=this.mybalance){
                    if(parseFloat(this.balance)<=3000000){
                        
                        if(!(/^([0-9]*)+(.[0-9]{1,2})?$/).test(this.balance.toString())){
                                this.nativeService.showToast("只能输入数字，如有小数最多保留2位！");
                                return false;
                            }
                    }else{
                         this.nativeService.showToast("一次转出量子币数量最多为3000000！");
                            return false;
                    }

                }else{
                   
                     this.nativeService.showToast("量子币数量不足");
                            return false;
                }
                
                
            }else{
                this.nativeService.showToast("量子币数量不能小于0.1！");
                return false;
            }
            
        }
        if(this.accountName == null || this.accountName == ''){
                this.nativeService.showToast("转出地址不能为空！");
                return false;
            }else{
              if(this.accountName.toUpperCase() == "NULL"){
                   this.nativeService.showToast("输入钱包地址无效！");
                    return false;
              }
              if(this.accountName==this.globalData.userInfo.uid||this.accountName==this.globalData.userInfo.mobile||this.accountName==this.globalData.userInfo.coinAddr){
                  this.nativeService.showToast("不能转出到自己的账号！");
                  return false;
              }
            }
        return true;
    }

    //用户转账
    transferAccounts(){
      /* this.nativeService.showLoading();*/
             var paramMap = {
                balance:this.balance,
                payPwd:this.payPwd,
                accountName:this.accountName
            };
            this.httpService.post('/coin/transferAccounts',paramMap).subscribe((respData:any)=>{

                if(respData.code=='0000'){
                  this.nativeService.showImgLoading("转出成功","1");
                   setTimeout(() => {
                             this.goToBackPage();
                        },1000);
                }
                if(respData.code=='9999'){
                    this.nativeService.alert(respData.message);
                }
            });
        
    }

     /**
    * 获取用户数字资产信息
    */
    getInfo(){
        this.httpService.get('/coin/loadUserInfo').subscribe((respData:any)=>{
            if(respData.code=='0000'){
               // this.slidDatas = respData.data;
               this.mybalance=respData.data.balance;
               this.mybalance=this.getFloat(this.mybalance,4);

            }
           
        });
    }
     //保留n为小数
   /* getFloat(number, n) { 
      n = n ? parseInt(n) : 0; 
      if (n <= 0) return Math.round(number); 
      number = Math.round(number * Math.pow(10, n)) / Math.pow(10, n); 
      return number; 
    };*/

     //保留n为小数
    getFloat(number, n) { 
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
            if(small>4){
                s=next[0]+"."+next[1].substring(0,4);
            } 
            if(small<4){
                let m=4-small;

              for (var i=0;i<m;i++) {
                   s += '0';    
                }
            } 
        }
       s=parseFloat(s);
        return s;    
      //return number; 
    };
}
