import { Component, OnInit } from '@angular/core';
// import {CarService} from '../demo/service/carservice';
// import {EventService} from '../demo/service/eventservice';
// import {Car} from '../demo/domain/car';
import { SelectItem, DataList } from 'primeng/primeng';
import { MenuItem } from 'primeng/primeng';
import { DashboardService } from '../services/dashboard.service';
import { LocalStorageService } from '../shared/local-storage.service';
import { AppConstant } from '../app.constant';
import * as _ from "lodash";
import { DateformatPipe } from '../pipes/dateformat.pipe';
import { CurrencyPipe } from "@angular/common";
import { PrimengConstant } from '../app.primeconfig';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']

})
export class DashboardComponent implements OnInit {

    cities: SelectItem[];


    chartData: any;

    events: any[];

    selectedCity: any;

    items: MenuItem[];

    tenantInfo;
    finyear;
    defaultBarChartdata;
    defaultPieChartData;
    regionlist: any[] = [];
    customerslist: any[] = [];
    invoiceSummaryData;
    invoiceSummaryDataMax = 0;
    billSummaryData;
    topSalesData;
    taxSummaryData;
    profitLossSummaryData;
    salesGrowthData;
    allChartlist: any[] = [];
    chartGroupData: any;
    currencyFilter: CurrencyPipe;

    private invsdues: any[] = [];
    currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
    public no_data = PrimengConstant.EmptyMessage.DASHBOARDURL
    transactionCount = {
        invoice: 0,
        bill: 0,
        payment: 0,
        receipt: 0,
    };
    transactionNoRecordDisp = {
        invoice: false,
        bill: false,
        topsales: false,
        profitLoss: false,
        salegrowth: false,
        SaleRegion: false,
        CustomerSales: false
    }

