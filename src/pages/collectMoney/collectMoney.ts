import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpService } from "../../providers/HttpService";
import { NativeService } from "../../providers/NativeService";
import { CollectionRecordPage } from '../collectionRecord/collectionRecord';
import { PhotoLibrary } from '@ionic-native/photo-library';

@Component({
  selector: 'page-collectMoney',
  templateUrl: 'collectMoney.html'
})
export class CollectMoneyPage{

    collectMoneyCode:any=[];//收款信息
    constructor(
        public navCtrl: NavController,
        public nativeService:NativeService,
        public httpService: HttpService,
        private photoLibrary: PhotoLibrary
    ){
        this.loadQRCode();
    }

    /*页面事件*/
    ionViewWillEnter(){

    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    //跳转到收款记录页面
    goCollectionRecord(){
        this.navCtrl.push(CollectionRecordPage);
    }

    // 加载二维码
    loadQRCode(){
        this.nativeService.showLoading();
        this.httpService.get('/wallet/scan/qrcode').subscribe((respData:any)=>{
            if(respData.code=='0000'){
                this.nativeService.hideLoading();
                this.collectMoneyCode = respData.data;
            }else{
                this.nativeService.alert(respData.message);
            }
        });
    }

    //保存收款二维码
    saveQRCode(){
        let url = this.collectMoneyCode;
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
}
