import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/providers/data-service/data.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-bill-right',
  templateUrl: './bill-right.component.html',
  styleUrls: ['./bill-right.component.scss']
})
export class BillRightComponent implements OnInit, OnDestroy {

  com: any;
  bill: any;

  constructor(public dataService: DataService) { }

  ngOnInit() {
    this.listenToBill();
  }

  ngOnDestroy() {
    // Left for untilDestroyed
  }

  private listenToBill() {
    this.dataService.currentBill.pipe(untilDestroyed(this)).subscribe(val => {
      if (val.billContent) {
        this.bill = val.billContent;
        this.com = val.billContent.companyDetails;
      }
    });
  }

  getEven(index) {
    return (index % 2 === 0) ? true : false;
  }

  printPDF() {
    const printContents = document.getElementById('printable-area').innerHTML;
    const popupWin = window.open('', '_blank', 'width=700,height=300');
    popupWin.document.open();
    popupWin.document.write(`<html>
    <head><style>
    @media print {
        * {
          font-family: "Roboto";
          -webkit-print-color-adjust: exact;
        }

        .body {
          margin: 6mm;
        }

        .logo {
          width: 6em;
          height: 3em;
        }

        .primary {
          font-weight: bold;
          padding: 0.7em 0.7em 0.2em 0.7em;
        }

        .bill-to-col {
          height: 2.5em;
          border-left: 4px solid rgb(255, 149, 102);
        }

        .company-col {
          margin-bottom: 0.4em;
        }

        .secondary {
          color: #a0a0a0;
          padding: 0.3em 0.7em;
        }

        .tertiary {
          font-size: 1em;
          color: #a0a0a0;
          padding: 0.3em 0.8em;
        }

        .primary-col {
          font-weight: bold;
          padding: 0.7em;
        }

        .header-content {
          margin-bottom: 1.5em;
        }

        .title-col {
          font-size: 1.5em;
          background-color: rgb(255, 149, 102);
          color: white;
          text-transform: uppercase;
          padding-left: 0.2em;
          margin-bottom: 0.4em;
          border: 1px solid #ffaa99;
          padding:  0.3em 0.4em;
        }

        .header-row {
          background-color: rgb(255, 149, 102);
          color: white;
          text-transform: uppercase;
        }

        .header-col {
          border: 1px solid #ffaa99;
          padding: 0.7em;
        }

        .content-row {
          font-weight: 400;
        }

        .content-row2 {
          font-weight: 400;
          background-color: #fcded7;
        }

        .content-col {
          border: 1px solid #ffaa99;
          padding: 0.7em;
        }

        .capital {
          text-transform: capitalize;
        }    

        .total-row {
          background-color: rgb(255, 149, 102);
          color: white;
          text-transform: uppercase;
          font-size: 1.3em;
          font-weight: 400;
          border: 1px solid #ffaa99;
        }

        .total-col {
          padding: 0.5em;
        }

        .title-secondary {
          color: #a0a0a0;
          text-transform: uppercase;
          font-size: 1.2em;
          margin-top: 0.5em;
          padding: 0.5em;
        }
      }
    </style></head>
    <body onload='window.print(); window.close()'> ${printContents} </body></html>`);
    popupWin.document.close();
  }
}