    currentDate: string;
    self;
    barChartConfig: any = {
        self: this,
        legend: {
            position: 'bottom'
        },
        scales: {
            yAxes: [{
                ticks: {
                    // max: parseInt(this.invoiceSummaryDataMax.toFixed(2)) - 2,
                    callback(value, index, values) {
                        // return value;
                        return this.currencyFilter.transform(value, "INR", "symbol");
                    }
                }
            }]
        },
        tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
                label(tooltipItems, data) {
                    return this._options.self.currencyFilter.transform(tooltipItems.yLabel, "INR", "symbol");
                    // return this._options.self.currencyFilter.transform(tooltipItems.yLabel, "USD", true, "1.0-0").substr(3);
                }
            }
        },

    };

    chartConfig = {
        self: this,
        legend: {
            position: 'bottom'
        },
        tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
                label(tooltipItem, data) {
                    var allData = data.datasets[tooltipItem.datasetIndex].data;
                    var tooltipLabel = data.labels[tooltipItem.index];
                    var tooltipData = allData[tooltipItem.index];
                    // return tooltipLabel + ":" + this.currencyFilter.transform(tooltipData, "INR", "symbol");
                    return tooltipLabel + ":" + this._options.self.currencyFilter.transform(tooltipData, "INR", "symbol");
                }
            }
        }
    };

    constructor(
        private dashboardService: DashboardService,
        private localStorageServcie: LocalStorageService,
        private dateFormatPipeFilter: DateformatPipe,
    ) {
        this.tenantInfo = localStorageServcie.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
        this.finyear = localStorageServcie.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
        this.currentDate = this.dateFormatPipeFilter.transform(new Date(), AppConstant.API_CONFIG.ANG_DATE.apiFormat);
        this.currencyFilter = new CurrencyPipe("en-in");
        console.log(this.currencyFilter.transform(1235, "USD", false));
        this.self = this;
    }

    ngOnInit() {

        this.initBarChartConfig();

        // Begin     
        let commonParam: any = {};
        commonParam.tenantid = this.tenantInfo.tenantid;
        commonParam.finyear = this.finyear.finyear;

        // Load Required datasets
        this.getDashboardChart(commonParam);
        this.getDashboardCount(commonParam)
        // this.getInvoiceSummary(commonParam);
        // this.getBillSummary(commonParam);
        // this.getTopCustomerBySales(commonParam);
        // this.getTaxSummary(commonParam);
        // this.getProfitandLoss(commonParam);
        // this.getCurrentDateInvoiceCount(commonParam);
        // this.getCurrentDateBillCount(commonParam);
        // this.getCurrentDatePaymentCount(commonParam);
        // this.getCurrentDateReceiptCount(commonParam);
        // this.getSalesGrowthReport(commonParam);
        // this.getTopSaleRegion();
        // this.getTopCustomers();
        // End


        this.cities = [];
        this.cities.push({ label: 'Select City', value: null });
        this.cities.push({ label: 'New York', value: { id: 1, name: 'New York', code: 'NY' } });
        this.cities.push({ label: 'Rome', value: { id: 2, name: 'Rome', code: 'RM' } });
        this.cities.push({ label: 'London', value: { id: 3, name: 'London', code: 'LDN' } });
        this.cities.push({ label: 'Istanbul', value: { id: 4, name: 'Istanbul', code: 'IST' } });
        this.cities.push({ label: 'Paris', value: { id: 5, name: 'Paris', code: 'PRS' } });

        this.chartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: '#FFC107'
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    borderColor: '#03A9F4'
                }
            ]
        };

        this.items = [
            { label: 'Save', icon: 'fa fa-check' },
            { label: 'Update', icon: 'fa fa-refresh' },
            { label: 'Delete', icon: 'fa fa-trash' }
        ];
    }

    initBarChartConfig() {
        var self = this;
        this.barChartConfig.scales = {
            yAxes: [{
                ticks: {
                    //max: parseInt(maxamount.toFixed(2)) - 2,
                    callback(value, index, values) {
                        // return value;
                        return self.currencyFilter.transform(value, "INR", "symbol");
                        // return self.currencyFilter.transform(value, "USD", true, "1.0-0").substr(3);
                    }
                }
            }]
        },
            this.barChartConfig.tooltips = {
                enabled: true,
                mode: 'single',
                callbacks: {
                    label(tooltipItems, data) {
                        return self.currencyFilter.transform(tooltipItems.yLabel, "INR", "symbol");
                        // return self.currencyFilter.transform(tooltipItems.yLabel, "USD", true, "1.0-0").substr(3);
                    }
                }
            };
    }
    getDashboardChart(commonParam) {
        this.dashboardService.getDashboardChart(commonParam).then((response: any) => {
            if (response.status) {
                var data = [];
                data = response.data;
                var chartdata: any = [];
                chartdata = _.groupBy(response.data, 'chart');
                console.log("chartdata");
                console.log(chartdata);

                this.getInvoiceSummary(chartdata ? chartdata.invsdues : null);
                this.getBillSummary(chartdata ? chartdata.billsdues : null);
                this.getSalesGrowthReport(chartdata ? chartdata.salesgrowth : null);
                this.getProfitandLoss(chartdata ? chartdata.profitloss : null);
                this.getTopSaleRegion(chartdata ? chartdata.topregion : null);
                this.getTopCustomers(chartdata ? chartdata.topcustomer : null)
                // this.getTopSaleRegion(chartdata?chartdata.topregion:null);
                // this.getTopCustomers(chartdata?chartdata.topcustomer:null);

            }
        })
    }
    getBillSummary(invChartData) {
        let label_1 = "Total Open Bills";
        let label_2 = "Total Due Bills";
        if (invChartData != undefined && invChartData != null) {
            invChartData.sort(function (a, b) {
                return a.orderby - b.orderby
            })
            if (!invChartData || !invChartData.length) {
                this.billSummaryData = this.dashboardService.getDefaultBarChartData(label_1, label_2);
                console.log("dasboard", this.billSummaryData)
                this.transactionNoRecordDisp.bill = true;
                return false;
            }

            let billChartData: any = {};
            let labels = [];
            let datasets = [
                {
                    label: label_1,
                    backgroundColor: '#50a72e',
                    borderColor: '#50a72e',
                    data: []
                },
                {
                    label: label_2,
                    backgroundColor: '#e9453b',
                    borderColor: '#e9453b',
                    data: []
                }

            ];
            let isNonZeroExists = false;
            // let minamount = invChartData[0].value1;
            // let maxamount = invChartData[0].value2;
            // _.forEach(invChartData, (value: any) => {

            //     if (value.value1 || value.value2) {
            //         isNonZeroExists = true;
            //     }

            //     if (value.value1 > maxamount) {
            //         maxamount = value.value1;
            //     }
            //     else if (value.value1 < minamount) {
            //         minamount = value.value1;
            //     }

            //     datasets[0].data.push(value.value1);
            //     datasets[1].data.push(value.value2);
            //     labels.push(value.label);
            // });
            _.forEach(invChartData, (value: any) => {

                if (value.value1 || value.value2) {
                    isNonZeroExists = true;
                }

                datasets[0].data.push(value.value1);
                datasets[1].data.push(value.value2);
                labels.push(value.label);
            });

            if (!isNonZeroExists) {
                this.billSummaryData = this.dashboardService.getDefaultBarChartData(label_1, label_2);
                this.transactionNoRecordDisp.bill = true;
                return;
            }
            billChartData.labels = labels;
            billChartData.datasets = datasets;

            this.billSummaryData = billChartData;
            // this.transactionNoRecordDisp.invoice = false;
            // invoiceChartData.labels = labels;
            // invoiceChartData.datasets = datasets;
            // var self = this;
            // this.invoiceSummaryData = invoiceChartData;
            // console.log("dasboard", this.invoiceSummaryData)
        }

        else {
            this.billSummaryData = this.dashboardService.getDefaultBarChartData(label_1, label_2);
            this.transactionNoRecordDisp.bill = true;
        }

    }

    getInvoiceSummary(invChartData) {
        let label_1 = "Total Open Invoice";
        let label_2 = "Total Due Invoice";
        if (invChartData != undefined && invChartData != null) {
            invChartData.sort(function (a, b) {
                return a.orderby - b.orderby
            })
            console.log("order by", invChartData);

            if (!invChartData || !invChartData.length) {

                this.invoiceSummaryData = this.dashboardService.getDefaultBarChartData(label_1, label_2);
                console.log("dasboard", this.invoiceSummaryData)
                this.transactionNoRecordDisp.invoice = true;
                return false;
            }

            let invoiceChartData: any = {};
            let labels = [];
            let datasets = [
                {
                    label: label_1,
                    backgroundColor: '#50a72e',
                    borderColor: '#50a72e',
                    data: []
                },
                {
                    label: label_2,
                    backgroundColor: '#e9453b',
                    borderColor: '#e9453b',
                    data: []
                }

            ];
            let isNonZeroExists = false;
            let minamount = +invChartData[0].value1;
            let maxamount = +invChartData[0].value2;
            _.forEach(invChartData, (value: any) => {
                value.value1 = +value.value1;
                value.value2 = +value.value2;
                if (value.value1 || value.value2) {
                    isNonZeroExists = true;
                }

                if (value.value1 > maxamount) {
                    maxamount = value.value1;
                }
                else if (value.value1 < minamount) {
                    minamount = value.value1;
                }

                datasets[0].data.push(value.value1);
                datasets[1].data.push(value.value2);
                labels.push(value.label);
            });
            this.invoiceSummaryDataMax = maxamount;
            if (!isNonZeroExists) {
                this.invoiceSummaryData = this.dashboardService.getDefaultBarChartData(label_1, label_2);
                console.log("dasboard", this.invoiceSummaryData)
                this.transactionNoRecordDisp.invoice = true;
                return;
            }
            this.transactionNoRecordDisp.invoice = false;
            invoiceChartData.labels = labels;
            invoiceChartData.datasets = datasets;
            var self = this;
            this.invoiceSummaryData = invoiceChartData;
            console.log("dasboard", this.invoiceSummaryData)
        }

        else {
            this.invoiceSummaryData = this.dashboardService.getDefaultBarChartData(label_1, label_2);
            console.log("dasboard", this.invoiceSummaryData)
            this.transactionNoRecordDisp.invoice = true;
        }

    }

    getTopCustomerBySales(queryParam) {
        let copyParam = { ...queryParam };
        copyParam.count = 4;

        let defaultLabel = ['Customer1', 'Customer2', 'Customer3'];

        this.dashboardService.getTopCustomerBySales(copyParam)
            .then((response: any) => {
                /**
                   * {
                            labels: ['A','B','C'],
                            datasets: [
                                {
                                    data: [300, 50, 100],
                                    backgroundColor: [
                                        "#FF6384",
                                        "#36A2EB",
                                        "#FFCE56"
                                    ],
                                    hoverBackgroundColor: [
                                        "#FF6384",
                                        "#36A2EB",
                                        "#FFCE56"
                                    ]
                                }]    
                            };
                    }
                 */
                if (response.status) {
                    if (!response.data || !response.data.length) {
                        this.topSalesData = this.dashboardService.getDefaultPieChartData(...defaultLabel);
                        this.transactionNoRecordDisp.topsales = true;
                        return;
                    }

                    let topSalesChartData: any = {};
                    let labels = [];
                    let datasets = [
                        {
                            data: [],
                            backgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56"
                            ],
                            hoverBackgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56"
                            ]
                        }

                    ];
                    let isNonZeroExists = false;
                    _.forEach(response.data, (value: any) => {
                        if (value.amount) {
                            isNonZeroExists = true;
                        }
                        datasets[0].data.push(value.amount);
                        labels.push(value.label);
                    });

                    if (!isNonZeroExists) {
                        this.topSalesData = this.dashboardService.getDefaultPieChartData(...defaultLabel);
                        this.transactionNoRecordDisp.topsales = true;
                        return;
                    }

                    topSalesChartData.labels = labels;
                    topSalesChartData.datasets = datasets;

                    this.topSalesData = topSalesChartData;
                }
                else {
                    this.topSalesData = this.dashboardService.getDefaultPieChartData(...defaultLabel);
                    this.transactionNoRecordDisp.topsales = true;
                }

            })
    }
    getTaxSummary(queryParam) {
        this.dashboardService.getTaxSummary(queryParam)
            .then((response: any) => {
                if (response.data) {
                    if (!response.data || !response.data.length) {
                        this.taxSummaryData = this.dashboardService.getDefaultPieChartData();
                        return false;
                    }

                    /**
                     * 
                     *  let taxSummaryChartData:any = {};
                        let labels=[];
                        let datasets=[
                                    {
                                        label:"Taxes",
                                        backgroundColor: '#9CCC65',
                                        borderColor: '#7CB342',
                                        data: []
                                    }                            
    
                        ];
                        _.forEach(response.data,(value:any,ind)=>{
                              datasets[0].data.push(value.amount);
                              labels.push(value.label);
                        });
                        taxSummaryChartData.labels=labels;
                        taxSummaryChartData.datasets=datasets;
                     */

                    let taxSummaryChartData: any = {};
                    let labels = [];
                    let datasets = [
                        {
                            data: [],
                            backgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56"
                            ],
                            hoverBackgroundColor: [
                                "#FF6384",
                                "#36A2EB",
                                "#FFCE56"
                            ]
                        }

                    ];
                    let isNonZeroExists = false;
                    _.forEach(response.data, (value: any, ind) => {
                        if (value.amount) {
                            isNonZeroExists = true;
                        }
                        datasets[0].data.push(value.amount);
                        labels.push(value.label);

                    });
                    if (!isNonZeroExists) {
                        this.taxSummaryData = this.dashboardService.getDefaultPieChartData();
                        return;
                    }

                    taxSummaryChartData.labels = labels;
                    taxSummaryChartData.datasets = datasets;

                    this.taxSummaryData = taxSummaryChartData;
                }
                else {
                    this.taxSummaryData = this.dashboardService.getDefaultPieChartData();
                }
            })
    }
    getProfitandLoss(invChartData) {
        if (invChartData != undefined && invChartData != null) {
            if (!invChartData || !invChartData.length) {
                this.profitLossSummaryData = this.dashboardService.getDefaultPieChartData(...['NetIncome', 'Expenses', 'P&L']);
                this.transactionNoRecordDisp.profitLoss = true;
                return false;
            }

            let profileLossSummaryChartData: any = {};
            let labels = [];
            let datasets = [
                {
                    data: [],
                    backgroundColor: [
                        "#e9453b",
                        "#50a72e",
                        "#2d6891"
                    ],
                    hoverBackgroundColor: [
                        "#e9453b",
                        "#50a72e",
                        "#2d6891"
                    ]
                }

            ];
            let isNonZeroExists = false;
            //  var val1_exist = true, val2_exist = true;
            if (invChartData[0].value1 == 0 && invChartData[1].value1 == 0) {
                isNonZeroExists = false;
            } else {
                _.forEach(invChartData, (value: any) => {
                    if (parseInt(value.value1) != 0) {
                        isNonZeroExists = true;
                    }
                    if (parseInt(value.value2) != 0) {
                        isNonZeroExists = true;
                    }
                    datasets[0].data.push(value.value1);
                    labels.push(value.label);

                });
            }

            // _.forEach(invChartData, (value: any, ind) => {
            //     if (parseInt(value.value1) - (parseInt(value.value2))) {
            //         isNonZeroExists = false;
            //     }
            //     else {
            //         isNonZeroExists = true;
            //     }
            // });
            if (!isNonZeroExists) {
                this.profitLossSummaryData = {
                    labels:  ['Income', 'Expenses'],
                    datasets: [
                      {
                        data: [300, 50],
                        backgroundColor: [
                          "#FF6384",
                          "#36A2EB",
                          "#FFCE56"
                        ],
                        hoverBackgroundColor: [
                          "#FF6384",
                          "#36A2EB",
                          "#FFCE56"
                        ]
                      }]
                  };
                this.transactionNoRecordDisp.profitLoss = true;
                return;
            }
            else {
                this.transactionNoRecordDisp.profitLoss = false;
            }

            profileLossSummaryChartData.labels = labels;
            profileLossSummaryChartData.datasets = datasets;

            this.profitLossSummaryData = profileLossSummaryChartData;

        }
        else {
            this.profitLossSummaryData = this.dashboardService.getDefaultPieChartData(...['NetIncome', 'Expenses', 'P&L']);
            this.transactionNoRecordDisp.profitLoss = true;
        }
        console.log(this.profitLossSummaryData);
    }
    getDashboardCount(commonParam) {
        this.dashboardService.getDashboardCount(commonParam).then((res: any) => {
            if (res.status)
                var count: any[] = []
            count = res.data;
            if (count.length) {
                _.forEach(count, (value: any) => {
                    if (value.label == "Invoice") {
                        this.transactionCount.invoice = value.value;
                    } else if (value.label == "Receipts") {
                        this.transactionCount.receipt = value.value;
                    } else if (value.label == "Bills") {
                        this.transactionCount.bill = value.value;
                    } else if (value.label == "Payments") {
                        this.transactionCount.payment = value.value;
                    }
                })
            }

        });
    }
    getSalesGrowthReport(salesgrowthChartdata) {
        let label_1 = "Month Sales Growth";
        if (salesgrowthChartdata != undefined && salesgrowthChartdata != null) {
            salesgrowthChartdata.sort(function (a, b) {
                return a.orderby - b.orderby
            })
            if (!salesgrowthChartdata || !salesgrowthChartdata.length) {
                this.salesGrowthData = this.dashboardService.getDefaultLinearChartData(label_1);
                this.transactionNoRecordDisp.salegrowth = true;
                return false;
            }
            let salesChartData: any = {};
            let labels = [];
            let datasets = [
                {
                    label: label_1,
                    data: [],
                    fill: false,
                    borderColor: '#50a72e'
                }
            ];
            let isNonZeroExists = false;
            _.forEach(salesgrowthChartdata, (value: any) => {
                if (value.value1) {
                    isNonZeroExists = true;
                }
                datasets[0].data.push(value.value1);
                labels.push(value.label);
            });
            if (!isNonZeroExists) {
                this.salesGrowthData = this.dashboardService.getDefaultLinearChartData(label_1);
                this.transactionNoRecordDisp.salegrowth = true;
                return;
            }
            salesChartData.labels = labels;
            salesChartData.datasets = datasets;
            this.salesGrowthData = salesChartData;
        }
        else {
            this.salesGrowthData = this.dashboardService.getDefaultLinearChartData(label_1);
            this.transactionNoRecordDisp.salegrowth = true;
        }


    };
    getTopSaleRegion(topsales) {
        var blockui_SaleRegion = false;
        if (topsales != undefined) {
            if (topsales.length > 0) {
                this.regionlist = topsales;
                blockui_SaleRegion = false;
                // this.regionlist=[{
                //     label:"any",
                //     value1:"52544"
                // }];
            } else {
                blockui_SaleRegion = true;
            }
        }
        else {
            blockui_SaleRegion = true;
        }
        if (blockui_SaleRegion == true) {
            this.transactionNoRecordDisp.SaleRegion = true;
        }
    };
    getTopCustomers(topcustomer) {
        var blockui_CustomerSales = false;
        if (topcustomer != undefined) {
            if (topcustomer.length > 0) {
                blockui_CustomerSales = false;
                this.customerslist = topcustomer;
            } else {
                blockui_CustomerSales = true;
            }
        }
        else {
            blockui_CustomerSales = true;
        }
        if (blockui_CustomerSales == true) {
            this.transactionNoRecordDisp.CustomerSales = true;
        }
    };
    refreshload() {
        let commonParam: any = {};
        commonParam.tenantid = this.tenantInfo.tenantid;
        commonParam.finyear = this.finyear.finyear;
        this.getDashboardChart(commonParam);
    }
}
