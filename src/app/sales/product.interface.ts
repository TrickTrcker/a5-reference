export interface Product {
          prodid: Number;
          prodname: String;
          tenantid: Number;
          tenantname: String;
          uomid: Number;
          uomdesc: String;
          mrp:  Number;
          qty:  Number;
          selltaxname: Number;
          selltaxLabelname: String;
          discount: {
                    discntprcnt: Number;
                    discntvalue: Number;
          };
          discntprcnt: Number;
          discntvalue: Number;
          taxpercent:Number;
          prodselltax: {
                    taxpercent:Number;
          };
          taxname: String;
          taxvalue: Number;
          basicamount:Number;
          status: String;
          createddt:String;
          lastupdatedby: String;
          lastupdateddt: String;
          btotal:Number;
}
