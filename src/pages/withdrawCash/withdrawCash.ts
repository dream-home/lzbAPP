import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SelectPayerPage } from '../selectPayer/selectPayer';
import { TXunfinishOrderPage } from '../TXunfinishOrder/TXunfinishOrder';
import { WithdrawCashCenterPage } from '../withdrawCashCenter/withdrawCashCenter';
import { WithdrawCashRecordPage } from '../withdrawCashRecord/withdrawCashRecord';
import { AddBankPage } from '../addbank/addbank';
import { SelectBankPage } from '../selectBank/selectBank';
import { WithdrawCashOrderDetailPage } from '../withdrawCashOrderDetail/withdrawCashOrderDetail';
import { HttpService } from "../../providers/HttpService";
import { NativeService } from "../../providers/NativeService";
import { WithdrawCashcheckPage } from '../withdrawCashcheck/withdrawCashcheck';
import { TXfinishOrderPage } from '../TXfinishOrder/TXfinishOrder';
import {GlobalData} from "../../providers/GlobalData";

@Component({
  selector: 'page-withdrawCash',
  templateUrl: 'withdrawCash.html'
})
export class WithdrawCashPage{

    menuflag:boolean=false;//右边三个点的菜单内容默认隐藏
    
    pre_styleNo:number=-1;//需要去掉选中样式的下标
    describe:any="";//描述
    banks:any;
    amount:any=0;
    orderCount:any;//获取订单数量
    loadingButton:boolean = false; //登录按钮是否禁用
    constructor(
       public httpService: HttpService,
        public nativeService:NativeService,
        public globalData: GlobalData,
        public navCtrl: NavController
    ){
      
    }

    /*页面事件*/
    ionViewWillEnter(){
       if(this.globalData._bank==""){
          this.getBankdefualt();
      }else{
        this.banks=this.globalData._bank;
        /*console.log("选中的银行卡");
        console.log(this.banks);*/
      }
      this.loadOrderCount();
      this.loadPenalty();
      this.loadingButton = false;
    }


    /**
    * 违约检查
    */
   
    loadPenalty(){
        this.httpService.get('/withdrawCash/penalty').subscribe((respData:any)=>{
            
        });


    }

    /**
    * 加载用户订单数量
    */
    loadOrderCount(){
        this.httpService.get('/withdrawCash/findWithdrawCashCount').subscribe((respData:any)=>{
            if(respData.code=='0000'){
                this.orderCount = respData.data;
            }else{
                this.nativeService.alert(respData.message);
            }
        });
    }



    /*返回上一页*/
    goToBackPage(){
      this.globalData._bank="";
        this.navCtrl.pop();
    }
    //显示菜单右上角
    showMune(src){
        this.menuflag=src;
    }
    //动态切换金额按钮的样式
   select(index,value){
      
         this.pre_styleNo=index;
         this.amount=value;
      
   }
   //确认SHOU款
   gotoWithdrawCashcheckPage(src){
     this.showMune(src);
      this.navCtrl.push(WithdrawCashcheckPage);
   }


   //已确认收款
   gotoTXfinishOrderPage(src){
     this.showMune(src);
      this.navCtrl.push(TXfinishOrderPage);
   }
   //跳转到选择收款人
   gotoSelectPayerPage(){
    this.navCtrl.push(SelectPayerPage);
   }

   //跳转到未完成订单
   gotoTXunfinishOrderPage(src){
    this.showMune(src);
    this.navCtrl.push(TXunfinishOrderPage);
   }

    //提现中心
   gotoWithdrawCashCenterPage(src){
     this.showMune(src);
    this.navCtrl.push(WithdrawCashCenterPage);
   }

     //提现记录
  gotoWithdrawCashRecordPage(src){
     this.showMune(src);
    this.navCtrl.push(WithdrawCashRecordPage);
   }
   //添加银行卡
   gotoAddbankPage(){
      this.navCtrl.push(AddBankPage);
   }
   //我的银行卡
   gotoBankPage(){
    this.navCtrl.push(SelectBankPage,{"options":"withdrawCashPage"});
   }

   //创建订单
   /*gotoRechargeOrderDetailPage(src){
     this.showMune(src);
      this.navCtrl.push(RechargeOrderDetailPage);
   }
*/
   //获取用户默认银行卡
   getBankdefualt(){
        this.httpService.get('/setting/bank/defualt').subscribe((respData:any)=>{
            if(respData.code=='0000'){
              this.banks=respData.data;
            }
            
        });
   }

  //验证
   validator(){
        if(this.amount==0){
           this.nativeService.showToast("请选择充值数额！");
            return false;
        }
        if(this.banks==null){
           this.nativeService.showToast("请添加银行卡！");
            return false;
        }
        return true;
   }

   //创建提现订单
   addOrder(){
      if(this.validator()){
               this.loadingButton = true;
              var paramMap = {
                        amount:this.amount,//交易金额
                        bankCardId:this.banks.id,//银行卡编号
                        description:this.describe
                };
            this.httpService.post('/withdrawCash/createOrder',paramMap).subscribe((respData:any)=>{
                    if(respData.code=='0000'){
                     // alert(respData.data);
                        this.navCtrl.push(WithdrawCashOrderDetailPage,{id:respData.data});
                    }else{
                        this.nativeService.alert(respData.message);
                    }


                    this.loadingButton = false;
                    
                });

               
           }
        
      }
 
}