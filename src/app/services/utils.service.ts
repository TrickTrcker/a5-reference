/*
 * Copyright (c) 2017 GNTS Technologies Pvt. Ltd
 *
 * Author: K.Saravana Kumar
 */

import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { PrimengConstant } from '../app.primeconfig';
import { FormControl } from '@angular/forms';
import { saveAs } from 'file-saver/FileSaver';
import { AppConstant } from '../app.constant';
import { DateformatPipe } from '../pipes/dateformat.pipe';

@Injectable()
export class UtilsService {
  public date_apiformat = AppConstant.API_CONFIG.ANG_DATE.displaydtime
  constructor(private dateFormatPipeFilter: DateformatPipe) {
  };
  NoWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }
  isUndefinedReturner(value, suffix) {
    var rValue = '';
    if (!_.isNull(value) && !_.isUndefined(value)) {
      rValue = value + suffix;
    }
    return rValue;
  }

  prepareReportParams(data: any) {
    var initialParams;
    var reqParams;
    var objectLength = Object.keys(data).length;
    for (var i = 0; i < objectLength; i++) {
      initialParams = Object.keys(data)[i] + ':' + (<any>Object).values(data)[i];
      if (i == objectLength - 1) {
        reqParams += initialParams
      }
      else if (i == 0) {
        reqParams = initialParams + '~'
      }
      else {
        reqParams += initialParams + '~'
      }
    }
    return reqParams;
  }
  ledger_formater(bookofaccount: any, ledgerdata: any) {
    var bk_ob: number = 0, bk_cb: number = 0,
      bk_cr: number = 0, bk_dr: number = 0;
    var ldgr_tb_data = _.map(bookofaccount, function (sub_accmap: any) {
      var lgr_crdr = sub_accmap.crdr, lgr_ob: number = 0, lgr_cb: number = 0,
        lgr_cr: number = 0, lgr_dr: number = 0, lgr_pcr: number = 0, lgr_pdr: number = 0;

      var ledger: any = _.find(ledgerdata, { 'accountname': sub_accmap.subaccheadname });
      if (!_.isEmpty(ledger)) {
        lgr_crdr = ledger.crdr;
        lgr_ob = +ledger.opening;
        lgr_cb = +ledger.closing;
        lgr_cr = +ledger.credit;
        lgr_dr = +ledger.debit;
      }
      bk_ob = bk_ob + lgr_ob;
      bk_cb = bk_cb + lgr_cb;
      bk_cr = bk_cr + lgr_cr;
      bk_dr = bk_dr + lgr_dr;
      // account opbalance,cr,dr calc
      return { // level 1 tree - account grop list
        'accountname': sub_accmap.subaccheadname,
        'accountid': sub_accmap.subaccheadid,
        'openingbalance': lgr_ob,
        'closingbalance': lgr_cb,
        'credit': lgr_cr,
        'debit': lgr_dr,
        'pcredit': 0,
        'pdebit': 0,
        'crdr': lgr_crdr,
        'level': 2,
        'accheadid': sub_accmap.accheadid,
        'accheadname': sub_accmap.accheadname,
        'transactions': [],
        'transactionloaded': false
      }
    });
    return {
      data: ldgr_tb_data,
      openingbalance: bk_ob,
      closingbalance: bk_cb,
      debit: bk_dr,
      credit: bk_cr
    };
  }
  ledgerLevlTrans_formater(bookofaccount: any,prledger : any, ledgerdata: any) {
    var bk_ob: number = 0, bk_cb: number = 0,
      bk_cr: number = 0, bk_dr: number = 0;
      var childrenbooks = _.filter(bookofaccount,{"accheadid" : prledger.subaccheadid });
    var ldgr_tb_data = _.map(childrenbooks, function (sub_accmap: any) {
      var lgr_crdr = sub_accmap.crdr, lgr_ob: number = 0, lgr_cb: number = 0,
        lgr_cr: number = 0, lgr_dr: number = 0, lgr_pcr: number = 0, lgr_pdr: number = 0;
      var ledgerchild = [],lstLgr_dr : number =0,lstLgr_cr : number =0,lstLgr_ob : number =0,lstLgr_cb : number =0;
      var ledger: any = _.find(ledgerdata, { 'accountname': sub_accmap.subaccheadname });
      if (!_.isEmpty(ledger)) {
        lgr_crdr = ledger.crdr;
        lgr_ob = +ledger.opening;
        lgr_cb = +ledger.closing;
        lgr_cr = +ledger.credit;
        lgr_dr = +ledger.debit;
      }
      
      var least_ledger : any = _.filter(ledgerdata, (l)=> {
        return(l.accheadid ==sub_accmap.subaccheadid &&  l.leadaccheadid == prledger.subaccheadid &&  prledger.type == "Ledger" );
       });
      if(least_ledger.length > 0)
      {
        _.forEach (least_ledger,(lstldgr)=> {
  

          ledgerchild.push(lstldgr);
          lstLgr_dr += parseInt(lstldgr.debit);
          lstLgr_cr += parseInt(lstldgr.credit);
        });
        lgr_cr += (+lstLgr_cr);
        lgr_dr += (+lstLgr_dr);
      }
      bk_ob = bk_ob + lgr_ob;
      bk_cb = bk_cb + lgr_cb;
      bk_cr = bk_cr + lgr_cr;
      bk_dr = bk_dr + lgr_dr;
      // account opbalance,cr,dr calc
      return { // level 1 tree - account grop list
        'accountname': sub_accmap.subaccheadname,
        'accountid': sub_accmap.subaccheadid,
        'openingbalance': lgr_ob,
        'closingbalance': lgr_cb,
        'credit': lgr_cr,
        'debit': lgr_dr,
        'pcredit': 0,
        'pdebit': 0,
        'crdr': lgr_crdr,
        'level': 3,
        'accheadid': sub_accmap.accheadid,
        'accheadname': sub_accmap.accheadname,
        'transactions': ledgerchild,
        'transactionloaded': false,
      }
    });
    return {
      data: ldgr_tb_data,
      openingbalance: bk_ob,
      closingbalance: bk_cb,
      debit: bk_dr,
      credit: bk_cr
    };
  }
  tbtree_formater(head: any, level1: any, ledgerdata: any, ledgerCalc: any, feature: any) {
    var tfeature = { feature: 'BS', 'prevyear': false };
    tfeature.prevyear = feature.prevyear ? feature.prevyear : false;
    var return_data = [];
    var headtree = _.groupBy(head, function (h: any) {
      return h.prntaccheadid;
    });
    var flatedArray = [];
    var total_ob: number = 0, total_cb: number = 0, total_cr: number = 0, total_dr: number = 0;
    _.forEach(headtree, function (headlevel: any, f_key: any) {
      var h_tree: any = {
        'data': {
          'accountname': headlevel[0].prntaccheadname,
          'openingbalance': 0,
          'credit': 0,
          'debit': 0,
          'pcredit': 0,
          'pdebit': 0,
          'closingbalance': 0,
          'crdr': '-',
          'level': 0
        },
        'children': []
      };
      var ah_crdr = '-', ah_ob: number = 0, ah_cb: number = 0, ah_cr: number = 0, ah_dr: number = 0, ah_pcr: number = 0, ah_pdr: number = 0;
      h_tree.children = _.map(headlevel, function (acc: any) { //map and restructure the head level data based on gruped head id
        var ac_crdr = acc.crdr, ac_ob: number = 0, ac_cb: number = 0,
          ac_cr: number = 0, ac_dr: number = 0, ac_pcr: number = 0, ac_pdr: number = 0;
        var bookofaccount = _.filter(level1, function (sub_acc: any) {
          return (sub_acc.accheadid == acc.accheadid && sub_acc.type == "Ledger") // filter acchead by accheadid in allbookof accounts
        });
        var mapped_subacc_rpt = _.map(bookofaccount, function (sub_accmap: any) {
          var lgr_crdr = sub_accmap.crdr, lgr_ob: number = 0, lgr_cb: number = 0,
            lgr_cr: number = 0, lgr_dr: number = 0, lgr_pcr: number = 0, lgr_pdr: number = 0,
            lstLgr_cr=0,lstLgr_dr=0,lstLgr_ob=0,lstLgr_cb=0;
            var ledgerchild:any=[];
          if (ledgerCalc) {
            var ledger: any = _.find(ledgerdata, { 'accountname': sub_accmap.subaccheadname });
            if (!_.isEmpty(ledger)) {

              if (tfeature.prevyear) {
                if(ledger.prevcd)
                {
                  var splitted = ledger.prevcd.split('|');
                  if (splitted.length > 1) {
                    lgr_pdr += + splitted[0];
                    lgr_pcr += + splitted[1];
                  }
                }
              }
              lgr_crdr = ledger.crdr;
              lgr_ob = +ledger.opening;
              lgr_cb = +ledger.closing;
              lgr_cr = +ledger.credit;
              lgr_dr = +ledger.debit;
            }
            var least_ledger : any = _.filter(ledgerdata, (l)=> {
              return(l.leadaccheadid == sub_accmap.subaccheadid && sub_accmap.accheadid == l.prntaccheadid && sub_accmap.type == "Ledger" );
             });
            if(least_ledger.length > 0)
            {
             
              _.forEach (least_ledger,(lstldgr)=> {
                var level3_tree = { // level 1 tree - account grop list
                  'accountname': lstldgr.accountname,
                  'accountid': lstldgr.accheadid,
                  'openingbalance': lstldgr.opening,
                  'closingbalance': lstldgr.opening,
                  'credit': lstldgr.credit,
                  'debit': lstldgr.debit,
                  'pcredit': 0,
                  'pdebit': 0,
                  'crdr': lstldgr.crdr,
                  'level': 3,
                  'prntaccheadname': lstldgr.prntaccheadname,
                  'prntaccheadid': lstldgr.prntaccheadid,
                  'accheadid': sub_accmap.accheadid,
                  'accheadname': sub_accmap.accheadname
                }
                var childdata = {
                  'data': level3_tree,
                  'children': undefined,
                  'prntaccheadname': lstldgr.prntaccheadname,
                  'prntaccheadid': lstldgr.prntaccheadid,
                  'accheadid': sub_accmap.accheadid,
                  'accheadname': sub_accmap.accheadname
                };
                ledgerchild.push(childdata);
                lstLgr_dr += parseInt(lstldgr.debit);
                lstLgr_cr += parseInt(lstldgr.credit);
                lstLgr_ob += parseInt(lstldgr.opening);
                lstLgr_cb += parseInt(lstldgr.closing);
              });
              lgr_ob += (+lstLgr_ob);
              lgr_cb += (+lstLgr_cb);
              lgr_cr += (+lstLgr_cr);
              lgr_dr += (+lstLgr_dr);
            }
          }

          // account opbalance,cr,dr calc
          ac_ob += +lgr_ob;
          ac_cb += +lgr_cb;
          ac_cr += +lgr_cr;
          ac_dr += +lgr_dr;
          ac_pcr += +lgr_pcr;
          ac_pdr += +lgr_pdr;
          var level2_tree = { // level 1 tree - account grop list
            'accountname': sub_accmap.subaccheadname,
            'accountid': sub_accmap.subaccheadid,
            'openingbalance': lgr_ob,
            'closingbalance': lgr_cb,
            'credit': lgr_cr,
            'debit': lgr_dr,
            'pcredit': 0,
            'pdebit': 0,
            'crdr': lgr_crdr,
            'level': 2,
            'prntaccheadname': acc.prntaccheadname,
            'prntaccheadid': acc.prntaccheadid,
            'accheadid': acc.accheadid,
            'accheadname': acc.accheadname
          }
          return {
            'data': level2_tree,
            'children': ledgerchild,
            'prntaccheadname': acc.prntaccheadname,
            'prntaccheadid': acc.prntaccheadid,
            'accheadid': acc.accheadid,
            'accheadname': acc.accheadname
          };
        });
        var level1_tree = { // level 1 tree - account grop list
          'accountname': acc.accheadname,
          'openingbalance': ac_ob,
          'closingbalance': ac_cb,
          'credit': ac_cr,
          'debit': ac_dr,
          'crdr': ac_crdr,
          'pcredit': ac_pcr,
          'pdebit': ac_pdr,
          'level': 1,
          'prntaccheadname': acc.prntaccheadname,
          'prntaccheadid': acc.prntaccheadid,
          'accheadid': acc.accheadid,
          'accheadname': acc.accheadname
        }
        // account head opbalance,cr,dr calc
        ah_ob += +ac_ob;
        ah_cb += +ac_cb;
        ah_cr += +ac_cr;
        ah_dr += +ac_dr;
        ah_pcr += +ac_pcr;
        ah_pdr += +ac_pdr;

        var returndata = {
          'data': level1_tree,
          'children': mapped_subacc_rpt,
          'prntaccheadname': acc.prntaccheadname,
          'prntaccheadid': acc.prntaccheadid,
          'accheadid': acc.accheadid,
          'accheadname': acc.accheadname
        };
        flatedArray.push(returndata);
        return returndata;

      });
      h_tree.data.openingbalance += +ah_ob, h_tree.data.closingbalance += +ah_cb;
      h_tree.data.credit += +ah_cr, h_tree.data.debit += +ah_dr, h_tree.data.pcredit += +ah_pcr, h_tree.data.pdebit += +ah_pdr;
      total_ob += + ah_ob;
      total_cb += + ah_cb;
      total_cr += + ah_cr;
      total_dr += + ah_dr;
      return_data.push(h_tree);
    });
    return {
      'data': return_data,
      'openingtoal': total_ob,
      'closingtotal': total_cb,
      'ctotal': total_cr,
      'dtotal': total_dr,
      'pcredit': 0,
      'pdebit': 0,
      'flatedArray': flatedArray
    };

  }
  chartofaccounts_treeformater(head, level1) {

    var return_data = [];
    var headtree = _.groupBy(head, function (h: any) {
      return h.prntaccheadid;
    });
    var flatedArray = [];

    _.forEach(headtree, function (headlevel: any, f_key: any) {
      var h_tree: any = {
        'data': {
          'accountname': headlevel[0].prntaccheadname,
          'accountgroup': headlevel[0].accgroup,
          'accounttype': headlevel[0].prntaccheadname,
          'alie': headlevel[0].ALIE,
          'crdr': '-',
        },
        'children': []
      };
      var ah_crdr = '-';
      h_tree.children = _.map(headlevel, function (acc: any) { //map and restructure the head level data based on gruped head id
        var ac_crdr = acc.crdr;
        var acchead = _.filter(level1, function (sub_acc: any) {
          return (sub_acc.accheadid == acc.accheadid) // filter acchead by accheadid in allbookof accounts
        });
        var mapped_subacc_rpt = _.map(acchead, function (sub_accmap: any) {
          var lgr_crdr = sub_accmap.crdr, lgr_ob: number = 0, lgr_cb: number = 0, lgr_cr: number = 0, lgr_dr: number = 0;
          // account opbalance,cr,dr calc
          var ledgerchild:any=[];
          var least_ledger : any = _.filter(level1, (l)=> {
            return(l.accheadid == sub_accmap.subaccheadid);
           });
          if(least_ledger.length > 0)
          {
           
            _.forEach (least_ledger,(lstldgr)=> {
              var level3_tree = { // level 1 tree - account grop list
                'accountname': lstldgr.subaccheadname,
                'crdr': lstldgr.crdr,
                'level': 3,
                'prntaccheadname': lstldgr.accheadname,
                'prntaccheadid': lstldgr.accheadid,
                'accheadid': sub_accmap.accheadid,
                'accheadname': sub_accmap.accheadname,
                'accountgroup': headlevel[0].accgroup,
                'accounttype': headlevel[0].prntaccheadname,
                'alie': headlevel[0].ALIE,
              }
              var childdata = {
                'data': level3_tree,
                'children': undefined,
                'prntaccheadname': lstldgr.prntaccheadname,
                'prntaccheadid': lstldgr.prntaccheadid,
                'accheadid': sub_accmap.accheadid,
                'accheadname': sub_accmap.accheadname,
                'accountgroup': headlevel[0].accgroup,
                'accounttype': headlevel[0].prntaccheadname,
                'alie': headlevel[0].ALIE,
              };
              ledgerchild.push(childdata);

            });

          }
          var level2_tree = { // level 1 tree - account grop list
            'accountname': sub_accmap.subaccheadname,
            'crdr': lgr_crdr,
            'level': 2,
            'prntaccheadname': acc.prntaccheadname,
            'prntaccheadid': acc.prntaccheadid,
            'accheadid': acc.accheadid,
            'accheadname': acc.accheadname,
            'accountgroup': headlevel[0].accgroup,
            'accounttype': headlevel[0].prntaccheadname,
            'alie': headlevel[0].ALIE,
          }
          return {
            'data': level2_tree,
            'children': ledgerchild,
            'prntaccheadname': acc.prntaccheadname,
            'prntaccheadid': acc.prntaccheadid,
            'accheadid': acc.accheadid,
            'accheadname': acc.accheadname,
            'accountgroup': headlevel[0].accgroup,
            'accounttype': headlevel[0].prntaccheadname,
            'alie': headlevel[0].ALIE,
          };
        });
        var level1_tree = { // level 1 tree - account grop list
          'accountname': acc.accheadname,
          'crdr': ac_crdr,
          'level': 1,
          'prntaccheadname': acc.prntaccheadname,
          'prntaccheadid': acc.prntaccheadid,
          'accheadid': acc.accheadid,
          'accheadname': acc.accheadname,
          'accountgroup': headlevel[0].accgroup,
          'accounttype': headlevel[0].prntaccheadname,
          'alie': headlevel[0].ALIE,
        }
        var returndata = {
          'data': level1_tree,
          'children': mapped_subacc_rpt,
          'prntaccheadname': acc.prntaccheadname,
          'prntaccheadid': acc.prntaccheadid,
          'accheadid': acc.accheadid,
          'accheadname': acc.accheadname,
          'accountgroup': headlevel[0].accgroup,
          'accounttype': headlevel[0].prntaccheadname,
          'alie': headlevel[0].ALIE,
        };
        flatedArray.push(returndata);
        return returndata;

      });
      return_data.push(h_tree);
    });
    return {
      'data': return_data,
      'flatedArray': flatedArray
    };

  }
  compare_arraychanges(newArray, sourceArray) {
    var inserted = [];
    var deleted = [];
    var updated = [];
    return _.difference(newArray, sourceArray);
    // _.forEach(newArray, function (sItem:any) {
    //     _.find(sourceArray, function(v:any) { 
    //         return (v.prodid = sItem.prodid);
    //      });
    //   });
  }
  formatobjectArray(headerArray, dataArray) {
    var returndata = [];

    var filterdata = _.map(dataArray, function (orgdata) {
      var tempdata: any = {};
      _.forEach(headerArray, function (value, key) {

        if (!_.isEmpty(orgdata)) {
          value = value.toLowerCase()
          console.log('typeof', typeof orgdata[key]);
          tempdata[value] = orgdata[key];
        }
      });
      if (!_.isEmpty(tempdata)) {
        return tempdata;
      }

    });
    var formatedvalue = _.filter(filterdata, function (data) {
      return (!_.isEmpty(data))
    });
    console.log('formateddata', formatedvalue);
    return formatedvalue;

  }
  allowNumberOnly(event) {
    let e = event;
    e.cancelBubble = true;
    console.log('key', e.keyCode);
    var regexStr: any = '^[0-9]';
    var val = e.target.value;
    var ln = e.target.value.length;
    var dinx = e.target.value.indexOf('.');
    if (e.target.value.length >= 16) {
      if (dinx > -1) {
        if ((ln - dinx) > 2) {
          e.preventDefault();
        }
      }
      else {
        e.preventDefault();
      }
    }
    if ([8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode == 65 && e.ctrlKey === true) ||
      // Allow: Ctrl+C
      (e.keyCode == 67 && e.ctrlKey === true) ||
      // Allow: Ctrl+V
      (e.keyCode == 86 && e.ctrlKey === true) ||
      // Allow: Ctrl+X
      (e.keyCode == 88 && e.ctrlKey === true)
      //  ||
      // // Allow: home, end, left, right
      // (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      // let it happen, don't do anything
      return;
    }
    var decimal_allow = true;

    if (e.key === '.') // de
    {
      if (e.target.value.indexOf('.') == -1) {
        return;
      }
      else {
        e.preventDefault();
      }
    }
    var twodecimalAllow = true;
    // let ch = String.fromCharCode(e.keyCode);
    let ch = e.key;
    let regEx = new RegExp(regexStr);
    if (e.target.value.indexOf('.') > -1 && ((e.target.value.length - e.target.value.indexOf('.')) > 2) && !regEx.test(ch)) {
      twodecimalAllow = false;
    }

    if (regEx.test(ch) && twodecimalAllow)
      return;
    else
      e.preventDefault();

  }
  allowNumberOnlyWithoutDecimal(event) {
    let e = event;
    console.log('key', e.keyCode);
    var regexStr: any = '^[0-9]*$';
    if ([8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode == 65 && e.ctrlKey === true) ||
      // Allow: Ctrl+C
      (e.keyCode == 67 && e.ctrlKey === true) ||
      // Allow: Ctrl+V
      (e.keyCode == 86 && e.ctrlKey === true) ||
      // Allow: Ctrl+X
      (e.keyCode == 88 && e.ctrlKey === true)
      // ||
      // // Allow: home, end, left, right
      // (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      // let it happen, don't do anything
      return;
    }
    var decimal_allow = true;

    if (e.key === '.') // de
    {
      e.preventDefault();
    }

    // let ch = String.fromCharCode(e.keyCode);
    let ch = e.key;
    let regEx = new RegExp(regexStr);
    if (regEx.test(ch))
      return;
    else
      e.preventDefault();

  }
  idEqualSingleArray(source, destination) {
    var v: boolean = true;
    _.forEach(source, function (ddata) {
      var exisit: any = _.find(destination, function (cdata) {
        return (ddata == cdata)
      });
      if (_.isEmpty(exisit)) {
        v = false;
      }
    });
    return v;
  }
  resetdatatableFilter(ledgerlisttable, show, btnid) {
    console.log('ledger list table', ledgerlisttable);
    let btn = $('#' + btnid)[0].children[0];
    if (show == true) {
      ledgerlisttable.reset();
      $(btn).removeClass('fa-close').addClass('fa-search');
      show = false;
    }
    else {
      $(btn).removeClass('fa-search').addClass('fa-close');
      show = true;
    }
    if (ledgerlisttable.value.length > 0) {
      ledgerlisttable.emptyMessage = PrimengConstant.DATATABLE.NORECORDS;
    }
    return show;
  }
  deactivate_multitab(sourcearrry, event, addTab, key) {
    console.log(event);
    var i = event.index - 1;
    sourcearrry.splice(i, 1);
    addTab.tabs = _.map(addTab.tabs, function (data: any) {
      data.selected = false;
      return data;
    });
    addTab.tabs[0].selected = true;
  }
  activate_multitab(sourcearrry, item, addTab, key) {
    var filterdata: any;
    var tabinsertion: string = 'first';
    if (typeof item['tabinsertion'] != 'undefined') {
      tabinsertion = item['tabinsertion'];
    }
    if (sourcearrry.length > 0) {
      if (addTab.tabs[1]) {
        filterdata = _.find(sourcearrry, function (res: any) {
          return (item[key] == res[key])
        });

        if (filterdata == undefined || _.isEmpty(filterdata)) {
          var activeindex = 1;
          if (tabinsertion == 'first') {
            activeindex = 1;
            sourcearrry.unshift(item);
          }
          else {
            sourcearrry.push(item);
            activeindex = sourcearrry.length;
          }
          // addTab.activeIndex = activeindex;
          // addTab.tabs[activeindex].selected = true;
          this.settimeforChangeTabindex(activeindex, addTab);
        }
        else {
          var i = sourcearrry.indexOf(filterdata);
          this.settimeforChangeTabindex(i + 1, addTab);
        }
      }
    }
    else {
      sourcearrry.push(item);
      this.settimeforChangeTabindex(1, addTab);
    }
  }

  settimeforChangeTabindex(i, addTab) {
    setTimeout(() => {
      addTab.activeIndex = i;
      addTab.tabs = _.map(addTab.tabs, function (data: any) {
        data.selected = false;
        return data;
      });
      addTab.tabs[i].selected = true;
      // addTabViewdeposite=[... addTabViewdeposite]
    }, 0);
  }
  active_addAndeditTab(listTabs, key) {
    if (listTabs.tabs[1]) {
      if (listTabs.tabs[1].header == key) {
        listTabs.activeIndex = 1;
      } else {
        var tabs: any[] = [];
        tabs.push(listTabs.tabs[0]);
        listTabs.tabs = tabs;
        listTabs.tabs[0].selected = false;
        listTabs.activeIndex = 1;
      }
    } else {
      listTabs.activeIndex = 1;
    }
  }
  saveToFileSystem(response, filetype, filenameprefix, extension) {
    var filename = filenameprefix + this.nameAsCurrentDatetime() + extension;
    saveAs(response._body, filename);
  }
  nameAsCurrentDatetime() {
    var d = new Date()
    // return '-' + d.getMonth() + d.getDate() + d.getFullYear() + ' ' + (d.getHours()) + '_' + d.getMinutes() + '_' + d.getUTCMilliseconds();
    return '_' + this.dateFormatPipeFilter.transform(new Date(), this.date_apiformat)
  }
  getqueryparams() {
    var loc = window.location.href;
    var param = {};
    if (loc.indexOf('?') > -1) {
      var params = loc.substr(loc.indexOf('?') + 1, loc.length).split('&');

      var stringJson = '{';
      for (var i = 0; i < params.length; i++) {
        var propVal = params[i].split('=');
        var paramName = propVal[0];
        var value = propVal[1];
        stringJson += '\'' + paramName + '\': \'' + value + '\'';
        if (i != params.length - 1) stringJson += ',';
      }
      stringJson += '}';
      // parse string with jQuery parseJSON
      param = $.parseJSON(stringJson);
    }
    return param;
  }
  getBaseLocation() {
    let paths: string[] = location.pathname.split('/').splice(1, 1);
    let basePath: string = (paths && paths[0]) || ''; // Default: my-account
    return '/' + basePath;
  }
  getReportParams(reportname, userdetails) {
    var d = new Date();
    let data;
    data = {
      'contentDisposition': 'attachment',
      'userName': userdetails.loginname,
      'rgts': this.dateFormatPipeFilter.transform(new Date(), this.date_apiformat),
      'reportPath': AppConstant.REPORTS.CONFIG.REPORT_PATH,
      'reportName': reportname,
      'reportType': 'PDF',
      'dbName': userdetails.dbname,
      'tenantName': userdetails.Tenant.tenantname,
      'logoUrl': userdetails.logoPreviewUrl,
      'extra': ''
    }
    return data;
  }
}