import { Injectable } from '@angular/core';
import { CommonHttpService } from '../shared/common-http.service';
import { AppConstant } from '../app.constant';

@Injectable()
export class DashboardService {

  constructor(private httpService: CommonHttpService) { }
  getDashboardCount(data) {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT +
      AppConstant.API_CONFIG.API_URL.DASHBOARD.COUNT.COUNT, data)
      .then(data => {
        return data;
      });
  }
  getDashboardChart(data) {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT +
      AppConstant.API_CONFIG.API_URL.DASHBOARD.CHART.CHART, data)
      .then(data => {
        return data;
      });
  }

  getTopCustomerBySales(data) {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT +
      AppConstant.API_CONFIG.API_URL.DASHBOARD.TOPCUSTOMERBYSALES.GETTOPCUSTOMERBYSELES, data)
      .then(data => {
        return data;
      });
  }
  getCreditDebitSummary(data) {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT +
      AppConstant.API_CONFIG.API_URL.DASHBOARD.CREDITSDEBITS.GETCREDITSDEBITS, data)
      .then(data => {
        return data;
      });
  }
  getTaxSummary(data) {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT +
      AppConstant.API_CONFIG.API_URL.DASHBOARD.TAXSUMMARYREPORT.GETTAXSUMMARYREPORT, data)
      .then(data => {
        return data;
      });
  }
  getInvoiceSummary(data) {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT +
      AppConstant.API_CONFIG.API_URL.DASHBOARD.INVOICEREPORT.GET_LIST, data)
      .then(data => {
        console.log("das", data);
        return data;
      });
  }
  getInvoiceCountSummary(data) {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT +
      AppConstant.API_CONFIG.API_URL.DASHBOARD.INVOICEREPORT.GET_MONTH_COUNT, data)
      .then(data => {
        return data;
      });
  }
  getBillSummary(data) {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT +
      AppConstant.API_CONFIG.API_URL.DASHBOARD.BILLREPORT.GET_LIST, data)
      .then(data => {
        return data;
      });
  }
  getBillCountSummary(data) {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT +
      AppConstant.API_CONFIG.API_URL.DASHBOARD.BILLREPORT.GET_MONTH_COUNT, data)
      .then(data => {
        return data;
      });
  }
  getInvoiceCount(data) {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT +
      AppConstant.API_CONFIG.API_URL.DASHBOARD.INVOICECOUNT, data)
      .then(data => {
        return data;
      });
  }
  getBillCount(data) {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT +
      AppConstant.API_CONFIG.API_URL.DASHBOARD.BILLCOUNT, data)
      .then(data => {
        return data;
      });
  }
  getCustomerAdvanceSummary(data) {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT +
      AppConstant.API_CONFIG.API_URL.DASHBOARD.CUSTOMER_ADVANCE.GET_LIST, data)
      .then(data => {
        return data;
      });
  }
  getCustomerAdvanceMonthlyCount(data) {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT +
      AppConstant.API_CONFIG.API_URL.DASHBOARD.CUSTOMER_ADVANCE.GET_MONTH_COUNT, data)
      .then(data => {
        return data;
      });
  }
  getVendorAdvanceSummary(data) {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT +
      AppConstant.API_CONFIG.API_URL.DASHBOARD.VENDOR_ADVANCE.GET_LIST, data)
      .then(data => {
        return data;
      });
  }
  getVendorAdvanceMonthlyCount(data) {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT +
      AppConstant.API_CONFIG.API_URL.DASHBOARD.VENDOR_ADVANCE.GET_MONTH_COUNT, data)
      .then(data => {
        return data;
      });
  }
  getReceiptsSummary(data) {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT +
      AppConstant.API_CONFIG.API_URL.DASHBOARD.RECEIPTS.GET_LIST, data)
      .then(data => {
        return data;
      });
  }

  getTopReceipts(data) {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT +
      AppConstant.API_CONFIG.API_URL.DASHBOARD.RECEIPTS.TOP_RECEIPT, data)
      .then(data => {
        return data;
      });
  }
  getPaymentSummary(data) {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT +
      AppConstant.API_CONFIG.API_URL.DASHBOARD.PAYMENTS.GET_LIST, data)
      .then(data => {
        return data;
      });
  }
  getTopPayments(data) {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT +
      AppConstant.API_CONFIG.API_URL.DASHBOARD.PAYMENTS.TOP_PAYMENT, data)
      .then(data => {
        return data;
      });
  }

  getReceiptorPaymentCount(data) {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT +
      AppConstant.API_CONFIG.API_URL.DASHBOARD.PAYMENTRECEIPTCOUNT, data)
      .then(data => {
        return data;
      });
  }
  // Get Sales Growth report
  getSalesGrowth(data) {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT +
      AppConstant.API_CONFIG.API_URL.DASHBOARD.SALESGROWTH, data)
      .then(data => {
        return data;
      });
  };
  // Get Top selling Regions
  getTopSellingRegion(data) {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT +
      AppConstant.API_CONFIG.API_URL.DASHBOARD.TOP_SALE_RGN, data)
      .then(data => {
        return data;
      });
  };
  // Get Top selling Product Category
  getTopSellingProductCategory(data) {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT +
      AppConstant.API_CONFIG.API_URL.DASHBOARD.TOP_SALE_PROD_CAT, data)
      .then(data => {
        return data;
      });
  };

  // GET top vendor advance details
  getTopVendorAdvance(data) {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT +
      AppConstant.API_CONFIG.API_URL.DASHBOARD.TOP_VENDOR_ADVANCE, data)
      .then(data => {
        return data;
      });
  }
   // GET top customer advance details
   getTopCustomerAdvance(data) {
    return this.httpService.globalPostService(AppConstant.API_ENDPOINT +
      AppConstant.API_CONFIG.API_URL.DASHBOARD.TOP_CUSTOMER_ADVANCE, data)
      .then(data => {
        return data;
      });
  }
  getDefaultPieChartData(...labels) {
    let defaultPieChartData = {
      labels: labels.length ? [...labels] : ['A', 'B', 'C'],
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

    return defaultPieChartData;
  };
  getDefaultBarChartData(dataSetLabel1 = 'My First dataset', dataSetLabel2?) {

    let defaultBarChartdata = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: dataSetLabel1,
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          data: [65, 59, 80, 81, 56, 55, 40]
        }
      ]
    };
    if (dataSetLabel2) {
      defaultBarChartdata.datasets[1] = {
        label: dataSetLabel2,
        backgroundColor: '#9CCC65',
        borderColor: '#7CB342',
        data: [28, 48, 40, 19, 86, 27, 90]
      }
    }
    return defaultBarChartdata;
  }
  getDefaultLinearChartData(dataSetLabel1){
    let defaultLinearChartdata = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: dataSetLabel1,
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          fill:false,
          data: [65, 59, 80, 81, 56, 55, 40]
        }
      ]
    };
    return defaultLinearChartdata;
  }
}

