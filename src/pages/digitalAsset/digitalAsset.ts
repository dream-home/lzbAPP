import { Component } from '@angular/core';
import { NavController,Platform } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
import { HttpService } from "../../providers/HttpService";
import { VERSIONS} from "../../providers/Constants";
import { GlobalData } from "../../providers/GlobalData";
import { DigitalRollOutPage } from '../digitalRollOut/digitalRollOut';
import { DigitalExchangePage } from '../digitalExchange/digitalExchange';
import { DigitalAssetRecordPage } from '../digitalAssetRecord/digitalAssetRecord';
import { SignRecordPage } from '../signRecord/signRecord';
import { Clipboard } from '@ionic-native/clipboard';
import { APP_PIC_URL} from "../../providers/Constants";


declare var $;
/*declare var document:any;*/
@Component({
  selector: 'page-digitalAsset',
  templateUrl: 'digitalAsset.html'
})
export class DigitalAssetPage{
    balance:any=0;//

    coinAddress:any="";//钱包地址
    price:any=null;//当前汇率
    showUpdate:boolean = false;//是否显示更新页面
    versionUpdates:string = ""; //版本更新提醒
    updateVersion:boolean = false; //判断当前版本是否更新;
    osType:number;//判断当前手机系统
    showSignRed:boolean = false;//是否显示签到红包
    redAmount:number;//红包释放金额
    versions:string = VERSIONS;
    showUpdateVersion:boolean = false;//是否禁止显示
    userInfo:any=null;
    imageUrl:string = APP_PIC_URL;
    showImage:any;

    constructor(
        public navCtrl: NavController,
        public httpService: HttpService,
        public nativeService:NativeService,
        public clipboard:Clipboard,
        public globalData: GlobalData,
        public plt: Platform
    ){

            this.loadVersions();

        if (this.plt.is('ios')) {
            // This will only print when on iOS
            this.osType=1;
        }else{
            this.osType=0;
        }
    }

    /*页面事件*/
    ionViewWillEnter(){
        this.globalData.Page2 = null;
        this.globalData.Page3 = null;
        this.getInfo();
        this.getPrice();
        this.getuserInfo();
    }

    //获取用户信息
    getuserInfo(){
      this.httpService.get('/user/findUserInfo').subscribe((respData:any)=>{
            if(respData.code=='0000'){
                this.userInfo = respData.data;
                 if(this.userInfo.imgPath == null || this.userInfo.imgPath == ''){
                        this.showImage = "assets/img/avatar.png";

                 }else{
                        this.showImage = this.imageUrl+this.userInfo.imgPath;
                 }

            }else{
                this.nativeService.alert(respData.message);
            }
        });
    }

 	/*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }
     //保留n为小数（四舍五入）
   /* getFloat(number, n) {
       n = n ? parseInt(n) : 0;
      if (n <= 0) return Math.round(number);
       number = Math.round(number * Math.pow(10, n)) / Math.pow(10, n);
      let s = number.toString();
        let rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + n) {
            s += '0';
        }
        return s;
      //return number;
    };*/

     //保留n为小数(没有四舍五入)
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

