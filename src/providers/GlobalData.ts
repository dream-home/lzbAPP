import {Injectable} from '@angular/core';

@Injectable()
export class GlobalData {

    constructor() {
    }

    private _userId: string;//用户id
    private _userName: string;//用户名
    private _token: string;//token
    private _showLoading: boolean = true;//请求是否显示loading,注意:设置为true,当请求执行后需要设置为false
    private _userInfo:any;//用户信息
    private _showUpdate:boolean = false;//是否显示更新页面
    private _registerTimeNum:number = 0;//注册短信验证码倒计时
    private _forgetPwdTimeNum:number = 0;//忘记密码短信验证码倒计时
    private _forgetPayPwdTimeNum:number = 0;//忘记支付密码短信验证码倒计时
    public _bank:any="";//当前选中的银行卡
    private _showSignRed:boolean = false;//是否显示红包
    private _Page2:any = null;  //tabs下导航
    private _Page3:any = null; //tabs下导航




    get Page2(): any {
        return this._Page2;
    }

    set Page2(value: any) {
        this._Page2 = value;
    }


    get Page3(): any {
        return this._Page3;
    }

    set Page3(value: any) {
        this._Page3 = value;
    }



    get bank(): any {
        return this._bank;
    }

    set bank(value: any) {
        this._bank = value;
    }

    get forgetPwdTimeNum(): number {
        return this._forgetPwdTimeNum;
    }

    set forgetPwdTimeNum(value: number) {
        this._forgetPwdTimeNum = value;
    }

    get forgetPayPwdTimeNum(): number {
        return this._forgetPayPwdTimeNum;
    }

    set forgetPayPwdTimeNum(value: number) {
        this._forgetPayPwdTimeNum = value;
    }

    get registerTimeNum(): number {
        return this._registerTimeNum;
    }

    set registerTimeNum(value: number) {
        this._registerTimeNum = value;
    }

    get showUpdate(): boolean {
        return this._showUpdate;
    }

    set showUpdate(value: boolean) {
        this._showUpdate = value;
    }

    get showSignRed(): boolean {
        return this._showSignRed;
    }

    set showSignRed(value: boolean) {
        this._showSignRed = value;
    }

    get userInfo(): any {
        return this._userInfo;
    }

    set userInfo(value: any) {
        this._userInfo = value;
    }

    get userId(): string {
        return this._userId;
    }

    set userId(value: string) {
        this._userId = value;
    }

    get userName(): string {
        return this._userName;
    }

    set userName(value: string) {
        this._userName = value;
    }

    get token(): string {
        return this._token;
    }

    set token(value: string) {
        this._token = value;
    }

    get showLoading(): boolean {
        return this._showLoading;
    }

    set showLoading(value: boolean) {
        this._showLoading = value;
    }
}
