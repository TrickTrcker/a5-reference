export const AppConfig = Object.freeze({

  API_ENDPOINT: "http://27.250.1.58:3005/efinance/",
  API_CONFIG: {
    APP_CONTENT: {
      APP_NAME: "infoG",
      APP_DESC: "infoG Admin Dashboard",
    },
    LOCALSTORAGE: {
      STR_PREFIX: "infob-",
      STR_AUTH: "AuthendicationSuccess",
      STR_AUTHSUCCESS: "isAuthenticated",
      USER: "user",
      FINYEAR: "finyear",
      HEADS: "heads",
      USERROLE: "userroles",
      RESOURCE: "resources",
      TOKEN: "token"
    },

    EMPTYMESSAGE:
    {
      MESSAGE: "No Records Found"
    },
    M_BASE_URL: 'views/',
    M_TENANTS_URL: 'views/tenents/',
    HEADER_CONTENT_TYPE: {
      FORM_URL_ENCODE: "application/x-www-form-urlencoded;charset=utf-8;",
      APPLICATION_JSON: "application/json",
    },
    PAYMENT: {
      //                  INSTAMOJOURL: "https://www.instamojo.com/gntstech/infog-payment/",  // dev
      INSTAMOJOURL: "https://www.instamojo.com/gntstech/infog-trail/"  // qc
    },
    JASPER_REPORTSERVER: "http://lowcost-env.qm8mcxiehm.ap-south-1.elasticbeanstalk.com/",
    RUPEES: {
      symbol: '₹. ',
      symbol2: '₹'
    },
    CURRENCY_FORMAT: "INR",
    DATE: {
      format1: "dd-MM-yyyy",
      apiFormat: "YYYY-MM-DD",  // A valid moment js data format. Refer https://momentjs.com/docs/#/parsing/string-format/
      displayFormat: "dd-MMM-yyyy"
    },
    ANG_DATE: {

      displayFormat: "dd-MM-y", // 01-31-2019 y-MM-dd
      apiFormat: "y-MM-dd",
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
    // Keep Main Menu Name as MAIN_MODULE property or Permission Name
    MENU_ASSOCIATIONS: [
      {
        MAIN_MODULE: "Tenants",
        SUB_MODULE: ['Tax', 'Ledger-Master', 'Payment Terms', 'Branch']
      },
      {
        MAIN_MODULE: "Inventory",
        SUB_MODULE: ['Products']
      },
      {
        MAIN_MODULE: "Inventory",
        SUB_MODULE: ['Products']
      },
      {
        MAIN_MODULE: "Invoice",
        SUB_MODULE: []
      },
      {
        MAIN_MODULE: "Receipt",
        SUB_MODULE: []
      },
      {
        MAIN_MODULE: "Bill",
        SUB_MODULE: []
      },
      {
        MAIN_MODULE: "Payment",
        SUB_MODULE: []
      },
      {
        MAIN_MODULE: "Journal",
        SUB_MODULE: []
      },
      {
        MAIN_MODULE: "Reports",
        SUB_MODULE: ['Trail Balance', 'Tax Summary', 'Ledger', 'Reports', 'Reports']
      },
      {
        MAIN_MODULE: "Finance Report",
        SUB_MODULE: ["Trail Balance", "Tax Summary", "Profit & Loss", "Balance Sheet"]
      },
      {
        MAIN_MODULE: "Other Reports",
        SUB_MODULE: ["Ledger", "Day Book"]
      },
      {
        MAIN_MODULE: "Sales Reports",
        SUB_MODULE: ["Sales Register", "Outstanding Receipts", "Debtor Aging"]
      },
      {
        MAIN_MODULE: "Expense Reports",
        SUB_MODULE: ["Purchase Register", "Outstanding Payments"]
      },
      {
        MAIN_MODULE: "Settings",
        SUB_MODULE: ['Application', 'Head of Accounts', 'Book Of Accounts',
          'Industry', 'Packages', 'Platform Settings', 'Features',
          'Currency', 'Users & Roles', 'Others']
      }
    ],
    TAX: {
      SALESTAX: [
        { 'taxname': '-', displayname: '-', 'taxvalue': 0 },
        { 'taxname': 'GST Output 5%', displayname: 'GST 5%', 'taxvalue': 5 },
        { 'taxname': 'GST Output 12%', displayname: 'GST 12%', 'taxvalue': 12 },
        { 'taxname': 'GST Output 18%', displayname: 'GST 18%', 'taxvalue': 18 },
        { 'taxname': 'GST Output 28%', displayname: 'GST 28%', 'taxvalue': 28 }
      ],
      PURCTAX: [
        { 'taxname': '-', displayname: '-', 'taxvalue': 0 },
        { 'taxname': 'GST Input 5%', displayname: 'GST 5%', 'taxvalue': 5 },
        { 'taxname': 'GST Input 12%', displayname: 'GST 12%', 'taxvalue': 12 },
        { 'taxname': 'GST Input 18%', displayname: 'GST 18%', 'taxvalue': 18 },
        { 'taxname': 'GST Input 28%', displayname: 'GST 28%', 'taxvalue': 28 }
      ]
    },
    TDSTAX: {
      TDSReceivable: "TDS Receivable",
      TDSPayable: "TDS Payable"
    },
    DISCOUNT: {
      SALESDISC: "Sales Discount",
      PURCDISC: "Purchase Discount",
    },
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
    API_URL: {
      //Locations API URL config
      // Auth api config
      AUTH: {
        SIGNIN: "tenant/login",
        SIGNUP: "tenant/register",
      },
      // country api config
      COUNTRY: {
        CREATE: "country/create",
        UPDATE: "country/upsert",
        FINDBYID: "country/findByID",
        FINDALL: "country/findAll",
        DELETE: "country/delete",
        LIST: "country/list"
      },
      // State api config
      STATE: {
        CREATE: "state/create",
        UPDATE: "state/upsert",
        FINDBYID: "state/findByID",
        FINDALL: "state/findAll",
        DELETE: "state/delete",
        LIST: "state/list"
      },
      // City api config
      CITY: {
        CREATE: "city/create",
        UPDATE: "city/upsert",
        FINDBYID: "city/findByID",
        FINDALL: "city/findAll",
        DELETE: "city/delete",
        LIST: "city/list"
      },
      INDUSTRY: {
        CREATE: "industry/create",
        UPDATE: "industry/upsert",
        FINDBYID: "industry/findByID",
        FINDALL: "industry/findAll",
        DELETE: "industry/delete",
        LIST: "industry/list"
      },
      PROFILE: {
        PASSWORD_CHANGE: "tenantuser/changepassword"
      },
      HEADS: {
        CREATE: "heads/create",
        UPDATE: "heads/update",
        FINDBYID: "heads/findByID",
        FINDALL: "heads/findAll",
        DELETE: "heads/delete"
      },
      // Currency api config
      CURRENCY: {
        CREATE: "currency/create",
        UPDATE: "currency/upsert",
        FINDBYID: "currency/findByID",
        FINDALL: "currency/findAll",
        DELETE: "currency/delete",
      },
      // tenanttax api config
      TAXES: {
        CREATE: "tenanttax/create",
        UPDATE: "tenanttax/upsert",
        FINDBYID: "tenanttax/findByID",
        FINDALL: "tenanttax/findAll",
        DELETE: "tenanttax/delete",
        GSTFINDALL: "taxmaster/findall"
      },
      // Roles and permissions api config
      ROLES: {
        CREATE: "roles/create",
        UPDATE: "roles/upsert",
        FINDBYID: "roles/findByID",
        FINDALL: "roles/findAll",
        DELETE: "roles/delete",
      },
      // Statff api config
      STAFF: {
        CREATE: "staff/create",
        UPDATE: "staff/upsert",
        FINDBYID: "staff/findByID",
        FINDALL: "staff/findAll",
        DELETE: "staff/delete",
      },

      TNT: {
        CREATE: "tenant/create",
        UPDATE: "tenant/upsert",
        FINDBYID: "tenant/findByID",
        FINDALL: "tenant/findAll",
        ACTIVATE: "tenant/activate",
        DASHBOAD: "tenant/dashboard",
        DASHBOARDCOUUNTS: "reports/recordscount",
        TNTSETTINGS: "tenant/tenantdetails",
        TENANTUPDATE: "tenant/tenantdetails_update"
      },
      ADV_RECEIPT: {
        CREATE: "receipts/advreccreate",
        INVDETAILS: "receipts/advdetails",
        ADVALLOCATE: "receipts/paymentmatch",
        ADVLIST: "receipts/advfindAll",
        GETADVINVDETAILS: "invoicedetail/advdetails",
        ADVRECUPDATE: "receipts/advupdate",
        RECEIPTUPDATE: "receipts/update"
      },
      TNT_SETTINGS: {
        CREATE: "tenantset/create",
        UPDATE: "tenantset/upsert",
        FINDBYID: "tenantset/findByID",
        FINDALL: "tenantset/findAll",
      },
      TNT_LICENCE: {
        // CREATE: "tenantlicen/create",
        CREATE: "invoice/create",
        UPDATE: "tenantlicen/upsert",
        DELETE: "tenantlicen/delete",
        FINDALL: "tenantlicen/findAll",
      },
      TNT_INVOICE: {
        INVOICE: "invoice/",
        CREATE: "invoice/create",
        UPDATE: "invoice/update",
        LIST: "invoice/list",
        GETBYID: "invoice/getbyid",
        // CREATE: "invoices/generate",
        // UPDATE: "invoices/upsert",
        DELETE: "invoices/delete",
        FINDALL: "invoice/findAll",
        DETAILS: "invoicedetail/findAll",
        INVOICEPAYMENT: "payments/create",
        SEQ: "generator/seqenceno",
        ACCCONFIG: "accconfig/findAll"

      },
      TNT_BILL: {
        CREATE: "bill/create",
        UPDATE: "bills/upsert",
        DELETE: "bills/delete",
        FINDALL: "bills/findAll",
        DETAILS: "billsdetails/findAll",
        BILLRECEIPT: "receipts/create",
        CREDITNOTE: "tenantnotes/create",
        PAYMENTRECEIPTLIST: "receipts/findAll",
        PAYMENTRECEIPTDETAILS: "receiptsdetails/findAll",
        PAYMENTDETAILS: "receiptsdetails/findByID"
      },
      TNT_JOURNAL: {
        CREATE: "journal/create",
        FINDBYID: "journal/findAll",
        DETAILS: "journaldetails/findAll",
        FEATURE: "codemaster/findall",
        CONFIG: "journal/config",
        UPDATE: "journal/updateFullJournal",
        LISTALL: "journal/details",
      },
      //  Tenant user URL API config
      TNTUSER: {
        CREATE: "tenantUsr/create",
        UPDATE: "tenantUsr/upsert",
        DELETE: "tenantUsr/delete",
        FINDALL: "tenantUsr/findAll",
      },
      REPORTS: {
        TB: "reports/trailbalance",
        PL: "reports/profitloss"
      },
      TNTUSER_SETTINS: {
        CREATE: "tenantUsrSet/create",
        UPDATE: "tenantUsrSet/upsert",
        DELETE: "tenantUsrSet/delete",
        FINDALL: "tenantUsrSet/findAll",
        FINDBYID: "tenantUsrSet/findByID",
      },
      // Tenant event URL API config
      TNT_EVENT: {
        CREATE: "tenantEvent/create",
        UPDATE: "tenantEvent/upsert",
        FINDALL: "tenantEvent/findAll",
        FINDBYID: "tenantEvent/findByID",
      },
      // book of accounts
      TNT_BOOKOFACCOUNTS: {
        CREATE: "booksofaccounts/create",
        UPDATE: "booksofaccounts/upsert",
        FINDALL: "booksofaccounts/findAll",
        FINDBYID: "booksofaccounts/findByID",
        DELETE: "booksofaccounts/delete",
      },
      TNT_HEADOFACCOUNTS: {
        CREATE: "heads/create",
        UPDATE: "heads/upsert",
        FINDALL: "heads/findAll",
        FINDBYID: "heads/findByID",
        DELETE: "heads/delete",
      },
      TNT_LEDGERSUMMARY: {
        CREATE: "ledgersummary/create",
        UPDATE: "ledgersummary/upsert",
        FINDALL: "ledgersummary/findAll",
        FINDBYID: "ledgersummary/findByID",
        DELETE: "ledgersummary/delete",
        NAMES: "report/ledgernames"
      },
      // Tenant user seetings URL API config
      TNTUSER_SETTINGS: {
        CREATE: "tenantUsrSet/create",
        UPDATE: "tenantUsrSet/upsert",
        DELETE: "tenantUsrSet/delete",
        FINDALL: "tenantUsrSet/findAll",
        FINDBYID: "tenantUsrSet/findByID",
      },
      TNT_BRANCH: {
        CREATE: "tenantbranch/create",
        UPDATE: "tenantbranch/upsert",
        FINDALL: "tenantbranch/findAll",
        FINDBYID: "tenantbranch/findByID",
        DELETE: "tenantbranch/delete",
      },
      //Tenant Products
      TNT_PRODUCTS: {
        CREATE: "products/create",
        UPDATE: "products/update",
        FINDALL: "products/list",
        FINDBYID: "products/findByID",
        DELETE: "products/delete",
        PROSEARCH: "products/search",
        HSNCODE: "products/hsn/list"
      },
      TNT_BRANDS: {
        CREATE: "brands/create",
        UPDATE: "brands/update",
        FINDALL: "brands/list",
        FINDBYID: "brands/findByID",
        DELETE: "brands/delete",
      },
      TNT_CATEGORY: {
        CREATE: "category/create",
        UPDATE: "category/update",
        FINDALL: "category/list",
        FINDBYID: "category/findByID",
        DELETE: "category/delete",
      },
      TNT_UOM: {
        CREATE: "uom/create",
        UPDATE: "uom/upsert",
        FINDALL: "uom/list",
        FINDBYID: "uom/findByID",
        DELETE: "uom/delete",
      },
      //Paymentterms
      PAYTERMS: {
        CREATE: "payterms/create",
        UPDATE: "payterms/upsert",
        FINDALL: "payterms/findAll",
        FINDBYID: "payterms/findByID",
        DELETE: "payterms/delete",
        RECPAYTERM: "codemaster/findall",
        RECPAYMODE: "receipts/pytmode"
      },
      //Contact
      CONTACT: {
        CREATE: "contact/create",
        UPDATE: "contacts/update",
        FINDALL: "contacts/findAll",
        FINDBYID: "contacts/findByID",
        DELETE: "contacts/delete",
        DROPLIST: "contacts/droplist",
        CRBILLGETALL: "report/drnotedetails",
        DRINVGETALL: "report/crnotedetails",
        PARTYSEARCH: "contacts/search",
        LIST: "contact/list"
      },
      //Tenant Contacts
      TNT_CONTACT: {
        CREATE: "tenantcontact/create",
        UPDATE: "tenantcontact/upsert",
        FINDALL: "tenantcontact/findAll",
        FINDBYID: "tenantcontact/findByID",
        DELETE: "tenantcontact/delete",
      },
      // book of accounts
      TNT_TRAILBALANCE: {
        CREATE: "booksofaccounts/create",
        UPDATE: "booksofaccounts/upsert",
        FINDALL: "booksofaccounts/findAll",
        FINDBYID: "booksofaccounts/findByID",
        DELETE: "booksofaccounts/delete",
      },
      TNT_BANK: {
        CREATE: "bankmaster/create",
        UPDATE: "bankmaster/update",
        FINDALL: "bankmaster/findall",
        FINDBYID: "bankmaster/findbyid",
        DELETE: "bankmaster/delete",
        LISTALL: "journal/details"
      },
      // books of accounts
      ACC_BOOKOFACCOUNTS: {
        CREATE: "bookOfAccount/create",
        UPDATE: "booksofaccounts/update",
        FINDALL: "booksofaccounts/findAll",
        FINDBYID: "booksofaccounts/findByID",
        DELETE: "booksofaccounts/delete",
        RECEIPT: "booksofaccounts/receipt",
        PAYMENT: "booksofaccounts/payment",
        PARTYBOOKS: "booksofaccounts/parties",
        LEDGERBOOKS: "booksofaccounts/ledger",
        BANKBOOK: "booksofaccounts/banks",
        LIST: "bookOfAccount/list"
      },
      NOTE_DETAILS: {
        "GETALL": "tenantnotes/findall"
      },
      TAX: {
        CREATE: "tax/create",
        UPDATE: "tax/update",
        FINDALL: "tax/findAll",
        FINDBYID: "tax/findByID",
        DELETE: "tax/delete",
      },
      LOGOUT:
      {
        LOGOUT: "tenant/logout"
      },
      // Report 
      REPORT: {
        TAX_SUMMARY_REPORT: {
          FINDALL: "report/taxsummary",
        },
        SALES_REGISTER_REPORT: {
          FINDALL: "report/sales",
        },
        PURCHASE_REGISTER_REPORT: {
          FINDALL: "report/purchase",
        },
        OUTSTANDING_RECEIPT: {
          FINDALL: "report/receipt",
        },
        OUTSTANDING_PAYMENT: {
          FINDALL: "report/payment",
        },
        DEBTOR_AGING_REPORT: {
          FINDALL: "report/debtors",
        },
        DAYBOOK_REPORT: {
          FINDALL: "report/daybook",
        },
        INVOICE:
        {
          GETALL: "report/invoices"
        },
        BILL:
        {
          GETALL: "report/bills"
        },
        RECEIPT_PAYMENT:
        {
          GETALL: "report/trascations"
        },
        BOOKSTRUCTURE: "heads/bookstructure",
        UPDATE: "tax/update",
        FINDALL: "tax/findAll",
        FINDBYID: "tax/findByID",
        DELETE: "tax/delete",
        BALANCESHEET: "report/balancesheet",
        PROFITLOSS: "report/profitloss",
        TRIALBALANCE: "report/trailbalance",
        LEDGER_REPORT: "report/ledger",
        LEDGER_REPORTS: "report/ledgers",
        PROFITLOSSREPORT: "report/profitloss",
        BRSGETALL: "brsdetails/findall",
        BRSREPORT: "report/brsdetails"

      },
      TNT_LEDGER: {
        FINDALL: "ledger/findAll",
        GETLEDGERDTL: "ledger/getDetails"
      },
    },
    SITECONFIG: {
      SUNDRY_C: {
        "accheadid": "9eb16ae2cda75e7f336a6e6220161227",
        "accheadname": "Sundry Creditors"
      },
      SUNDRY_D: {
        "accheadid": "620985adccf07463ca18b80320161227",
        "accheadname": "Sundry Debtors",
      }
    },
    CHART_SERVICE: {
      TOPCUSTOMERBYSELES: {
        GETTOPCUSTOMERBYSELES: "reports/getTopCustomersBySales"
      },
      CREDITSDEBITS: {
        GETCREDITSDEBITS: "reports/getTotalCreditsandDebits"
      },
      TAXSUMMARYREPORT: {
        GETTAXSUMMARYREPORT: "reports/getTaxSummaryReport "
      },
      INVOICELIST: {
        GETINVOICELIST: "reports/getInvoiceDuesReport"
      },
      BILLLIST: {
        GETBILLLIST: "reports/getOpenDueBillsReport"
      }
    },
    CHAT_CONFIG: {
      LIMIT: 6,
      LIST_PAGE_LIMIT: 10
    }

  }

});
