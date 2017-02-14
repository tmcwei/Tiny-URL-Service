import { Component, ViewChildren, QueryList } from '@angular/core';
import {ActivatedRoute } from '@angular/router';
import { UrlService } from '../services/url.service';

import { BaseChartDirective } from 'ng2-charts/ng2-charts';

@Component({
  selector: 'app-url',
  templateUrl: './url.component.html'
})
export class UrlComponent {
    longUrl: string;
    shortUrl: string;
    shortUrlToShow: string;
    totalClicks: number;
    time: string;
    public lineChartData:Array<any> = [
        {data: [], label: 'Number Of Clicks'}
    ];
    lineChartLabels = [];
    lineChartType = 'line';
    weiwei = 'pie';
    @ViewChildren (BaseChartDirective) charts: QueryList<BaseChartDirective>;


    constructor(private route: ActivatedRoute, private urlService: UrlService) {
        console.log('url component constructor')
    }

    ngOnInit() {
        console.log('ng on init')
        this.route.params.subscribe(
            params => {
                this.shortUrl = params['shortUrl'];
                this.shortUrlToShow = "http://localhost/" + this.shortUrl;
                this.urlService.getLongUrl(this.shortUrl).subscribe(
                    result => {
                        this.longUrl = result.longUrl;
                    },
                    error => {
                        console.log(error);
                    }
                );
                // get totalClicks;
                this.urlService.getStatsInfo(this.shortUrl, 'totalClicks').subscribe(
                        result => this.totalClicks = result,
                        // TODO: Payson when totalClicks is 0, there is a bug
                        error => console.log(error)
                );
                // render 4 charts
                this.renderChart(this.shortUrl, 'referer', 'pie');
                this.renderChart(this.shortUrl, 'countryOrRegion', 'doughnut');
                this.renderChart(this.shortUrl, 'platform', 'polarArea');
                this.renderChart(this.shortUrl, 'browser', 'radar');
                this.getTime('hour');
            },
            error => {
                console.log(error);
            }
        );
    }
    
    renderChart(shortUrl: string, info: string, chartType: string) {
        this[chartType + 'ChartLabels'] = [];
        this[chartType + 'ChartData'] = [];
        this[chartType + 'ChartType'] = chartType;

        const that = this;
        this.urlService.getStatsInfo(shortUrl, info).subscribe (
            results => {
                results.forEach( function(item) {
                    that[chartType + 'ChartLabels'].push(item._id);
                    that[chartType + 'ChartData'].push(item.count);
                });
                console.log(that[chartType + 'ChartLabels'])
                console.log(that[chartType + 'ChartData'])
                that.updateChart();
            },
            error => console.log(error)
        );
    }
    updateChart(): void {
        this.charts.forEach(chart => {
            chart.ngOnChanges({});
        });
    }


    getTime(time: string): void {
        this.time = time;
        this.lineChartLabels = [];
        this.lineChartData[0].data = [];
        const that = this;
        this.urlService.getStatsInfo(this.shortUrl, time).subscribe(
            results => {
                results.forEach( function(item) {
                    let label = '';
                    if (time === 'hour') {
                        if (item._id.minutes < 10) {
                            item._id.minutes = '0' + item._id.minutes; 
                        }
                        label = item._id.hour + ':' + item._id.minutes;

                    }
                    if (time === 'day') {
                        label = item._id.hour + ':00';
                    }
                    if (time === 'month') {
                        label = item._id.month + '/' + item._id.day;                     
                    }
                    that.lineChartLabels.push(label);
                    that.lineChartData[0].data.push(item.count);
                });
                console.log(that.lineChartData[0]);
                that.updateChart();
            },
            error => console.log(error)
        );
    }

}  
  