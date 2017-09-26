import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';

@Component({
    selector: 'page-about',
    templateUrl: 'about.html'
})
export class AboutPage {

    data:any;
    message:string = "";
    constructor(public navCtrl: NavController,public navParams: NavParams ) {
        this.loadData();
        this.message = this.navParams.get('about');
        
        
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    loadData(){

    }

}
