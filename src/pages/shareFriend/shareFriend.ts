import { Component } from '@angular/core';
import { NavController,Platform } from 'ionic-angular';
import { HttpService } from "../../providers/HttpService";
import { NativeService } from "../../providers/NativeService";
import { ShareRecordPage } from '../shareRecord/shareRecord';
import { Clipboard } from '@ionic-native/clipboard';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { GlobalData } from "../../providers/GlobalData";

@Component({
  selector: 'page-shareFriend',
  templateUrl: 'shareFriend.html'
})
export class ShareFriendPage{

    qrCode:string;//分享二维码
    osType:number;//判断当前手机系统
    downLoadAddr:string;//APP下载地址
    shareDownload:string;//分享下载地址
    constructor(
        public navCtrl: NavController,
        public httpService: HttpService,
        public nativeService:NativeService,
        private clipboard:Clipboard,
        public plt: Platform,
        private photoLibrary: PhotoLibrary,
        public globalData: GlobalData
    ){
        if (this.plt.is('ios')) {
            this.osType=1;//ios手机系统
        }else{
            this.osType=0;//android手机系统
        }
        this.loadShareCode();
    }

    /*页面事件*/
    ionViewWillEnter(){
        // this.loadAddress();
    }

 	  /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    saveCode(){
        // let url = this.qrCode;
        // let fileUrl;
        // if(this.osType == 1){
        //     fileUrl = this.file.documentsDirectory;
        //     alert(fileUrl);
        // }else{
        //     fileUrl = this.file.externalRootDirectory+"DCIM/";
        // }
        // this.transfer.create().download(url,fileUrl + 'qrCode.jpg',true).then((entry) => {
        //     console.log('download complete: ' + entry.toURL());
        //     this.nativeService.showToast("保存二维码成功");
        //     this.nativeService.alert("entry---"+JSON.stringify(entry));
        //     this.nativeService.alert("entry.toURL()---"+entry.toURL());
        // }, (error) => {
        //     console.log('error: ' + error);
        //     this.nativeService.alert("error---"+JSON.stringify(error));
        // });

        let url = this.qrCode;
        this.nativeService.showLoading();
        this.photoLibrary.requestAuthorization().then(() => {
            this.photoLibrary.saveImage(url,"lzbAPP").then(() => {
                this.photoLibrary.getLibrary().subscribe({
                    error: err => {
                        this.nativeService.hideLoading();
                        this.nativeService.showToast('保存二维码失败');
                    },
                    complete: () => {
                        this.nativeService.hideLoading();
                        this.nativeService.showToast("保存二维码成功");
                    }
                });
            });
        }).catch(err => {
            this.nativeService.hideLoading();
            this.nativeService.alert("还未开启访问相册权限");
        });
    }

    //加载分享二维码
    loadShareCode(){
        this.nativeService.showLoading();
        this.httpService.get('/share/qrcode').subscribe((respData:any)=>{
            if(respData.code=='0000'){
                this.nativeService.hideLoading();
                this.qrCode = respData.data.rstr;
                this.shareDownload = respData.data.shareDownload;
            }else{
                this.nativeService.alert(respData.message);
            }
        });
    }

    //跳转分享记录
    goShareRecord(){
        this.navCtrl.push(ShareRecordPage);
    }

    //获取下载地址
    loadAddress(){
        if(this.osType==1){
            this.httpService.get('/common/findParameter',{paraName:"IOSDownload"}).subscribe((respData:any)=>{
                if(respData.code=='0000'){
                    this.downLoadAddr = respData.data;
                }else{
                    this.nativeService.alert(respData.message);
                }
            });
        }else{
            this.httpService.get('/common/findParameter',{paraName:"AndroridDownload"}).subscribe((respData:any)=>{
                if(respData.code=='0000'){
                    this.downLoadAddr = respData.data;
                }else{
                    this.nativeService.alert(respData.message);
                }
            });
        }

    }

    // 复制下载地址
    copyAddress(){
        this.clipboard.copy(this.shareDownload+'?parentUid='+this.globalData.userInfo.uid);
        this.clipboard.paste().then(
            (resolve: string) => {
                this.nativeService.showToast("量子钱包下载地址复制成功，快去粘贴下载吧");
            },
            (reject: string) => {
                // alert('Error: ' + reject);
            }
        );
    }
}
