import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpService } from "../../providers/HttpService";
import { NativeService } from "../../providers/NativeService";
import { PAGE_SIZE,APP_PIC_URL} from "../../providers/Constants";
import { Utils} from "../../providers/Utils";


@Component({
  selector: 'page-shareRecord',
  templateUrl: 'shareRecord.html'
})
export class ShareRecordPage{

    pageSize:number = PAGE_SIZE;//分页大小
    pageNumber:number;//分页页数
    imgUrl:string=APP_PIC_URL;
    shareRecordData:any;//分享好友记录
    showScroll:boolean=true;
    constructor(
        public navCtrl: NavController,
        public httpService: HttpService,
        public nativeService:NativeService,
        public utils: Utils
    ){

    }

    /*页面事件*/
    ionViewWillEnter(){
        this.pageNumber = 1;
        this.loadShareRecord();
    }

 	  /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    //加载分享记录
    loadShareRecord(){
        this.httpService.get('/share/findAll',{
            pageNumber:this.pageNumber,
            pageSize:this.pageSize
        }).subscribe((respData:any)=>{
            if(respData.code=='0000'){
                this.shareRecordData = respData.data;
            }else{
                this.nativeService.alert(respData.message);
            }
        });
    }

    //下拉刷新
    doRefresh(refresher){
        this.pageNumber = 1;
        this.showScroll = true;
        this.httpService.get('/share/findAll',{
            pageNumber:this.pageNumber,
            pageSize:this.pageSize
        }).subscribe((respData:any)=>{
            refresher.complete();
            if(respData.code=='0000'){
                this.shareRecordData = respData.data;
            }else{
                this.nativeService.alert(respData.message);
            }
        },err=>{
            refresher.complete();
        });
    }

    //上拉加载更多
    doInfinite(infiniteScroll) {
        this.pageNumber++;
        setTimeout(() => {
            this.httpService.get('/share/findAll',{
                pageNumber:this.pageNumber,
                pageSize:this.pageSize
            }).subscribe((respData:any)=>{
                infiniteScroll.complete();
                if(respData.code=='0000'){
                    let tdata = respData.data;
                    this.showScroll =(eval(tdata).length==this.pageSize);
                    for(var o in tdata){
                        this.shareRecordData.push(tdata[o]);
                    }
                }else{
                    this.nativeService.alert(respData.message);
                }
            });
        }, 500);
    }
}
