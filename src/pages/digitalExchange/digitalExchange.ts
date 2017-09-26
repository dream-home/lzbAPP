import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
import { DigitalAssetRecordPage } from '../digitalAssetRecord/digitalAssetRecord';
import { HttpService } from "../../providers/HttpService";
import { ForgetPayPwdPage } from '../forgetPayPwd/forgetPayPwd';
@Component({
  selector: 'page-digitalExchange',
  templateUrl: 'digitalExchange.html'
})
export class DigitalExchangePage{
    userinfo:any=null;

    showClass:boolean=true;//切换，同时用来判断类型
    index:number=-1;//当前是第几个密码
    show:boolean=true;
    pwdIndex:any=["","","","","",""];//6个密码数字
    num1_3:any=[1,2,3];
    num4_6:any=[4,5,6];
    num7_9:any=[7,8,9];
    nums:any=[];
    bottoem_set:number=-100;
    int:any;//设置定时器

    score1:any=null;//量子币
    score2:any=null;//量子基因
    score3:any=0;

    payPwd:any="";//支付密码
    amount:number=0;//交易额度
    exRate:number=-1;//汇率
    exchangeType:any="20";//10 - 兑换量子币 20 - 兑换量子基因
   
    getNum:number=0;//兑换以后得到的数额

    inputNum:boolean=false;//用来控制点击确定以后，input框禁用
    constructor(
        public navCtrl: NavController,
        public httpService: HttpService,
        public nativeService:NativeService
    ){
         this.nums=[this.num1_3,this.num4_6,this.num7_9];
    }

    /*页面事件*/
    ionViewWillEnter(){
      //this.getPrice();
      this.getUserInfo();
     


    }
    //忘记支付密码
    gotoForgetPayPwdPage(){
      this.navCtrl.push(ForgetPayPwdPage);
    }
 	/*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }
    //跳转到记录
    gotoDigitalAssetRecordPage(){
        this.navCtrl.push(DigitalAssetRecordPage);
    }
    //切换选中兑换
    exType(t){ 
     if(t==1){
        this.showClass=true;
     }
      if(t==2){
        this.showClass=false;
     }
        
     
    }
    //动态切换输入密码界面
    closeorshow(t){
              if(t){
                   this.inputNum=true; 
                  if(this.validator()){
                        this.getPrice();
                        if(this.exRate!=-1){
                          this.getNumber();
                        }else{
                          setTimeout(() => {
                                this.getNumber();
                            },200);
                        }
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

      getNumber(){
        if(this.exRate!=-1){
              
             //计算得到的数额
              if(this.exchangeType=="20"){//兑换成量子基因
              
                  this.getNum=this.getFloat(this.score1*this.exRate,4);

              }else{//10 - 兑换量子币
                   this.getNum=this.getFloat(this.score2/this.exRate,4);
                 

              }


              this.pwdIndex=["","","","","",""];//清空密码
              this.payPwd="";//清空密码
              this.index=-1;

              
                      this.int=setInterval(() => {
                             this.bottoem_set+=4;
                            if(this.bottoem_set==0){
                                 this.int=window.clearInterval(this.int);
                              }
                      },10);
                  
                  
        }else{
           this.inputNum=false; 
           this.nativeService.showToast("正在加载中请稍后再试");
        }
      }
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

        return s;    
      //return number; 
    };
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
                this.exchange();
           }
        }
       
    }

     //验证
    validator(){
        if(this.showClass){//兑换成量子基因
            this.exchangeType="20";
            this.amount=this.score1;
            if(this.score1!=null&&this.score1!=""){
                  this.score1=parseFloat(this.score1);//转成数字类型
                if(this.score1>=1){

                  if(this.score1<=this.userinfo.virtualCoin){

                    if(!(/^([0-9]*)+(.[0-9]{1,2})?$/).test(this.score1.toString())){
                            this.nativeService.showToast("量子币数额只能输入数字，如有小数最多保留2位！");
                            return false;
                        }
                  }else{
                     this.nativeService.showToast("量子币数量不足");
                            return false;
                  }
                }else{
                  this.nativeService.showToast("量子币兑换数额不能小于1！");
                   return false;
                }
            }else{
                 this.nativeService.showToast("请输入量子币数额！");
                 return false;
            }
 
        }else{//兑换成量子币
            this.exchangeType="10";
             this.amount=this.score2;
            if(this.score2!=null&&this.score2!=""){
               this.score2=parseFloat(this.score2);//转成数字类型
                if(this.score2>=1){
                  if(this.score2<=this.userinfo.balance){

                     if(!(/^([0-9]*)+(.[0-9]{1,2})?$/).test(this.score2.toString())){
                              this.nativeService.showToast("量子基因数额只能输入数字，如有小数最多保留2位！");
                              return false;
                          } 
                  }else{
                      this.nativeService.showToast("量子基因数量不足");
                              return false;
                  }
                }else{
                   this.nativeService.showToast("量子基因兑换数额不能小于1！");
                    return false;
                }
            }else{
                this.nativeService.showToast("请输入量子基因数额！");
                 return false;
            }
        }
        
        return true;
    }

    //用户兑换
    exchange(){
          /*  this.nativeService.showLoading();*/
            this.getPrice();
             var paramMap = {
                payPwd:this.payPwd,//支付密码
                exchangeNumber:this.amount,//交易额度
                exRate:this.exRate,//汇率
                exchangeType:this.exchangeType//10 - 兑换量子币 20 - 兑换量子基因
            };
            this.httpService.post('/coin/exchange',paramMap).subscribe((respData:any)=>{

             
                if(respData.code=='0000'){
                      this.nativeService.showImgLoading("兑换成功","1");
                      this.score2=null;
                      this.score1=null;
                      this.getUserInfo();

                    
                }
                if(respData.code=='9999'){
                    this.nativeService.alert(respData.message);
                }

               
            });

        
    }

    //获取当前的汇率
    getPrice(){
        this.httpService.get('/coin/loadExrate').subscribe((respData:any)=>{
              if(respData.code=='0000'){
                  this.exRate=respData.data;//
                }else{
                   this.nativeService.showToast("正在加载中请稍后再试");
                }
               
        });
        
    }

    //获取用户信息
     getUserInfo(){
        this.httpService.get('/user/findUserInfo').subscribe((respData:any)=>{
              if(respData.code=='0000'){
                  this.userinfo=respData.data;//
                  this.userinfo.virtualCoin=this.nativeService.getFloat2(this.userinfo.virtualCoin,4);
                  this.userinfo.balance=this.nativeService.getFloat2(this.userinfo.balance,2);
                }
               
        });
        
    }
}
