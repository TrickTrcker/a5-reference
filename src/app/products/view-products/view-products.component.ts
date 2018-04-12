import { Component, OnInit, Input } from '@angular/core';
import * as _ from "lodash";
import { AppConstant } from '../../app.constant';
import { ProductallService } from '../productall.service';
import { LocalStorageService } from '../../shared/local-storage.service';
import { FeaturesService } from './../../services/features.service';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.scss']
})
export class ViewProductsComponent implements OnInit {
  @Input() product: any;
  userdetails: any
  allbrands: any[];
  allcategories: any[];
  selectedbrandetails: any
  selectedcatdetails: any
  hsndetails: any
  allhsncode: any[] = [];
  public currency_sy = AppConstant.API_CONFIG.CURRENCY_FORMAT;
  constructor(private ProductallService: ProductallService,
    private LocalStorageService: LocalStorageService,
    private featureservice: FeaturesService) {
    this.userdetails = LocalStorageService.getItem(AppConstant.API_CONFIG.LOCALSTORAGE.USER);
    setTimeout(() => {
      this.getBrandAndCategery()
    }, 1000)

  }

  ngOnInit() {
    this.getservicecategory();


  }
  getBrandAndCategery() {
    var self = this
    this.selectedbrandetails = _.find(this.allbrands, function (o: any) { return o.brandid == self.product.brandid; });
    this.selectedcatdetails = _.find(this.allcategories, function (o: any) { return o.categoryid == self.product.categoryid; });
    this.hsndetails = _.find(this.allhsncode, function (o: any) { return o.hsncode == self.product.hsncode; });
  }
  getservicecategory() {

    this.ProductallService.brandGetAll({ tenantid: this.userdetails.tenantid, status: "Active", })
      .then((res) => {
        this.allbrands = res.data;
      });

    this.ProductallService.categoryGetAll({ tenantid: this.userdetails.tenantid, status: "Active", })
      .then((res) => {
        this.allcategories = res.data;
      });
    this.featureservice.hsnGetAll({})
      .then((res) => {
        this.allhsncode = res.data;
      });
  }

}
