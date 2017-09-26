import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { SelectPayerPage } from '../selectPayer/selectPayer';
import { HttpService } from "../../providers/HttpService";
import { NativeService } from "../../providers/NativeService";
import { Utils } from "../../providers/Utils";
import { CallNumber } from '@ionic-native/call-number';
import { Clipboard } from '@ionic-native/clipboard';
import { AlertController } from 'ionic-angular';
import { RechargeRecordPage } from '../rechargeRecord/rechargeRecord';
@Component({
  selector: 'page-rechargeOrderDetail',
  templateUrl: 'rechargeOrderDetail.html'
})

export class RechargeOrderDetailPage{
   
    pet:any="out";
    orderId:any="";
    infos:any;
    constructor(
        public navCtrl: NavController,
         public httpService: HttpService,
        public nativeService:NativeService,
        public navParams:NavParams,
        public utils:Utils,
          private callNumber: CallNumber,
           private alertCtrl: AlertController,
           public clipboard:Clipboard
    ){
       
    }

    /*页面事件*/
    ionViewWillEnter(){
      this.orderId=this.navParams.get("id");
      this.getOrderinfos();

    }
    gotoRechargeRecordPage(){
      
        this.navCtrl.push(RechargeRecordPage);
    }

 	/*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }
    //选择打款人
   gotoSelectPayerPage(id,amount,bankName){
     
      this.navCtrl.push(SelectPayerPage,{"id":id,"amount":amount,"bankName":bankName});
   }

   //充值订单详情
   getOrderinfos(){
        var paramMap = {
                        id:this.orderId
                };
        this.httpService.get('/recharge/findOrderInfo',paramMap).subscribe((respData:any)=>{
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

    copy(){
       let str=this.infos.targetName+" "+this.infos.targetBankCard+" "+this.infos.targetDescription;
       this.clipboard.copy(""+str+"");
      
        this.clipboard.paste().then(
           (resolve: string) => {
             this.nativeService.showToast("收款人信息已经复制成功，快去粘贴吧。");
              //alert(resolve);
            },
            (reject: string) => {
             // alert('Error: ' + reject);
            }
          );
    }


    //确认打款
    confirmTransaction(thisid){

      var paramMap = {
                        id:thisid
                };
        this.httpService.post('/recharge/confirmTransaction',paramMap).subscribe((respData:any)=>{
                if(respData.code=='0000'){
                      this.nativeService.showImgLoading("确认打款成功","1");
                     this.getOrderinfos();
                }else{
                  this.nativeService.alert(respData.message);
                }
                
            });
    }


  alertconfirmTransaction(nickName,amount,thisid){    
      //阻止事件冒泡
        /*event.stopPropagation();*/
        let alert = this.alertCtrl.create({
        title: '您确定已向['+nickName+']的银行账户成功转账'+parseFloat(amount)+' RMB 吗？',
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
                  this.confirmTransaction(thisid);
            }
          }
        ]
      });
      alert.present();
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
                this.httpService.post('/recharge/deleteOrder',paramMap).subscribe((respData:any)=>{
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
}
 