        return s;
      //return number;
    };

    //复制钱包地址
    copyUrl(){
        //var Url2=document.getElementById("coinAddress");
        //Url2.select(); // 选择对象
       // document.execCommand("Copy"); // 执行浏览器复制命令
       // this.nativeService.showToast("钱包地址已经复制成功，快去粘贴吧。");
       // console.log(Url2);
       let str=this.coinAddress;
       this.clipboard.copy(""+str+"");

        this.clipboard.paste().then(
           (resolve: string) => {
             this.nativeService.showToast("钱包地址已经复制成功，快去粘贴吧。");
              //alert(resolve);
            },
            (reject: string) => {
             // alert('Error: ' + reject);
            }
          );
    }
    //跳转到兑换
    gotoDigitalExchangePage(){
        this.navCtrl.push(DigitalExchangePage);
    }
    //跳转到转出
    gotoDigitalRollOutPage(){
        this.navCtrl.push(DigitalRollOutPage);
    }

    //跳转到记录
    gotoDigitalAssetRecordPage(){
        this.navCtrl.push(DigitalAssetRecordPage);
    }
    gotoSignRecordPage(){
      this.navCtrl.push(SignRecordPage);
    }
     /**
    }
    * 获取用户数字资产信息
    */
    getInfo(){
        this.httpService.get('/coin/loadUserInfo').subscribe((respData:any)=>{
            if(respData.code=='0000'){
               // this.slidDatas = respData.data;
               this.balance=respData.data.balance;
                this.balance=this.getFloat(this.balance,4);
                this.coinAddress=respData.data.coinAddress;//钱包地址
                if(!this.globalData.showUpdate){
                    this.loadGetUserInfo();
                }
            }
            if(respData.code=='5555'){
                this.nativeService.alert(respData.message);
            }
        });
    }
    //获取当前的汇率
    getPrice(){
        this.httpService.get('/coin/loadExrate').subscribe((respData:any)=>{
                this.price=respData.data;//
                this.price=this.getFloat(this.price,4);
        });

    }

    //取消更新
    cancellUpdate(){
        this.globalData.showUpdate = false;
        this.showUpdate = this.globalData.showUpdate;
        this.loadGetUserInfo();
        $(".tabbar").show();
    }

    //去更新
    goUpdate(){
        if(this.osType==1){
            var ios = {
                paraName:"IOSDownload"
            }
            this.httpService.get('/common/findParameter',ios).subscribe((respData:any)=>{
                if(respData.code=='0000'){
                    window.open(respData.data);
                }else{
                    this.nativeService.alert(respData.message);
                }
            });
        }else{
            var android = {
                paraName:"AndroridDownload"
            }
            this.httpService.get('/common/findParameter',android).subscribe((respData:any)=>{
                if(respData.code=='0000'){
                    window.location.href=respData.data;
                }else{
                    this.nativeService.alert(respData.message);
                }
            });
        }
        this.globalData.showUpdate = false;
        this.showUpdate = this.globalData.showUpdate;
        this.loadSignRed();
        $(".tabbar").show();
    }

    //获取用户信息
    loadGetUserInfo(){
        this.httpService.get('/user/findUserInfo').subscribe((respData:any)=>{
            if(respData.code=='0000'){
                this.globalData.userInfo = respData.data;
                if(this.globalData.userInfo.score > 0 && !this.globalData.showUpdate && !this.globalData.showSignRed){
                    this.loadSignRed();
                }else{
                    this.globalData.Page2 = "1";
                    console.log(this.globalData.Page2);
                    this.globalData.Page3 = "1"; 

                }
            }else{
                this.nativeService.alert(respData.message);
                

            }
        });
    }

    /**
    * 签到红包
    */
    loadSignRed(){
        this.nativeService.showLoading();
        this.httpService.get('/user/openRedPacket').subscribe((respData:any)=>{
            if(respData.code=='0000'){
                this.nativeService.hideLoading();
                this.showSignRed = true;
                this.globalData.showSignRed = true;
                this.redAmount = this.nativeService.getFloat2(respData.data,2);
                $(".tabbar").hide();
            }else if(respData.code=='9999'){
                this.showSignRed = false;
                this.globalData.showSignRed = false;
                $(".tabbar").show();
            }else if(respData.code=='8888'){
                this.globalData.showSignRed = true;
            }else{
                this.nativeService.alert(respData.message);
            }


            this.globalData.Page2 = "1";
            console.log(this.globalData.Page2);

            this.globalData.Page3 = "1";
        });
    }

    //关闭红包
    closeRed(){
        this.showSignRed = false;
        $(".tabbar").show();
        this.getInfo();
    }

    /**
     * 加载当前版本号
     */
    loadVersions(){

        if (this.plt.is('ios')) {
                    this.osType=1;
                    //ios是否弹框更新
                    var iosPo = {
                        paraName:"isIOSPopup"
                    }
                    this.httpService.get('/common/findParameter',iosPo).subscribe((respData:any)=>{
                        if(respData.code=='0000'){
                            if("1" == respData.data){

                               this.showUpdateVersion = true;
                               //获取ios版本号
                               var IOSver = {
                                   paraName:"IOSversions"
                               }
                               this.httpService.get('/common/findParameter',IOSver).subscribe((respData:any)=>{
                                   if(respData.code=='0000'){

                                       if(VERSIONS == respData.data){
                                          this.showUpdate = false;
                                          this.globalData.showUpdate = false;
                                       }else{
                                          this.showUpdate = true;
                                          this.globalData.showUpdate = true;
                                           this.versions =   respData.data;
                                           $(".tabbar").hide();
                                       }
                                   }else{
                                       this.nativeService.alert(respData.message);
                                   }
                               });
                            }else{
                                this.showUpdateVersion = false;
                                this.globalData.showUpdate = false;
                            }
                        }else{
                            this.nativeService.alert(respData.message);
                        }
                    });




                    //加载版本更新提醒
                    var IOSUpdates = {
                        paraName:"IOSversionUpdates"
                    }
                    this.httpService.get('/common/findParameter',IOSUpdates).subscribe((respData:any)=>{
                        if(respData.code=='0000'){
                            this.versionUpdates = respData.data;
                        }else{
                            this.nativeService.alert(respData.message);
                        }
                    });




          }else{
                    this.osType=0;
                   //android是否弹框更新
                    var androidPo = {
                        paraName:"isAndroidPopup"
                    }
                    this.httpService.get('/common/findParameter',androidPo).subscribe((respData:any)=>{
                        if(respData.code=='0000'){
                            if("1" == respData.data){
                                this.showUpdateVersion = true;
                                //获取android版本
                                var androidSver = {
                                    paraName:"androidVersions"
                                }
                                this.httpService.get('/common/findParameter',androidSver).subscribe((respData:any)=>{
                                    if(respData.code=='0000'){

                                        if(VERSIONS == respData.data){
                                           this.showUpdate = false;
                                           this.globalData.showUpdate = false;
                                        }else{

                                            this.showUpdate = true;
                                            this.globalData.showUpdate = true;
                                            this.versions =   respData.data;
                                            $(".tabbar").hide();
                                        }
                                    }else{
                                        this.nativeService.alert(respData.message);
                                    }
                                });

                            }else{
                                this.showUpdateVersion = false;
                                this.globalData.showUpdate = false;

                            }
                        }else{
                            this.nativeService.alert(respData.message);
                        }
                    });



                    //加载版本更新提醒
                    var androidUpdates = {
                        paraName:"androidVersionUpdates"
                    }
                    this.httpService.get('/common/findParameter',androidUpdates).subscribe((respData:any)=>{
                        if(respData.code=='0000'){
                            this.versionUpdates = respData.data;
                        }else{
                            this.nativeService.alert(respData.message);
                        }
                    });

          }



    }

}
