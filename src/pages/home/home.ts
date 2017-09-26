import { Component } from '@angular/core';
import { NavController,Platform } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { HttpService } from "../../providers/HttpService";
import { NativeService } from "../../providers/NativeService";
import { GlobalData } from "../../providers/GlobalData";
import { APP_PIC_URL ,DEFAULT_AVATAR } from "../../providers/Constants";
import { Utils } from "../../providers/Utils";
import { TransferMoneyPage } from '../transferMoney/transferMoney';
import { CollectMoneyPage } from '../collectMoney/collectMoney';
import { ShareFriendPage } from '../shareFriend/shareFriend';
import { RechargeMoneyPage } from '../rechargeMoney/rechargeMoney';
import { WithdrawCashPage } from '../withdrawCash/withdrawCash';
import { DigitalAssetPage } from '../digitalAsset/digitalAsset';
import { BalanceRecordPage } from '../balanceRecord/balanceRecord';
import { ScoreRecordPage } from '../scoreRecord/scoreRecord';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    imgUrl:string=APP_PIC_URL;
    default_avatar:string=DEFAULT_AVATAR;//用户默认头像
    userInfo:any=[];//用户信息
    orderCount:any = [];//订单数量
    orderType:string;//订单类型
    showRechargeOrder:boolean = false;//显示充值订单数量
    showExchangeOrdert:boolean = false;//显示提现订单数量
    constructor(public navCtrl: NavController,
        public httpService: HttpService,
        public globalData: GlobalData,
        public nativeService:NativeService,
        public utils:Utils,
        private barcodeScanner: BarcodeScanner,
        public plt: Platform
    ) {

    }

    /*页面事件*/
    ionViewWillEnter(){
        this.loadGetUserInfo();
        this.loadOrderCount();
    }

    /**
    * 加载用户订单数量
    */
    loadOrderCount(){
        this.httpService.get('/order/orderCount',{
            orderType:''//10：充值 20：提现 30：数字资产 （不传默认查全部订单类型）
        }).subscribe((respData:any)=>{
            if(respData.code=='0000'){
                this.orderCount = respData.data;
                if(this.orderCount.rechargeOrderCount > 0){
                    this.showRechargeOrder = true;
                }else{
                    this.showRechargeOrder = false;
                }
                if(this.orderCount.exchangeOrderCount > 0){
                    this.showExchangeOrdert = true;
                }else{
                    this.showExchangeOrdert = false;
                }
            }else{
                this.nativeService.alert(respData.message);
            }
        });
    }

    //获取用户信息
    loadGetUserInfo(){
        this.httpService.get('/user/findUserInfo').subscribe((respData:any)=>{
            if(respData.code=='0000'){
                this.userInfo = respData.data;
                this.userInfo.balance=this.nativeService.getFloat2(this.userInfo.balance,2);
                this.userInfo.score=this.nativeService.getFloat2(this.userInfo.score,2);
                this.globalData.userName = respData.data.name;
                this.globalData.userInfo = respData.data;
            }else{
                this.nativeService.alert(respData.message);
            }
        });
    }

    //扫一扫
    gotoScanPage(){
        let transferMoney;
        let transferId;
        this.barcodeScanner.scan({
            resultDisplayDuration: 0 // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
        }).then((barcodeData) => {
            // Success! Barcode data is here
            console.log("barcodeData ----->> "+JSON.stringify(barcodeData))
            // alert(JSON.stringify(barcodeData));
            if(barcodeData.cancelled == false){
                let tems = barcodeData.text.split('&');
                for(var o in tems){
                    console.log(tems[o]);
                    let temo = tems[o].split('=');
                    console.log(temo[0]+" temo[1] "+temo[1]);
                    if(temo[0]=='amount'){
                        transferMoney = temo[1];
                    }
                    if(temo[0]=='payeeId'){
                        transferId = temo[1];
                    }
                }
                if(transferMoney == undefined || transferId == undefined){
                    this.nativeService.showToast("扫码失败,请重新扫码");
                }else{
                    this.navCtrl.push(TransferMoneyPage,{transferMoney:transferMoney,transferId:transferId,pageType:1});
                }
            }else{

            }
        }, (err) => {
            // An error occurred
            this.nativeService.showToast(err);
        });
    }

    /**
    * 跳转到转账页面
    */
    gotoTransferMoneyPage(){
        this.navCtrl.push(TransferMoneyPage,{pageType:0});
    }
    /**
    * 跳转到收款
    */
    gotoCollectMoneyPage(){
        this.navCtrl.push(CollectMoneyPage);
    }
     /**
    * 跳转到分享
    */
    gotoShareFriendPage(){
        this.navCtrl.push(ShareFriendPage);
    }

     /**
    * 跳转到充值
    */
    gotoRechargeMoneyPage(){
        this.navCtrl.push(RechargeMoneyPage);
    }
    /**
    * 跳转提现
    */
    gotoWithdrawCashPage(){
        this.navCtrl.push(WithdrawCashPage);
    }
     /**
    * 跳转数字资产
    */
    gotoDigitalAssetPage(){
        this.navCtrl.push(DigitalAssetPage);
    }

    /**
    * 跳转余额记录
    */
    goBalanceRecord(){
        this.navCtrl.push(BalanceRecordPage);
    }

    /**
    * 跳转余额记录
    */
    goScoreRecord(){
        this.navCtrl.push(ScoreRecordPage);
    }
}
