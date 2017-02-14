import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import{ Router } from '@angular/router';
import { UrlSet } from '../components/index';

@Injectable()
export class UrlService {
    urlApi = '/api/v1/urls';

    constructor(private http: Http, private router: Router) {
        this.handleError = this.handleError.bind(this);
     }

    getShortUrl(longUrl: string): Observable<UrlSet> {
        const headers = new Headers({'Content-type': 'application/json'});
        const options = new RequestOptions({headers: headers});

        return this.http.post(this.urlApi, {longUrl: longUrl}, options)
                    .map(this.extractUrlSet)
                    .catch(this.handleError);
    }
    getLongUrl(shortUrl: string): Observable<UrlSet> {
        const getUrl = `${this.urlApi}/${shortUrl}`;
        return this.http.get(getUrl)
                        .map(this.extractUrlSet)
                        .catch(this.handleError);
    }

    getStatsInfo(shortUrl: string, info: string): Observable<any> {
        const getUrl = `${this.urlApi}/${shortUrl}/${info}`;
        const headers = new Headers({'Content-type': 'application/json'});
        const options = new RequestOptions({headers: headers});
        return this.http.get(getUrl)
                        .map(this.extractData)
                        .catch(this.handleError);
    }

    extractUrlSet(res: Response) {
        const body = res.json();
        return body as UrlSet || {};
    }

    extractData(res: Response) {
        const body = res.json();
        return body || {};
    }

    handleError(error: Response | any) {
        // TODO: WEI WEI: arr error handling
        this.router.navigateByUrl('client/404');
        //console.log('hherror');
        return Observable.throw(error);
    }
}
