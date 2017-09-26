import { Component } from '@angular/core';
import { NavController,ActionSheetController,NavParams,Platform} from 'ionic-angular';
import { NativeService } from "../../providers/NativeService";
import { BankPage } from '../bank/bank';
import { UpdateNickNamePage } from '../updateNickName/updateNickName';
import { LoginPwdSettingPage } from '../loginPwdSetting/loginPwdSetting';
import { PayPwdSettingPage } from '../payPwdSetting/payPwdSetting';
import { AboutPage } from '../about/about';
import { FeedBackPage } from '../feedBack/feedBack';
import { Camera} from '@ionic-native/camera';
import { LoginPage } from '../login/login';
import { AlertController } from 'ionic-angular';
import { HttpService } from "../../providers/HttpService";
import { APP_PIC_URL,VERSIONS} from "../../providers/Constants";
import {GlobalData} from "../../providers/GlobalData";

declare var $;
@Component({
  selector: 'page-set',
  templateUrl: 'set.html'
})
export class SetPage{

    userInfo:any;
    showImage:any;
    imageUrl:string = APP_PIC_URL;
    versions:string = VERSIONS;
    about:string = "";//关于速通宝
    versionUpdates:string = ""; //版本更新提醒
    showUpdate:boolean = false;//是否显示更新页面
    showUpdateVersion:boolean = false;//是否禁止显示
    IsshowUpdateVersion:boolean = false;//是否版本更新
    osType:number;//判断当前手机系统
    constructor(public navCtrl: NavController, public globalData: GlobalData, public nativeService:NativeService,private camera: Camera,public actionSheetCtrl: ActionSheetController,public httpService: HttpService, public navParams:NavParams,private alertCtrl: AlertController, public plt: Platform){

         this.userInfo = this.globalData.userInfo;

         if(this.userInfo.imgPath == null || this.userInfo.imgPath == ''){
                this.showImage = "assets/img/avatar.png";

         }else{
                this.showImage = this.imageUrl+this.userInfo.imgPath;
         }

         if (this.plt.is('ios')) {
                    // This will only print when on iOS
                    this.osType=1;
                }else{
                    this.osType=0;
         }

    }

    /*页面事件*/
    ionViewWillEnter(){
        this.loadSettings();
         this.httpService.get('/user/findUserInfo').subscribe((respData:any)=>{
            if(respData.code=='0000'){
                this.userInfo = respData.data;
                this.globalData.userInfo = respData.data;
            }else{
                this.nativeService.alert(respData.message);
            }
        });






    }


    /*获取系统参数*/
    loadSettings(){

        //获取当前系统
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

                            }else{
                                this.showUpdateVersion = false;

                            }
                        }else{
                            this.nativeService.alert(respData.message);
                        }
                    });
                    //获取ios版本号
                    var IOSver = {
                        paraName:"IOSversions"
                    }
                    this.httpService.get('/common/findParameter',IOSver).subscribe((respData:any)=>{
                        if(respData.code=='0000'){

                            if(VERSIONS == respData.data){
                                this.IsshowUpdateVersion = false;
                            }else{
                                this.IsshowUpdateVersion = true;
                                this.versions =   respData.data;
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


                            }else{
                                this.showUpdateVersion = false;
                            }
                        }else{
                            this.nativeService.alert(respData.message);
                        }
                    });
                    //获取android版本
                    var androidSver = {
                        paraName:"androidVersions"
                    }
                    this.httpService.get('/common/findParameter',androidSver).subscribe((respData:any)=>{
                        if(respData.code=='0000'){

                            if(VERSIONS == respData.data){
                                 this.IsshowUpdateVersion = false;
                            }else{
                                this.IsshowUpdateVersion = true;
                                this.versions =   respData.data;
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



       //加载关于速通宝
        var person1 = {
            paraName:"aboutPrep"
        }
        this.httpService.get('/common/findParameter',person1).subscribe((respData:any)=>{
            if(respData.code=='0000'){
                this.about = respData.data;
            }else{
                this.nativeService.alert(respData.message);
            }
        });









    }





 	/*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    /*退出登录*/
    Exit(){




        let alert = this.alertCtrl.create({
        title: '您确定退出当前账号？',
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
                     this.navCtrl.push(LoginPage);
                    //弹出窗带图片，图片默认出现1s,括号内输入你想要提示的文字，默认显示操作成功 ,1:"操作成功",0："操作失败"
                     this.nativeService.showImgLoading("已退出登录",1);
                      localStorage.removeItem("loginInfo");

                 
            }
          }
        ]
        });
        alert.present();










        
    }
    /*跳转到银行卡界面*/
    goBank(){

        this.navCtrl.push(BankPage);

    }
    /*跳转到修改昵称*/
    goUpdateNickName(){

        this.navCtrl.push(UpdateNickNamePage);

    }
    /*修改登录密码*/
    goLoginPwdSetting(){
        this.navCtrl.push(LoginPwdSettingPage);

    }

    /*修改支付密码*/
    gopayPwdSetting(){
        this.navCtrl.push(PayPwdSettingPage);
    }

    /*关于我们*/
    goAbout(){
        this.navCtrl.push(AboutPage,{"about":this.about});
    }

    /*意见反馈*/
    feedBack(){
        this.navCtrl.push(FeedBackPage);



    }



    /*上传头像*/
    uploadImg(){

             let actionSheet = this.actionSheetCtrl.create({
                    buttons: [
                    {
                        text: '手机拍照',
                        handler: () => {
                            this.takePicture(this.camera.PictureSourceType.CAMERA);
                        }
                    },{
                        text: '相册选择图片',
                        handler: () => {
                            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
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

    takePicture(sourceType){
                var options = {
                    quality: 70,
                    sourceType: sourceType,
                    destinationType: 0,
                    targetHeight:360,
                    targetWidth:360,
                    allowEdit: true,
                    saveToPhotoAlbum: false,
                    correctOrientation: true
                };


                this.camera.getPicture(options).then((imageData) => {
                        if(imageData.length>410000){
                            alert('选择图片太大');
                        }else{
                            let image = 'data:image/jpeg;base64,' + imageData;
                            var imglist=[];
                            imglist.push(image);

                            var imgData = {
                                    imgPath:image
                            };


                            this.httpService.post('/setting/user/upImg',imgData).subscribe((respData:any)=>{
                                if(respData.code=='0000'){
                                     this.nativeService.showImgLoading("修改成功",1);
                                     this.showImage= image;
                                }else{
                                    this.nativeService.showImgLoading(respData.message,0);
                                }

                            });


                        }


                }, (err) => {
                });
    }


     //取消更新
    cancellUpdate(){
        this.showUpdate = false;
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
            var android1 = {
                paraName:"AndroridDownload"
            }
            this.httpService.get('/common/findParameter',android1).subscribe((respData:any)=>{
                if(respData.code=='0000'){

                    window.location.href=respData.data;
                }else{
                    this.nativeService.alert(respData.message);
                }
            });



        }




        this.showUpdate = false;
        $(".tabbar").show();
    }


    updateApp(){
        if(this.showUpdateVersion && this.IsshowUpdateVersion){
                this.showUpdate = true;
                $(".tabbar").hide();
        }

    }





}
