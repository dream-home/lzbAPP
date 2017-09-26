import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams, RequestOptionsArgs, RequestMethod} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Observable, TimeoutError} from "rxjs";
import { NavController,App } from 'ionic-angular';

import {NativeService} from "./NativeService";
import {APP_SERVE_URL, REQUEST_TIMEOUT} from "./Constants";
import {GlobalData} from "./GlobalData";
import {Utils} from "./Utils";


@Injectable()
export class HttpService {
    private navCtrl: NavController;
    constructor(public http: Http,
        public app: App,
        public globalData: GlobalData,
        public nativeService: NativeService
    ) {
        this.navCtrl = app.getActiveNav();
    }

    public request(url: string, options: RequestOptionsArgs): Observable<Response> {
        url = APP_SERVE_URL + url;
        this.optionsAddToken(options);
        return Observable.create(observer => {
           // this.nativeService.showLoading();
            console.log('%c 请求前 %c', 'color:blue', '', 'url', url, 'options', options);
            this.http.request(url, options).timeout(REQUEST_TIMEOUT).map(res => res.json()).toPromise().then(res=>{
                this.nativeService.hideLoading();
                console.log('%c 请求成功 %c', 'color:green', '', 'url', url, 'options', options, 'res', res);
                observer.next(res);
            }, err => {
                this.requestFailed(url, options, err);//处理请求失败
            });
        });
    }

    public request1(url: string, options: RequestOptionsArgs): Observable<Response> {
        url = APP_SERVE_URL + url;
        this.optionsAddToken(options);
        return Observable.create(observer => {
           this.nativeService.showLoading();
            console.log('%c 请求前 %c', 'color:blue', '', 'url', url, 'options', options);
            this.http.request(url, options).timeout(REQUEST_TIMEOUT).map(res => res.json()).toPromise().then(res=>{
                this.nativeService.hideLoading();
                console.log('%c 请求成功 %c', 'color:green', '', 'url', url, 'options', options, 'res', res);
                observer.next(res);
                this.nativeService.hideLoading();
            }, err => {
                this.requestFailed(url, options, err);//处理请求失败
               this.nativeService.alert('请求超时,请稍后再试!');
                this.nativeService.hideLoading();
            });
        });
    }



    /**
    *
    * httpGet请求
    * @param url 请求地址
    * @param paramMap 请求数据
    *
    */
    public get(url: string, paramMap: any = null): Observable<Response> {
        return this.request(url, new RequestOptions({
            method: RequestMethod.Get,
            search: HttpService.buildURLSearchParams(paramMap)
        }));
    }

    /**
    *
    * httpPost请求
    * @param url 请求地址
    * @param body 请求数据JSON格式
    *
    */
    public post(url: string, body: any = {}): Observable<Response> {
        return this.request1(url, new RequestOptions({
            method: RequestMethod.Post,
            body: body,
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8'
            })
        }));
    }

    /**
    * 将对象转为查询参数
    * @param paramMap
    * @returns {URLSearchParams}
    */
    private static buildURLSearchParams(paramMap): URLSearchParams {
        let params = new URLSearchParams();
        if (!paramMap) {
            return params;
        }
        for (let key in paramMap) {
            let val = paramMap[key];
            if (val instanceof Date) {
                val = Utils.dateFormat(val, 'yyyy-MM-dd hh:mm:ss')
            }
            params.set(key, val);
        }
        return params;
    }

    /**
     * 处理请求失败事件
     * @param url
     * @param options
     * @param err
     */
    private requestFailed(url: string, options: RequestOptionsArgs, err: Response): void {
        this.nativeService.hideLoading();
        console.log('%c 请求失败 %c', 'color:red', '', 'url', url, 'options', options, 'err', err);
        if (err instanceof TimeoutError) {
            this.nativeService.alert('请求超时,请稍后再试!');
            return;
        }
        if (!this.nativeService.isConnecting()) {
            this.nativeService.alert('请求失败，请连接网络');
            return;
        }
        let msg = '请求发生异常';
        let status = err.status;
        if (status === 0) {
            msg = '请求失败，请求响应出错';
        } else if (status === 404) {
            msg = '请求失败，未找到请求地址';
        } else if (status === 500) {
            msg = '请求失败，服务器出错，请稍后再试';
        } else if (status === 608) {
            msg = '用户登录失效，请重新登录';
            localStorage.removeItem("loginInfo");
            this.navCtrl.popToRoot();
        }
        this.nativeService.showToast(msg);
    }

    private optionsAddToken(options: RequestOptionsArgs): void {
        let token = this.globalData.token;
        if (options.headers) {
            options.headers.append('token', token);
        } else {
            options.headers = new Headers({
                'token': token
            });
        }
    }

}
