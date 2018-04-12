export const AppConstant = Object.freeze({
  APP: {
    MODULE_NAME: 'ACCOUNTING'
  },
  API_ENDPOINT: 'http://dev.gntstech.in:5001/efinance/',
  ACCOUNT: {
    ACC_URL: 'http://dev.gntstech.in/accounts/#/',
    BASE_URL: 'http://dev.gntstech.in:5000/ibacapi/',
    APP_SETTING: 'dashboard/#/',
    DATAEXPORTURL: "http://27.250.1.51:5001/",
    API: {
      LOGOUT: 'logout/eFinance/',
      SESSION_INFO: 'session/'
    },

    Role: {
      USERROLELIST: 'role/'
    },
    MODULES: {
      LIST: 'modules/list',
      TENANTLIST: 'tenant/modules/list'
    }
  },
  REPORTS: {
    CONFIG: {
      REPORT_PATH: '/opt/Infobooks/3grjsrpt/Jasper_Files/Reports/'
    },
    REPORT: 'http://dev.gntstech.in:8088/IBReports/reports/getreport',

    INVOICE: {
      REPORT_NAME: 'INVOICE_T1'
    },
    BRS: {
      REPORT_NAME: 'BRS_REG_T1',
      PREFIX_NAME: 'BRS'
    },
    BILL: {
      REPORT_NAME: 'BILL_T1'
    },
    JOURNAL_REGISTER: {
      REPORT_NAME: 'JOURNALl_REG_T1',
      PREFIX_NAME: 'Journal Register'
    },
    TAX_SUMMARY: {
      REPORT_NAME: 'TAX_SUMMARY_T1',
      PREFIX_NAME: 'Tax Summary'
    },
    INVOICE_REGISTER: {
      REPORT_NAME: 'INVOICE_REG_T1',
      PREFIX_NAME: 'Invoice Register'
    },
    BILL_REGISTER: {
      REPORT_NAME: 'BILL_REG_T1',
      PREFIX_NAME: 'Bill Register'
    },
    RECEIPT_REGISTER: {
      REPORT_NAME: 'RECEIPT_REG_T1',
      PREFIX_NAME: 'Receipt Register'
    },
    PAYMENT_REGISTER: {
      REPORT_NAME: 'PAYMENT_REG_T1',
      PREFIX_NAME: 'Payment Register'
    },
    DAYBOOK_REGISTER: {
      REPORT_NAME: 'DAY_BOOK_T1',
      PREFIX_NAME: 'Day Book'
    },
    OUTSTANDING_INV: {
      REPORT_NAME: 'OUTSTANDING_INVOICE_T1',
      PREFIX_NAME: 'Outstanding Invoices'
    },
    OUTSTANDING_PAY: {
      REPORT_NAME: 'OUTSTANDING_PAYMENTS_T1',
      PREFIX_NAME: 'Outstanding Payments'
    },
    INVOICE_TAXATION: {
      REPORT_NAME: 'INVIOCE_TAXATION_T1',
      PREFIX_NAME: 'Invoice Taxation'
    },
    BILL_TAXATION: {
      REPORT_NAME: 'BILL_TAXATION_T1',
      PREFIX_NAME: 'Bill Taxation'
    },
    CREDIT_NOTE_REG: {
      REPORT_NAME: 'CREDITNOTE_T1',
      PREFIX_NAME: 'Credit Note Register'
    },
    DEBIT_NOTE_REG: {
      REPORT_NAME: 'DEBITNOTE_T1',
      PREFIX_NAME: 'Debit Note Register'
    },

    BANK: {
      DEPOSIT_REPORT_NAME: 'BANKDEPOSIT_T1',
      WITHDRAW_REPORT_NAME: 'BANKWITHDRAW_T1',
      TRANSFER_REPORT_NAME: 'BANKTRANSFER_T1'
    },
    ACCOUNTS: {
      CREDIT_REPORT_NAME: 'CREDIT_T1',
      DEBIT_REPORT_NAME: 'DEBIT_T1',
      JOURNALS_REPORT_NAME: 'JOURNALS_T1'
    },
    RECEIPT: {
      RECEIPT_REPORT_NAME: 'RECEIPT_T1'
    },
    PAYMENT: {
      PAYMENT_REPORT_NAME: 'PAYMENT_T1'
    },
    CUSTOMER_ADVANCE:
      {
        CUSTOMER_REPORT_NAME: 'CUSTOMER_ADV_T1'
      },
    VENDOR_ADVANCE:
      {
        VENDOR_REPORT_NAME: 'VENDOR_ADV_T1'
      },
    PRODUCT_LIST: {
      REPORT_NAME: 'PRODUCTS_T1',
      PREFIX_NAME: 'Products'
    },
    LEDGER_REGISER:
      {
        REPORT_NAME: 'LEDGER_REG_T1',
        PREFIX_NAME: 'Ledger'
      },
    TRAIL_BALANCE_GROUPS:
      {
        REPORT_NAME: 'TRAIL_BALANCE_GROUPS_T1',
        PREFIX_NAME: 'Trail Balance-Group'
      },
    TRAIL_BALANCE_LEDGERS:
      {
        REPORT_NAME: 'TRAIL_BALANCE_LEDGERS_T1',
        PREFIX_NAME: 'Trail Balance-Ledger'
      },
    BALANCE_SHEET:
      {
        REPORT_NAME: 'BALANCE_SHEET_T1',
        PREFIX_NAME: 'Balance Sheet'
      },
    PROFIT_LOSS:
      {
        REPORT_NAME: 'PROFIT_LOSS_T1',
        PREFIX_NAME: 'Profit And Loss'
      },
  },

  FEATURES: {
    ACCOUNTING: {
      URL: "http://dev.gntstech.in/efinance/#"
    },
    DOC_MGMT: {
      URL: "http://dev.gntstech.in/efile/#"
    },
    // E_CATALOGUE: {
    //   URL: "http://localhost:1003/#"
    // },
    CRM: {
      URL: "http://dev.gntstech.in/cconnect/#"
    },
    HCM: {
      URL: "http://dev.gntstech.in/pconnect/#"
    },
    // I_RETAIL: {
    //   URL: "http://localhost:1006/#"
    // },
  },
  API_CONFIG: {

    ACCOUNTGROUPS: {
      POST_DATED_CHEQUES: 'POST DATED CHEQUES'
    },
    APP_CONTENT: {
      APP_NAME: 'infoG',
      APP_DESC: 'infoG Admin Dashboard',
    },
    LOCALSTORAGE: {
      STR_PREFIX: 'infob-',
      CLIENT_SWITCHED: 'switched',
      CLIENT_DATA: 'client_data',
      OWN_DATA: 'own_data',
      OWN_TOKEN: 'own_token',
      STR_AUTH: 'AuthendicationSuccess',
      STR_AUTHSUCCESS: 'isAuthenticated',
      USER: 'user',
      FINYEAR: 'finyear',
      HEADS: 'heads',
      USERROLE: 'userroles',
      RESOURCE: 'resources',
      TOKEN: 'token',
      APPSETTING: 'appsettings',
      CONSULTANT: {
        STORE_NAME: 'consultant',
        CLIENT_ID: 'clientid',
        TENANT_ID: 'tenantid',
        USER_ID: 'userid',
        KEY: 'consultantKey',
        DBNAME: 'dbname',
        ROLE: 'Role'

      }
    },
    FINYEARS: [
      { 'finyear': 'APR 2015 - MAR 2016', 'prevfinyear': 'APR 2014 - MAR 2015', 'YearStartsFrom': '01-04-2015', 'YearEndsOn': '31-03-2016' },
      { 'finyear': 'APR 2016 - MAR 2017', 'prevfinyear': 'APR 2015 - MAR 2016', 'YearStartsFrom': '01-04-2016', 'YearEndsOn': '31-03-2017' },
      { 'finyear': 'APR 2017 - MAR 2018', 'prevfinyear': 'APR 2016 - MAR 2017', 'YearStartsFrom': '01-04-2017', 'YearEndsOn': '31-03-2018' },
      { 'finyear': 'APR 2019 - MAR 2020', 'prevfinyear': 'APR 2017 - MAR 2018', 'YearStartsFrom': '01-04-2018', 'YearEndsOn': '31-03-2019' },
      { 'finyear': 'APR 2020 - MAR 2021', 'prevfinyear': 'APR 2019 - MAR 2020', 'YearStartsFrom': '01-04-2019', 'YearEndsOn': '31-03-2020' }],
    EMPTYMESSAGE:
      {
        MESSAGE: 'No Records Found'
      },
    M_BASE_URL: 'views/',
    M_TENANTS_URL: 'views/tenents/',
    HEADER_CONTENT_TYPE: {
      FORM_URL_ENCODE: 'application/x-www-form-urlencoded;charset=utf-8;',
      APPLICATION_JSON: 'application/json',
    },
    DECIMAL_PLACES: [
      { places: '0' },
      { places: '1' },
      { places: '2' },
      { places: '3' }
    ],
    DATE_FORMATS: [
      { format: 'dd-MMM-yy' },
      { format: 'dd-MM-yy' },
      { format: 'MM-dd-yy' },
      { format: 'yy-MM-dd' },
      { format: 'dd/MM/yy' },
      { format: 'MM/dd/yy' },
      { format: 'yy/MM/dd' },
      { format: 'dd.MM.yy' },
      { format: 'MM.dd.yy' },
      { format: 'yy.MM.dd' },
      { format: 'dd-MMM-yyyy HH:mm' }
    ],
    PAYMENT: {
      //                  INSTAMOJOURL: 'https://www.instamojo.com/gntstech/infog-payment/',  // dev
      INSTAMOJOURL: 'https://www.instamojo.com/gntstech/infog-trail/'  // qc
    },
    JASPER_REPORTSERVER: 'http://lowcost-env.qm8mcxiehm.ap-south-1.elasticbeanstalk.com/',
    RUPEES: {
      symbol: '₹. ',
      symbol2: '₹'
    },
    PAGINATOR:
      {
        LISTPAGES: 5,
        REPORTPAGES: 10
      },
    AMOUNTFORMAT:
      {
        MAXLENGTH: '30'
      },
    MAXLENGTH: {
      PHONENUMBER: '13',
      MAX50: '50',
      GST: '15',
      PINLENGTH: '6',
      MAX30: '30',
      MAX11: '11',
      MAX17: '17',
    },
    CURRENCY_FORMAT: 'INR',
    PLACEOFSUPPLYFORMAT: "PLACE_OF_SUPPLY",
    SELECTEDCOUNTRY: 'India',
    DATE: {
      format1: 'dd-MM-yyyy',
      apiFormat: 'YYYY-MM-DD',  // A valid moment js data format. Refer https://momentjs.com/docs/#/parsing/string-format/
      displayFormat: 'dd-MMM-yyyy'
    },
    ANG_DATE: {
      displaydtime: 'dd-MMM-yyyy HH:mm',
      displayFormat: 'dd-MM-y', // 01-31-2019 y-MM-dd
      apiFormat: 'y-MM-dd',
      apiTSFormat: 'y-MM-dd HH:mm'
    },
    status: [
      { stat: 'Active' },
      { stat: 'Inactive' }
    ],
    Features: [
      { name: 'Receipt' },
      { name: 'Payment' }
    ],
    Partygroup: [
      { name: 'All' },
      { name: 'Sundry Creditors' },
      { name: 'Sundry Debtors' }
    ],
    LEDGEREXCP: ['Cash In Hand', 'Purchases', 'Sales'],
    EXCLEDGER: ['Cash In Hand', 'Purchases', 'Sales', 'Bank'],
    LIABILITIES_HEAD: ['Capital', 'Current Liabilities And Provisions'],
    ASSETS_HEAD: ['Fixed Assets', 'Current Assets'],
    PROFITLOSS_HEADS: ['Expenditures (Indirect)', 'Income (Direct)',
      'Expenditures (Direct)', 'Income (Indirect)'],
    LEDGERTAXINSUBGROUP: ['Cash In Hand', 'GST Output 12%', 'GST Output 18%',
      'GST Output 28%', 'GST Output 5%'],
    BALANCESHEET_HEADS: ['Capital', 'Current Liabilities And Provisions',
      'Fixed Assets', 'Current Assets'],
    IDENTIFIER: {
      B2B: "b2b-",
      B2BA:"b2b-",
      B2CL:"b2cl-",
      B2CS:"b2cs-",
      B2BUR: "b2bur-",
      IMPS: "imps-",
      IMPG: "impg-",
      CDNR: "cdnr-",
      CDNRA:"cdnr-",
      CDNUR: "cdnur-",
      AT: "advt-",
      ATA: "at-",
      ATADJ: "atadj-",
      EXEMP: "exemp-",
      EXEMPA:"exemp-",
      ITCR: "itcr-",
      HSNSUM: "hsnsum-",
      EXP:"exp-"
    },
    API_URL: {
      FEATURESCREEN_LIST: './assets/screen_features.json',
      TNT_ACCOUNTCONFIG: {
        LIST: 'config/list',
      },
      TNT_CODEMASTER: {
        LIST: 'codeMaster/list',
      },
      TIMEZONE: {
        LIST: 'timezones',
      },
      CURRENCY: {
        LIST: 'currency/list',
      },
      CONTACT: {
        CREATE: 'contact/create',
        LIST: 'contact/list',
        UPDATE: 'contact/update',
        FINDBYID: ''  // new api for contact list instead of contact FINDALL
      },
      // Sub Ledger
      SUBLEDGER: {
        CREATE: 'bookofaccount/create',
        FINDALL: 'bookofaccount/list',
        UPDATE: 'bookofaccount/update',
        FINDBYID: 'bookofaccount/'
      },
      TNT_PRODUCTS: {
        CREATE: 'products/create',
        UPDATE: 'products/update',
        LIST: 'products/list',
        FINDBYID: 'products/findByID',
        DELETE: 'products/delete',
        PROSEARCH: 'products/search',
        HSNCODE: 'products/hsn/list',
        SACCODE: 'products/sac/list'
      },
      TNT_BRANDS: {
        CREATE: 'brands/create',
        UPDATE: 'brands/update',
        FINDALL: 'brands/list',
        FINDBYID: 'brands/findByID',
        DELETE: 'brands/delete',
      },
      TNT_CATEGORY: {
        CREATE: 'category/create',
        UPDATE: 'category/update',
        FINDALL: 'category/list',
        FINDBYID: 'category/findByID',
        DELETE: 'category/delete',
      },
      TNT_TAXES: {
        LIST: 'taxmaster/list'
      },
      TNT_UOM: {
        CREATE: 'uom/create',
        UPDATE: 'uom/upsert',
        FINDALL: 'uom/list',
        FINDBYID: 'uom/findByID',
        DELETE: 'uom/delete',
      },
      ACC_BOOKOFACCOUNTS: {
        LIST: 'bookOfAccount/list',
        CREATE: 'bookOfAccount/create',
        UPDATE: 'bookOfAccount/update',
        FINDALL: 'booksofaccounts/findAll',
      },
      TAX: {
        CREATE: 'tax/create',
        UPDATE: 'tax/update',
        FINDALL: 'tax/findAll',
        FINDBYID: 'tax/findByID',
        DELETE: 'tax/delete',
      },
      ACC_HEADS: {
        LIST: 'heads/list'
      },
      TNT_LEDGERSUMMARY: {
        NAMES: 'reports/ledger/list'
      },
      TNT_BANK: {
        LISTALL: 'journal/list'
      },
      TNT_JOURNAL: {
        FINDBYID: 'journal/',
        CREATE: 'journal/create',
        LISTALL: 'journal/list',
        UPDATE: 'journal/update',
        CONFIG: 'reports/config/list',
        DETAILS: 'journaldetails/findAll',
        FEATURE: 'codemaster/findall',
        DELETE: 'journal/delete'
      },
      TNT_INVOICE: {
        INVOICE: 'invoice/',
        CREATE: 'invoice/create',
        UPDATE: 'invoice/update',
        LIST: 'invoice/list',
        GETBYID: 'invoice/getbyid',
        DELETE: 'invoice/delete',
        FINDALL: 'invoice/findAll',
        DETAILS: 'invoicedetail/findAll',
        INVOICEPAYMENT: 'payments/create',
        SEQ: 'generator/seqenceno',
        ACCCONFIG: 'accconfig/findAll',
        VALIDATE: 'ledger/validate'
      },
      TNT_LICENCE: {
        // CREATE: 'tenantlicen/create',
        CREATE: 'invoice/create',
        UPDATE: 'tenantlicen/upsert',
        DELETE: 'tenantlicen/delete',
        FINDALL: 'tenantlicen/findAll',
      },
      TNT_BILL: {
        CREATE: 'bill/create',
        LIST: 'bill/list',
        BILL: 'bill/',
        GETBYID: 'bill/getbyid',
        UPDATE: 'bill/update',
        FINDALL: 'bills/findAll',
        DETAILS: 'billsdetails/findAll',
        PAYMENTRECEIPTLIST: 'receipts/findAll',
        PAYMENTRECEIPTDETAILS: 'receiptsdetails/findAll',
        PAYMENTDETAILS: 'receiptsdetails/findByID',
        BILLRECEIPT: 'receipts/create',
        DELETE: 'bill/delete'
      },
      ADV_RECEIPT: {
        CREATE: 'receipts/advreccreate',
        INVDETAILS: 'receipts/advdetails',
        ADVALLOCATE: 'receipts/paymentmatch',
        ADVLIST: 'receipts/advfindAll',
        GETADVINVDETAILS: 'invoicedetail/advdetails',
        ADVRECUPDATE: 'receipts/advupdate',
        RECEIPTUPDATE: 'receipts/update'
      },
      TNT_ACCOUNT: {
        CREATE: 'cdnotes/create',
        FINDALL: 'cdnotes/list',
        FINDBYID: 'cdnotes/getById',
        UPDATE: 'cdnotes/update',
        DELETE: 'cdnotes/delete'
      },
      TNT_PAYMENT_RECEIPT: {
        CREATE: 'paymentreceipt/create',
        LIST: 'paymentreceipt/list',
        UPDATE: 'paymentreceipt/update',
        FINDBYID: 'paymentreceipt/getbyid',
        DELETE: 'paymentreceipt/delete'
      },
      PAYTERMS: {
        RECPAYTERM: 'codemaster/findall',
        RECPAYMODE: 'bookofaccount/paymentmode/list'
      },
      TAXES: {
        CREATE: 'tenanttax/create',
        UPDATE: 'tenanttax/upsert',
        FINDBYID: 'tenanttax/findByID',
        FINDALL: 'tenanttax/findAll',
        DELETE: 'tenanttax/delete',
        GSTFINDALL: 'taxmaster/findall'
      },
      ROLES: {
        CREATE: 'role/create',
        UPDATE: 'role/update',
        FINDBYID: 'roles/findByID',
        FINDALL: 'role/list',
        DELETE: 'roles/delete'
      },
      TNTUSER: {
        CREATE: 'users/create',
        UPDATE: 'users/update',
        DELETE: 'users/delete',
        FINDALL: 'users/list'
      },
      TNT: {
        FINDBYID: 'tenant/',
        TENANTUPDATE: 'tenant/update',
        FINDALL: 'tenant/list',
        SETTING: 'tenant/settings/list'
      },
      CONSULTANT: {
        LOGIN: 'consultant/login'
      },
      BRAND: {
        CREATE: 'brands/create',
        FINDALL: 'brands/list',
        UPDATE: 'brands/update'
      },
      PROD_GROUP: {
        CREATE: 'category/create',
        FINDALL: 'category/list',
        UPDATE: 'category/update',
        FINDBYID: ''
      },
      PROFILE: {
        CHANGEPWD: 'users/change/password',
        UPLOAD: 'user/dpupload',
        EDIT: 'user/'
      },
      BANK: {
        FINDALL: 'bank/list',
        CREATE: 'bank/create',
        UPDATE: 'bank/update',
        FINDBYID: 'bank/'
      },
      BRS: {
        LIST: 'brs/list',
        CREATE: 'brs/create',
        UPDATE: 'brs/update',
        UPDATEDETAILS: 'brs/detail/update',
        MATCHLIST: 'brs/listForMatch',
        DETAILLIST: 'brs/detail/list',
        LEDGERLIST: 'brs/ledger/list',
        REPORT: 'brs/report'
      },

      COUNTRY: {
        FINDALL: 'country/list'
      },
      STATE: {
        FINDALL: 'state/list'
      },
      CITY: {
        FINDBYID: 'city/list'

      },
      INDUSTRY_TYPE: {
        FINDALL: 'industry/list'
      },
      DASHBOARD: {
        COUNT: {
          COUNT: 'dashboard/count',
        },
        CHART: {
          CHART: 'dashboard/chart'
        },
        TOPCUSTOMERBYSALES: {
          GETTOPCUSTOMERBYSELES: 'dashboard/top/sale/customers'
        },
        CREDITSDEBITS: {
          GETCREDITSDEBITS: 'dashboard/creditsdebits/summery'
        },
        TAXSUMMARYREPORT: {
          GETTAXSUMMARYREPORT: 'dashboard/tax/summery'
        },
        INVOICEREPORT: {
          GET_LIST: 'dashboard/invoice/dues',
          GET_MONTH_COUNT: 'dashboard/month/invoice/count'
        },
        BILLREPORT: {
          GET_LIST: 'dashboard/bill/dues',
          GET_MONTH_COUNT: 'dashboard/month/bill/count'
        },
        CUSTOMER_ADVANCE: {
          GET_LIST: 'dashboard/month/customer/advance',
          GET_MONTH_COUNT: ''
        },
        VENDOR_ADVANCE: {
          GET_LIST: 'dashboard/month/vendor/advance',
          GET_MONTH_COUNT: ''
        },
        RECEIPTS: {
          GET_LIST: 'dashboard/month/receipt',
          TOP_RECEIPT: 'dashboard/top/receipt/contact'
        },
        PAYMENTS: {
          GET_LIST: 'dashboard/month/payment',
          TOP_PAYMENT: 'dashboard/top/payment/contact'
        },
        INVOICECOUNT: 'dashboard/invoice/count',
        BILLCOUNT: 'dashboard/bill/count',
        PAYMENTRECEIPTCOUNT: 'dashboard/paymentreceipt/count',
        SALESGROWTH: 'dashboard/sales/growth',
        TOP_SALE_RGN: 'dashboard/top/selling/regions',
        TOP_SALE_PROD_CAT: 'dashboard/top/product/category',
        TOP_CUSTOMER_ADVANCE: 'dashboard/top/advance/paid/customer',
        TOP_VENDOR_ADVANCE: 'dashboard/top/advance/paid/vendor',
      },
      REPORTS: {
        TB: 'reports/trailbalance',
        PL: 'reports/profitloss',
        LEDGER: 'reports/ledger',
        DAYBOOK: 'reports/daybook',
        OUTSTAND_INV: 'reports/outstandinginvoices',
        OUTSTAND_PAY: 'reports/outstandingpayments',
        BILL_TAX: 'reports/billtaxation',
        INV_TAX: 'reports/invoicetaxation',
        LEDGERLIST: 'ledger/list',
        BALANCESHEET: 'reports/balancesheet',
        INVOICEREG: 'reports/invoice/list',
        BILLREG: 'reports/bills/list ',
        PAYRECLIST: 'reports/paymentreceipt/list',
        TAX_SUM: 'reports/taxsummary'
      },
      GST_FILING: {
        GSTR:"efile/gstr",
        EXPORT: "efile/test",
      },
      BOOKOFACCOUNTS: {
        LIST: 'bookofaccount/list',
        CREATE: 'bookofaccount/create',
        UPDATE: 'bookofaccount/update'
      },
      SEQUENCE: {
        FINDALL: 'sequence/list',
        UPDATE: 'sequence/update'
      },
    },
    SITECONFIG: {
      SUNDRY_C: {
        'accheadid': '9eb16ae2cda75e7f336a6e6220161227',
        'accheadname': 'Sundry Creditors'
      },
      SUNDRY_D: {
        'accheadid': '620985adccf07463ca18b80320161227',
        'accheadname': 'Sundry Debtors',
      }
    },
    CHART_SERVICE: {
      TOPCUSTOMERBYSELES: {
        GETTOPCUSTOMERBYSELES: 'reports/getTopCustomersBySales'
      },
      CREDITSDEBITS: {
        GETCREDITSDEBITS: 'reports/getTotalCreditsandDebits'
      },
      TAXSUMMARYREPORT: {
        GETTAXSUMMARYREPORT: 'reports/getTaxSummaryReport '
      },
      INVOICELIST: {
        GETINVOICELIST: 'reports/getInvoiceDuesReport'
      },
      BILLLIST: {
        GETBILLLIST: 'reports/getOpenDueBillsReport'
      },
      DASHBOARD: {
        COUNT: ' dashboard/count'
      },
    },
    CHAT_CONFIG: {
      LIMIT: 6,
      LIST_PAGE_LIMIT: 10
    }
  },
  PART_TYPE: {
    MIS_CUSTOMER: 'Miscellaneous Customer',
    MIS_VENDOR: 'Miscellaneous Vendor',
    CUSTOMER: 'Customer',
    VENDOR: 'Vendor'
  }

  // EMPTYMESSAGE:{
  //   URL:'http://www.beautybythread.com/sacra/Pics/DataNotFound.jpg',
  // }
});
