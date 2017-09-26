import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { WithdrawCashselectPayerPage } from '../withdrawCashselectPayer/withdrawCashselectPayer';
import { HttpService } from "../../providers/HttpService";
import { NativeService } from "../../providers/NativeService";
import { Utils } from "../../providers/Utils";
import { CallNumber } from '@ionic-native/call-number';
/*import { ForgetPayPwdPage } from '../forgetPayPwd/forgetPayPwd';*/
import { WithdrawCashRecordPage } from '../withdrawCashRecord/withdrawCashRecord';
import { AlertController } from 'ionic-angular';
@Component({
  selector: 'page-withdrawCashOrderDetail',
  templateUrl: 'withdrawCashOrderDetail.html'
})

export class WithdrawCashOrderDetailPage{
   
    /*index:number=-1;
    show:boolean=true;
    pwdIndex:any=["","","","","",""];//6个密码数字
    num1_3:any=[1,2,3];
    num4_6:any=[4,5,6];
    num7_9:any=[7,8,9];
    nums:any=[];
   
    bottoem_set:number=-100;
    int:any;//设置定时器
    payPwd:any="";//支付密码
*/
    
    orderId:any="";
    infos:any;
    constructor(
        public navCtrl: NavController,
         public httpService: HttpService,
        public nativeService:NativeService,
        public navParams:NavParams,
        public utils:Utils,
        private alertCtrl: AlertController,
        private callNumber: CallNumber
    ){
       //this.nums=[this.num1_3,this.num4_6,this.num7_9];
    }

    /*页面事件*/
    ionViewWillEnter(){
      this.orderId=this.navParams.get("id");
      this.getOrderinfos();

    }
   

 	/*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }
    //选择打款人
   gotoSelectPayerPage(id,amount,bankName){ 
  
      this.navCtrl.push(WithdrawCashselectPayerPage,{"id":id,"amount":amount,"bankName":bankName});
   }
   gotoWithdrawCashRecordPage(){
      this.navCtrl.push(WithdrawCashRecordPage);
   }
   //提现订单详情
   getOrderinfos(){
        var paramMap = {
                        id:this.orderId
                };
        this.httpService.get('/withdrawCash/findOrderInfo',paramMap).subscribe((respData:any)=>{
                if(respData.code=='0000'){
                    this.infos=respData.data;
                }else{
                  this.nativeService.alert(respData.message);
                }
                
            });
   }

   call(num){
        this.callNumber.callNumber(num, true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));
   }

  //确认shou款
  confirm(event,id){  
      //阻止事件冒泡
      event.stopPropagation();
      let alert = this.alertCtrl.create({
      title: '您要确认收款？一经操作无法更改，请谨慎处理',
      message: '',
      buttons: [
        {
          text: '取消',
          role: '取消',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: '确定',
          handler: () => {
           this.confirmTransaction(id);
          }
        }
      ]
    });
    alert.present();



  }
    confirmTransaction(thisid){

      var paramMap = {
                        id:thisid
                };
        this.httpService.post('/withdrawCash/confirmTransaction',paramMap).subscribe((respData:any)=>{
                if(respData.code=='0000'){
                   this.nativeService.showImgLoading("确认收款成功","1");
                     this.getOrderinfos();
                }else{
                  this.nativeService.alert(respData.message);
                }
                
            });
    }

    
//取消订单
  del(thisid){
     let alert = this.alertCtrl.create({
        title: '您确定要删除该订单吗？',
        message: '',
        buttons: [
          {
            text: '取消',
            role: '取消',
            handler: () => {
              //console.log('Cancel clicked');
            }
          },
          {
            text: '确定',
            handler: () => {
                 var paramMap = {
                        id:thisid
                };
                this.httpService.post('/withdrawCash/deleteOrder',paramMap).subscribe((respData:any)=>{
                        if(respData.code=='0000'){
                            this.nativeService.showImgLoading("订单已删除","1");
                             setTimeout(() => {
                                     this.goToBackPage();
                                },1000);
                        }else{
                          this.nativeService.alert(respData.message);
                        }
                        
                    });
                    }
          }
        ]
      });
      alert.present();
    
  }
 /*  //动态切换输入密码界面
    closeorshow(t){

        if(t){
            
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
            this.int=setInterval(() => {
                    this.bottoem_set-=4;
                     if(this.bottoem_set==-100){
                       this.int=window.clearInterval(this.int);
                    }
            },10);
        }
       
       
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
                    this.pwdIndex[this.index]="";
                    this.index--;
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
                this.confirmTransaction(this.infos.id);

           }
        }
       
    }

    //忘记支付密码
    gotoForgetPayPwdPage(){
      this.navCtrl.push(ForgetPayPwdPage);
    }
*/
  
}
 