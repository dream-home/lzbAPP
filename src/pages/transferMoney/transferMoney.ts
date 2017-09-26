import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import { HttpService } from "../../providers/HttpService";
import { NativeService } from "../../providers/NativeService";
import { GlobalData } from "../../providers/GlobalData";
import { TransferRecordPage } from '../transferRecord/transferRecord';
import { APP_PIC_URL} from "../../providers/Constants";
import { Utils} from "../../providers/Utils";


@Component({
  selector: 'page-transferMoney',
  templateUrl: 'transferMoney.html'
})
export class TransferMoneyPage{

    isShowNext:boolean = false;//是否显示下一步
    opposingAccount:string = "";//对方账户
    transferAmount:number;//转账金额
    payPwd:string;//支付密码
    transactionType:string;//转账类型 10：转账  20：扫码支付
    pageType:string;//判断从哪个页面过来的 0:首页点击转账  1:扫描二维码进来的
    transferId:string;//扫一扫传过来的转账id
    receiverInfo:any = [];//收款人信息
    loadingButton:boolean = false; //登录按钮是否禁用
    index:number=-1;
    show:boolean=true;
    pwdIndex:any=["","","","","",""];//6个密码数字
    num1_3:any=[1,2,3];
    num4_6:any=[4,5,6];
    num7_9:any=[7,8,9];
    nums:any=[];
    imgUrl:string=APP_PIC_URL;
    showPayPage:boolean = false;//显示支付框
    constructor(
        public navCtrl: NavController,
        public httpService: HttpService,
        public nativeService:NativeService,
        private navParams: NavParams,
        public globalData: GlobalData,
        public utils: Utils
    ){
        this.nums=[this.num1_3,this.num4_6,this.num7_9];
    }

    /*页面事件*/
    ionViewWillEnter(){
        this.loadingButton = false;
        this.pageType = this.navParams.get('pageType');
        this.transferId = this.navParams.get('transferId');
        if(this.pageType == '1'){
            this.isShowNext = true;
            this.httpService.get('/user/findUserInfoByUserId',{
                userId:this.transferId
            }).subscribe((respData:any)=>{
                if(respData.code=='0000'){
                    this.receiverInfo = respData.data;
                }else{
                    this.nativeService.alert(respData.message);
                }
            });
        }
    }

    /*返回上一页*/
    goToBackPage(){
        if(this.isShowNext && this.pageType == '0'){
            this.isShowNext = false;
        }else{
            this.navCtrl.pop();
        }
    }

    //动态切换输入密码界面
    closeorshow(t){
        if(t){
            if(this.transferAmount < 100 || this.transferAmount == null){
                this.nativeService.showToast("转账金额不能小于100");
            }else if(Number(this.utils.toDecimal(this.globalData.userInfo.balance)) < this.transferAmount){
                this.nativeService.showToast("余额不足，转账失败");
            }else if(!(/^[0-9]+(\.[0-9]{0,2})?$/).test(this.transferAmount+'')){
                this.nativeService.showToast("转账金额有误(小数点只保留两位)");
            }else{
                this.loadingButton = true;
                this.showPayPage = true;
                this.pwdIndex=["","","","","",""];//清空密码
                this.payPwd="";//清空密码
                this.index=-1;
            }
        }else{
            this.loadingButton = false;
            this.showPayPage = false;
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
                    if(this.index != -1){
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
                this.submitTransfer();
           }
        }
    }

    //跳转到下一步
    goNext(){
        if(this.validator()){
            this.httpService.get('/user/findUserInfoByMobile',{
                mobile:this.opposingAccount.trim()
            }).subscribe((respData:any)=>{
                if(respData.code=='0000'){
                    this.isShowNext = true;
                    this.receiverInfo = respData.data;
                }else{
                    this.nativeService.showToast(respData.message);
                }
            });
        }
    }

    //跳转到转账记录页面
    goTransferRecord(){
        this.navCtrl.push(TransferRecordPage);
    }

    //确认转账
    submitTransfer(){
        if(this.index < 5){
            this.nativeService.showToast("支付密码必须是6位数字");
        }else if(Number(this.utils.toDecimal(this.globalData.userInfo.balance)) < this.transferAmount){
            this.nativeService.showToast("余额不足，转账失败");
        }else if(this.pageType == '0'){
            this.transactionType = '10';
            this.httpService.post('/wallet/scan/payment',{
                amount:this.transferAmount,
                payPwd:this.payPwd,
                receivedId:this.opposingAccount,
                transactionType:this.transactionType
            }).subscribe((respData:any)=>{
                if(respData.code=='0000'){
                    this.closeorshow(false);
                    this.nativeService.showToast("转账成功");
                    this.navCtrl.pop();
                }else{
                    this.nativeService.showToast(respData.message);
                }
                this.loadingButton = false;
            });
        }else{
            this.transactionType = '20';
            this.httpService.post('/wallet/scan/payment',{
                amount:this.transferAmount,
                payPwd:this.payPwd,
                payeeId:this.transferId,
                transactionType:this.transactionType
            }).subscribe((respData:any)=>{
                if(respData.code=='0000'){
                    this.closeorshow(false);
                    this.nativeService.showToast("转账成功");
                    this.navCtrl.pop();
                }else{
                    this.nativeService.showToast(respData.message);
                }
                this.loadingButton = false;
            });
        }
    }

    validator(){
        if(this.opposingAccount == null || this.opposingAccount == ''){
            this.nativeService.showToast("对方账户不能为空");
            return false;
        }
        if(this.opposingAccount == this.globalData.userInfo.uid || this.opposingAccount == this.globalData.userInfo.mobile){
            this.nativeService.showToast("收款人不能是自己");
            return false;
        }
        return true;
    }
}
