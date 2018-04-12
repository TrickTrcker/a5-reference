import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { LocalStorageService } from '../../shared/local-storage.service';
import { AppConstant } from '../../app.constant';
import * as _ from "lodash";
import { FeaturesService } from '../../services/features.service';
import { MasterService } from '../../services/master.service';
import { TreeTableModule, TreeNode, SharedModule } from 'primeng/primeng';
import { Router, NavigationExtras } from '@angular/router';
import { MessagesService } from '../../shared/messages.service';
import { UtilsService } from '../../services/utils.service';
import { AddledgerComponent } from '../../pages/settings/ledger/addledger/addledger/addledger.component';
import { DialogModule, SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-chartofaccounts',
  templateUrl: './chartofaccounts.component.html',
  styleUrls: ['./chartofaccounts.component.scss']
})
export class ChartofaccountsComponent implements OnInit {
  selectedAccount: TreeNode;
  userstoragedata: any;
  finyear: any;
  allheads: any;
  allbookaccs: any[];
  Assetsvalues: TreeNode[];
  Liabilitisvalues:TreeNode[];
  Expensesvalues:TreeNode[];
  Incomevalues:TreeNode[];
  items:any;
  addovrlay: any;
  display: boolean = false;
  ledgerdtls: any[];
  levelCheck:any ={};
  constructor(private masterservice: MasterService, private storageservice: LocalStorageService,
    private router: Router, private messageservice: MessagesService, private utilservice: UtilsService, private featureservice: FeaturesService, ) {
    this.userstoragedata = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    this.finyear = this.storageservice.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.FINYEAR);
  }
  ngOnInit() {
    this.getHeadsList();
    this.items = [
            {label: 'Add Ledger', command: (event) => this.NewLedger(this.selectedAccount,"overlaypanel: DialogModule")},
        ];
  }
  
  NewLedger(selected, overlaypanel: DialogModule){
  console.log("new ledger")
  console.log(selected)
  this.addovrlay = overlaypanel
  this.display = true;
  this.ledgerdtls = [];
}
loadledgerlist() {
    this.display = false;
    this.getHeadsList();
  }
  nodeSelect(data){
      console.log("dataaaa",data);
      this.levelCheck = data.node.data.level;
      console.log("level",this.levelCheck);
      if(this.levelCheck == "1"){
        return true;
      }
      else{
        return false;
      }
  }
  getHeadsList() {
    var self = this;
    var data = {
    };
    self.allheads = [];
    this.featureservice.AccHeadList(data)
      .then(function (res) {
        if (res.status) {
          self.allheads = res.data;
          self.loadBookofAcc();
        }
      });
  }
  loadBookofAcc() {
    var self = this;
    var data = {
      tenantid: [this.userstoragedata.tenantid, 0],
      isTB : "Y"
    };
    self.allbookaccs = [];
    this.masterservice.BookGetAll(data)
      .then(function (res) { 
        if(res.status){
        self.allbookaccs = res.data;
        var assetheads = _.filter(self.allheads,function(h:any){
          return (h.ALIE == "A")
        });
        var treedata: any = self.utilservice.chartofaccounts_treeformater(assetheads, self.allbookaccs);
        
        self.Assetsvalues = treedata.data[0].children;
        console.log("assets tree",self.Assetsvalues);
        var liabilitiesheads = _.filter(self.allheads,function(h:any){
          return (h.ALIE == "L")
        });
        var treelbitdata: any = self.utilservice.chartofaccounts_treeformater(liabilitiesheads, self.allbookaccs);
        self.Liabilitisvalues = treelbitdata.data[0].children;
        console.log("liabs tree",self.Liabilitisvalues);
        var expensesheads = _.filter(self.allheads,function(h:any){
          return (h.ALIE == "E")
        });
        var treedataexpenses: any = self.utilservice.chartofaccounts_treeformater(expensesheads, self.allbookaccs);
        self.Expensesvalues = treedataexpenses.data[0].children;
        console.log("expenses tree",self.Expensesvalues);
        var incomeheads = _.filter(self.allheads,function(h:any){
          return (h.ALIE == "I")
        });
        var treedataincome: any = self.utilservice.chartofaccounts_treeformater(incomeheads, self.allbookaccs);
        self.Incomevalues = treedataincome.data[0].children;
        console.log("income tree",self.Incomevalues);
      }
      });
     
  }
  viewNode(node: TreeNode) {
    // this.msgs = [];
    //this.messageservice.showMessage({severity: 'info', summary: 'Node Selected', detail: node.data.name});
  }
  collapseNode(node: TreeNode) {
    // this.msgs = [];
    //this.messageservice.showMessage({severity: 'info', summary: 'Node Selected', detail: node.data.name});
  }
  expandNode(node: TreeNode) {
    // node.parent.children = node.parent.children.filter( n => n.data !== node.data);
    // this.msgs = [];
    //this.messageservice.showMessage({severity: 'info', summary: 'Node Deleted', detail: node.data.name});
  }
  expandNodeAll(event) {
  }

}