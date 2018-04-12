export const PrimengConstant = Object.freeze({
  DATATABLE: {
    NORECORDS: 'No matching records found, please try again with different search pattern.'
  },
  GLOBAL_ERROR: {
    SERVER_PROB_MSG_ENABLE: true,
    SERVER_PROBLEM: 'Sorry, something went wrong. Please try again later or contact support',
    DELETE_CONFIRM_MSG: 'Are you sure that you want to delete?',
    EDIT_CONFIRM_MSG: 'Are you sure that you want to update?'
  },
  EmptyMessage: {
    URL: '../assets/layout/images/no-records-5.jpg',
    DASHBOARDURL: '../assets/layout/images/no-records-square.jpg'
  },
  COMMON: {
    STATUES: ['Active', 'Inactive'],
    STATUS: {
      required: 'Status Required'
    },
    TRANS_STATUS: {
      DELETED: 'Deleted'
    },
    DROPDOWNS: {
      SELCT_CITY: 'Select City',
      SELCT_STATE: 'Select State',
      SELCT_COUNTRY: 'Select Country',
      SELCT_BANK: 'Select Bank',
      SELCT_GRP: 'Select Group',
      SELCT_INDUSTRY: 'Select Industry',
      SELCT_CONTACT_TYPE: 'Select Contact Type'
    },
    BUTTON_TXT: {
      SAVE: 'Save',
      UPDATE: 'Update'
    },
    PARTIES: ['Sundry Creditors', 'Sundry Debtors'],
    SUNDRY_DEBTORS: 'Sundry Debtors',
    SUNDRY_CREDITORS: 'Sundry Creditors',
    CUSTOMER: 'Customer',
    VENDOR: 'Vendor'
  },
  APP_SETTING: {
    GST_NO: {
      minlength: 'Please enter GST NO atleast 13 characters',
      maxlength: 'Please enter GST NO within 15 characters'
    },
    TIN_NO: {
      minlength: 'Please enter TIN atleast 9 characters',
      maxlength: 'Please enter TIN within 15 characters'
    }
  },
  // PRODUCT MASTER - Validation 
  PRODUCT: {
    ADDEDITFORM: {
      PROD_NAME: {
        required: 'Product Name Required',
        minlength: 'Product Name atleast 1 character',
        maxlength: 'Product Name not more than 50 characters'
      },
      PROD_MRP: {
        required: 'Price Required'
      },
      PROD_CODE: {
        required: 'Product code Required'
      },
      HSN_CODE: {
        required: 'HSN Code Required'
      },
      UOM: {
        required: 'UoM Required'
      },
      BRAND: {
        required: 'Brand Required'
      },
      CATEGORY: {
        required: 'Category Required'
      }
    },
    MESSAGES: {
      SAVE_SUCCESS: 'Product Created Successfully',
      UPDATE_SUCCESS: 'Product Updated Successfully',
    }
  },
  // BRAND MASTER - Validation
  BRAND: {
    ADDEDITFORM: {
      BRAND_NAME: {
        whitespace: 'Please enter Brand Name',
        required: 'Please enter Brand Name',
        minlength: 'Brand Name atleast 5 character',
        maxlength: 'Brand Name not more than 15 characters'
      }
    },
    MESSAGES: {
      SAVE_SUCCESS: 'Brand Created Successfully',
      UPDATE_SUCCESS: 'Brand Updated Successfully',
    }
  },
  // CATEGORY MASTER - Validation
  CATEGORY: {
    ADDEDITFORM: {
      CATEGORY_NAME: {
        whitespace: 'Please enter Category Name',
        required: 'Please enter Category Name',
        minlength: 'Category Name atleast 3 character',
        maxlength: 'Category Name not more than 15 characters'
      }
    },
    MESSAGES: {
      SAVE_SUCCESS: 'Category Created Successfully',
      UPDATE_SUCCESS: 'Category Updated Successfully',
    }
  },
  // BANK MASTER - Validation
  BANK: {
    ADDEDITFORM: {
      BANK_NAME: {
        required: 'Please Select Bank Name',
      },
      ACC_NO: {
        required: 'Please Enter Account Number',
      },
      IFSC_CODE: {
        required: 'Please Enter IFSC Code'
      },
      OPEN_BAL: {
        required: 'Please Enter Opening Balance'
      },
      OB_CRDR: {
        required: 'Please Select Cr/Dr'
      }
    },
    MESSAGES: {
      SAVE_SUCCESS: 'Bank Created Successfully',
      UPDATE_SUCCESS: 'Bank Updated Successfully',
    }
  },
  // PARTIES - Validation
  PARTIES: {
    ADDEDITFORM: {
      F_NAME: {
        required: 'Please enter name',
        minlength: 'Please enter name atleast 3 characters',
        maxlength: 'Please enter name within 50 characters'
      },
      ACCHEAD_NAME: {
        required: 'Please select Group'
      },
      EMAIL_ID: {
        pattern: 'Please enter the valid email-id'
      },
      COMPANY_NAME: {
        required: 'Please enter company name'
      },
      MOBILE_NO: {
        required: 'Please enter phone number',
        minlength: 'Please enter phone number atleast 10 characters',
        maxlength: 'Please enter phone number within 20 characters'
      },
      BILL_ADDR: {
        minlength: 'Please enter billing address atleast 10 characters',
        maxlength: 'Please enter billing address within 150 characters'
      },
      BILL_ZIP: {
        minlength: 'Please enter billing pin number atleast 4 characters',
        maxlength: 'Please enter billing pin number within 6 characters'
      },
      SHIP_ADDR: {
        minlength: 'Please enter shipping address atleast 10 characters',
        maxlength: 'Please enter shipping address within 150 characters'
      },
      SHIP_ZIP: {
        minlength: 'Please enter shipping pin number atleast 4 characters',
        maxlength: 'Please enter shipping pin number within 6 characters'
      },
      SOCIAL_IDS: {
        minlength: 'Please enter website atleast 5 characters',
        maxlength: 'Please enter website within 50 characters',
        pattern: 'Please enter valid website'
      },
      GST_NO: {
        minlength: 'Please enter GST NO atleast 3 characters',
        maxlength: 'Please enter GST NO within 15 characters',
        required: 'Please enter GST NO',
      },
      TIN_NO: {
        minlength: 'Please enter TIN atleast 3 characters',
        maxlength: 'Please enter TIN within 30 characters'
      },
      CONTACT_DEPT: {
        minlength: 'Please enter department atleast 3 characters',
        maxlength: 'Please enter department within 50 characters'
      },
      CONTACT_DESIGN: {
        minlength: 'Please enter designation atleast 3 characters',
        maxlength: 'Please enter designation within 50 characters'
      },
      CONTACT_TYPE: {
        required: 'Please enter contact type'
      }
    },
    MESSAGES: {
      SAVE_SUCCESS: 'Parties Created Successfully',
      UPDATE_SUCCESS: 'Parties Updated Successfully',
    }
  },
  // LEDGER 
  LEDGER: {
    ADDEDITFORM: {
      F_NAME: {
        whitespace: 'Please Enter Ledger Name',
        required: 'Please Enter Ledger Name',
        minlength: 'Please enter atleast 3 characters',
        maxlength: 'Please enter name within 50 characters'
      },
      ACC_HEAD_NAME: {
        required: 'Please Select Group'
      },
      OPEN_BAL: {
        whitespace: 'Please enter opening balance',
        required: 'Please enter opening balance',
      }
    },
    MESSAGES: {
      SAVE_SUCCESS: 'Ledger Created Successfully',
      UPDATE_SUCCESS: 'Ledger Updated Successfully',
    }
  },
  // INVOICE
  INVOICE: {
    ADDEDITFORM: {
      INVOICETYPE: 'Please select Invoice type.',
      INVOICEDATE: 'Please select Invoice date.',
      DATEPICKER: 'Invoice Date must be smaller than Due Date',
      SUCCESS: 'Invoice Created Successfully',
      INVOICE_NO: 'Please Enter Invoice Number'
    }

  },
  // BILL
  BILL: {
    ADDEDITFORM: {
      BILLTYPE: 'Please select Bill type.',
      BILLDATE: 'Please select Bill date.',
      DATEPICKER: 'Bill Date must be smaller than Due Date',
      SUCCESS: 'Bill Created Successfully',
      BILL_NO: 'Please Enter Bill Number'
    }
  },
  // RECIPT
  RECIPT: {
    ADDEDITFORM: {
      RECEIPTAMOUNT: 'Please enter receipt amount',
      NOINVOICE: 'No invoices available for this contact',
      NOTAPPLIED: 'Your amount not applied to any invoice'
    }
  },
  PAYMENT: {
    ADDEDITFORM: {
      PAYMENTAMOUNT: 'Please enter payment amount',
      NOBILLS: 'No bills available for this contact',
      NOTAPPLIED: 'Your amount not applied to any bill',
      TRANS_NUMBER: 'Please Enter Transaction Number'
    }
  },
  // COMMON MESSAGE IN TRANSACTION
  COMMONTRANSACTION: {
    CUSTOMER: 'Please select Customer.',
    PARTICULAR: 'Please Enter Particulars.',
    PLACESUPPLY: 'Please select place of supply.',
    REVERSECHARGE: 'Please reverse charge mode.',
    DUEDATE: 'Please select Due date.',
    TAX: 'Please select Tax.',
    QUANTITY: 'Please select quantity.',
    COST: 'Please enter Cost',
    HSNCODE: 'Please enter HSN Code',
    PAYMENTMODE: 'Please select payment mode',
    ACCOUNT: 'Please select account',
    DATE: 'Please select date',
    CONTACT: 'Please Select Contact',
    VENDOR: 'Please select vendor',
    ADVANCEAMOUNT: 'Your amount should not greater than advance amount',
    NOTAPPLIEDTOINVOICE: 'Your Amount not applied to any invoices',
    SELECTBANK: 'Please Select Bank',
    DROPDOWN: 'Please choose from the dropDwon menu',
    AMOUNT: 'Please Enter Amount',
    ENTERAMOUNT: 'Please Click Product Details',
    SEQNO: 'Please Enter Transaction Number',
    REASON:'Please select the reason type'
  },
  COMMONREG: {
    FROMDATE: 'Select From Date',
    TODATE: 'Select To Date',
    LEDGERDATE: 'Select Date',
    VALIDDATE: 'Start date should be smaller than to date',
    LEDGER: 'Please select ledger'
  },
  // BRSUPLOAD
  BRSUPLOAD: {
    INVALIDUPLOAD: 'Invalid csv upload',
    FAILEDUPLOAD: 'Failed to load file',
    SUCCESSUPLOAD: 'CSV upload successfully'
  },
  // JOURNAL
  JOURNALS: {
    ALREADYEXIST: 'Account Type Already Selected',
    CHOOSEACC: 'Please Choose Account',
    SAMETOTAL: 'Credit and Debit total must be same',
    TALLYAMOUNT: 'Please tally credit and debit amount',
    DELETESUCCESS: 'Deleted Successfully',
    DELETEFAILED: 'Updation Failed,Please try again',
    ENTER_AMT: 'Please enter amount'
  },
  DEBITNOTE: {
    NOBILL: 'Bill numbers list not found',
    SELECTBILLNO: 'Please select a bill number'
  },
  CREDITNOTE: {
    NOINVOICE: 'Invoice numbers list not found',
    SELECTINVOICENO: 'Please select a invoice number'
  },
  SEQ_ERROR: "Sequence Number cannot be decreased",
  // Autocompleted empty message
  AUTOCOMPLETE: {
    EMPTYMESSAGE: 'No Data Found',
    CREDITNOTE_invoice: 'No invoices found for this customer',
    CUSTOMER: 'No Customer Found'
  },
  // Key Combinations
  SHORTCUTKEYS: {
    ENTER: 'enter',
    HELP: { KEY: 'shift+h', TXT: 'Show Help Document' },
    HOME: { KEY: 'shift+d', TXT: 'Goto Dashboard' },
    COMMON: {
      ADD: { KEY: 'shift+a', TXT: 'Show Add Form' },
      CLOSE: { KEY: 'shift+x', TXT: 'Close' },
      SAVE: { KEY: 'shift+s', TXT: 'Save' },
      DOWNLOAD: { KEY: 'shift+d', TXT: 'Download' },
    },
    ADD: {
      INVOICE: { KEY: 'shift+i', TXT: 'Add New Invoice' },
      BILL: { KEY: 'shift+b', TXT: 'Add New Bill' },
      PAYMENT: { KEY: 'shift+p', TXT: 'Add New Payment' },
      RECEIPT: { KEY: 'shift+r', TXT: 'Add New Receipt' },
      JOURNALS: { KEY: 'shift+j', TXT: 'Add New Journal' },
      VENDOR_ADV: { KEY: 'shift+v', TXT: 'Add New Vendor Advance' },
      CUSTOMER_ADV: { KEY: 'shift+c', TXT: 'Add New Customer Advance' },
      PRODUCT: { KEY: 'ctrl+shift+p', TXT: 'Add New Product' },
      BANK: {
        WITHDRAW: 'shift+w',
        TRANSFER: 'shift+t',
        DEPOSIT: 'shift+d'
      }
    },
    GETSTARTED: {
      VIEW: { KEY: 'shift+g', TXT: 'Goto Get Started' },
      APP_SETTINGS: { KEY: 'ctrl+shift+a', TXT: 'Goto Application Settings' },
      CONTACTS: { KEY: 'ctrl+shift+c', TXT: 'Goto Contacts' },
      BRANDS: { KEY: 'ctrl+shift+b', TXT: 'Goto Brands' },
      CATEGORY: { KEY: 'ctrl+shift+y', TXT: 'Goto Category' },
      LEDGERS: { KEY: 'ctrl+shift+l', TXT: 'Goto Ledgers' },
      BANK: { KEY: 'ctrl+shift+k', TXT: 'Goto Bank' },
      SEQUENCESETTINGS: { KEY: 'ctrl+shift+s', TXT: 'Goto Sequence Settings' },
    },
    TRANSACTION: {
      PRODUCT: { KEY: 'shift+p', TXT: 'Add New Product' },
      CONTACTS: { KEY: 'shift+c', TXT: 'Add New Contacts' },
      CATEGORY: { KEY: 'shift+y', TXT: 'Add New Category' },
      BRAND: { KEY: 'shift+b', TXT: 'Add New Brand' },
    },
    REPORT: {
      VIEW: { KEY: 'shift+e', TXT: 'Goto Report List' },
      BS: { KEY: 'ctrl+alt+b', TXT: 'Goto Balance Sheet' },
      PL: { KEY: 'ctrl+alt+p', TXT: 'Goto Profil & Loss Report' },
      TBG: { KEY: 'ctrl+alt+t', TXT: 'Goto Trail balance - Groups' },
      TBL: { KEY: 'ctrl+alt+l', TXT: 'Goto Trail balance - Ledgers' },
      DAY_BK:{KEY: 'ctrl+alt+d', TXT: 'Goto Day Book'},
      LEDGER: { KEY: 'alt+shift+l', TXT: 'Goto Ledgers' },
      INV_REG: { KEY: 'alt+shift+i', TXT: 'Goto Invoice Register' },
      BILL_REG: { KEY: 'alt+shift+b', TXT: 'Goto Bill Register' },
      REC_REG: { KEY: 'alt+shift+r', TXT: 'Goto Receipt Register' },
      PYMT_REG: { KEY: 'alt+shift+p', TXT: 'Goto Payment Register' },
      TX_SMRY: { KEY: 'alt+shift+t', TXT: 'Goto Tax summary' },
      BRS: { KEY: 'alt+shift+s', TXT: 'Goto BRS Report' },
      INV_TAX:{KEY: 'alt+shift+x', TXT: 'Goto Invoice Taxation'},
      BILL_TAX:{KEY: 'alt+shift+y', TXT: 'Goto Bill Taxation'},
      OUT_INV:{KEY: 'alt+shift+v', TXT: 'Goto Outstanding Invoices'},
      OUT_PAY:{KEY: 'alt+shift+o', TXT: 'Goto Outstanding Payments'},
      CREDIT_REG:{KEY: 'alt+shift+c', TXT: 'Goto Credit Note Register'},
      DEBIT_REG:{KEY: 'alt+shift+d', TXT: 'Goto Debit Note Register'},
      JOURNAL_REG:{KEY: 'alt+shift+j', TXT: 'Goto Journal Register'}
      
    }
  },
  // SUBLEDGER MASTER - Validation
  SUBLEDGER: {
    ADDEDITFORM: {
      SUBLEDGER_NAME: {
        whitespace: 'Please enter book Name',
        required: 'Please enter book Name',
      },
      ACC_NAME: {
        whitespace: 'Please select group',
        required: 'Please select group',
      },
      OPEN_BAL: {
        whitespace: 'Please enter opening balance',
        required: 'Please enter opening balance',
      },
      CRDR: {
        whitespace: 'Please choose Credit/Debit',
        required: 'Please choose Credit/Debit',
      }
    },
    MESSAGES: {
      SAVE_SUCCESS: 'Created Successfully',
      UPDATE_SUCCESS: 'Updated Successfully',
    }
  },
});
