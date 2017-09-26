import { Component } from '@angular/core';
import { NavController,ActionSheetController } from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
import { Camera} from '@ionic-native/camera';
import { HttpService } from "../../providers/HttpService";


@Component({
    selector: 'page-feedBack',
    templateUrl: 'feedBack.html'
})
export class FeedBackPage {
    

    feedBackImgs:any = [];//问题截图
    deleteImgs:any = [];//要删除的图片
    isShowAdd:boolean = true;//显示添加图片按钮
    feedBackDetail:string = '';//问题描述
    feedBackDetailLength:number = 0;//问题描述字符长度
    submitDisabled:boolean = true;//提交按钮是否能提交(true为不能提交,false为能提交)
     
    constructor(public navCtrl: NavController,public nativeService:NativeService, private httpService:HttpService,private camera: Camera,public actionSheetCtrl: ActionSheetController,
    ) {

    }

    /*页面事件*/
    ionViewWillEnter(){
         
    }



    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    //删除图片
    removeImg(index){
        //添加要删除的图片
        this.deleteImgs.push(this.feedBackImgs[index].split("/")[3]);//截取获取图片名
        this.feedBackImgs.splice(index,1);
        this.isShowAdd = true;
    }

    //监听问题描述输入的长度
    checkLength(){
        this.feedBackDetailLength=this.feedBackDetail.length;
        // /<!/[^\s]+/.test(this.feedBackDetail)判断是否输入的全为空格，true为不全是空格，false为全是空格
        if(this.feedBackDetailLength < 5 || !/[^\s]+/.test(this.feedBackDetail)){
            this.submitDisabled = true;
        }else{
            this.submitDisabled = false;
        }
    }  





     //添加图片
    addImages(index){
        let actionSheet = this.actionSheetCtrl.create({
            buttons: [
            {
                text: '手机拍照',
                handler: () => {
                    this.takePicture(this.camera.PictureSourceType.CAMERA,index);
                }
            },{
                text: '相册选择图片',
                handler: () => {
                    this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY,index);
                }
            },{
                text: '取消',
                role: 'cancel',
                handler: () => {

                }
            }]
        });
        actionSheet.present();
    }


    takePicture(sourceType,index){
       var options = {
           quality: 85,
           sourceType: sourceType,
           destinationType: 0,
           targetHeight:720,
           targetWidth:720,
           allowEdit: true,
           saveToPhotoAlbum: false,
           correctOrientation: true
       };
       this.camera.getPicture(options).then((imageData) => {
           if(imageData.length>410000){
               alert('选择图片太大');
           }else{
               var imgstrbase64='data:image/jpeg;base64,' + imageData;
              this.feedBackImgs.push(imgstrbase64);
                if(this.feedBackImgs.length == 3){
                                   this.isShowAdd = false;
               }
               




           }
       }, (err) => {
       });
   }


   //提交反馈
   submitFeedBack(){
         this.submitDisabled = true;
        var feedBack = {
          content:this.feedBackDetail,
          imgs: this.feedBackImgs
        }

        
        this.httpService.post('/setting/suggest/add',feedBack).subscribe((respData:any)=>{
            if(respData.code=='0000'){
                 this.nativeService.showImgLoading("提交成功",1);
                 this.navCtrl.pop();
                 
            }else{
                this.nativeService.showImgLoading(respData.message,0);
            }
            this.submitDisabled = false;
        });   
      
   } 






}
