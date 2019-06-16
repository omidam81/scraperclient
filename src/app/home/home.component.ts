import { Component, OnInit } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { SelectorService } from '../_services/selector.service';
import { ScrapReport } from '../model/setting';

declare const alertify: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public options: Select2Options;
  public optionsOrigin: Select2Options;
  public optionsdes: Select2Options;
  public siteList: Array<Select2OptionData>;
  portList;
  origin;
  Destination;
  public selectedSite;
  scrapReport: ScrapReport;
  list: any = [];

  constructor(private selectorService: SelectorService) {
    this.scrapReport = new ScrapReport();
  }

  ngOnInit() {
    this.siteList = [
      {
        id: '1',
        text: 'One-line.com'
      }
    ];
    this.options = {
      placeholder: 'Select Site...',
      width: '100%'
    };
    this.optionsOrigin = {
      placeholder: 'Select Site...',
      width: '100%'
    };
    this.optionsdes = {
      placeholder: 'Select Site...',
      width: '100%'
    };
    this.selectorService.loadPorts(-1).subscribe(
      data => {
        this.portList = data['data'];
      },
      err => {}
    );
  }

  changedOrigin(e) {
    this.scrapReport.from = e.value;
  }

  changedDestination(e) {
    this.scrapReport.to = e.value;
  }

  search() {
    if (this.scrapReport.fromTime == undefined) {
      alertify.error('Select From Date');
      return;
    }
    if (this.scrapReport.toTime == undefined) {
      alertify.error('Select To Date');
      return;
    }

    this.selectorService.loadScrapReport(this.scrapReport).subscribe(
      data => {
        console.log(data);
        var datalist: any = data;
        if (datalist.msg === 'success') {
          this.list = datalist.data;
          var source = {
            localdata: this.list,
            datafields: [
              { name: 'FldArrivalDate', type: 'date' },
              { name: 'FldDepDate', type: 'date' },
              { name: 'FldInlandTime', type: 'date' },
              { name: 'FldPortTime', type: 'date' },
              { name: 'FldFkFromPort', type: 'number' },
              { name: 'FldFkMasterRoute', type: 'number' },
              { name: 'FldPkRoute', type: 'number' },
              { name: 'FldFkToPort', type: 'number' },
              { name: 'FldFkFromPort', type: 'number' },
              { name: 'FldFrom', type: 'string' },
              { name: 'FldOcean', type: 'string' },
              { name: 'FldTo', type: 'string' },
              { name: 'FldTotal', type: 'string' },
              { name: 'FldVessel', type: 'string' }
            ],
            datatype: 'array'
          };
          let mythis = this;
          ($('#list') as any).jqxGrid({
            width: '100%',
            source: source,
            sortable: true,
            theme: 'material',
            pageable: true,
            pagermode: 'simple',
            autoheight: true,
            columnsresize: true,
            ready: function() {},
            columns: [
              {
                text: '#',
                sortable: false,
                filterable: false,
                editable: false,
                groupable: false,
                draggable: false,
                resizable: false,
                datafield: '',
                columntype: 'number',
                width: '5%',
                cellsrenderer: function(row, column, value) {
                  return (
                    "<div style='margin:4px;margin-right: 4px'>" +
                    (value + 1) +
                    '</div>'
                  );
                }
              },
              { text: 'From', datafield: 'FldFrom', width: '10%' },
              { text: 'To', datafield: 'FldTo', width: '10%' },
              {
                text: 'Arrival Date',
                datafield: 'FldArrivalDate',
                width: '10%',
                cellsformat: 'yyyy-MM-dd'
              },
              {
                text: 'Dep Date',
                datafield: 'FldDepDate',
                width: '10%',
                cellsformat: 'yyyy-MM-dd'
              },
              {
                text: 'Port Time',
                datafield: 'FldPortTime',
                width: '10%',
                cellsformat: 'yyyy-MM-dd'
              },
              {
                text: 'Inland Time',
                datafield: 'FldInlandTime',
                width: '10%',
                cellsformat: 'yyyy-MM-dd'
              },
              { text: 'Ocean', datafield: 'FldOcean', width: '10%' },
              { text: 'Total', datafield: 'FldTotal', width: '10%' },
              { text: 'Vessel', datafield: 'FldVessel', width: '15%' }
            ]
          });
        }

        // console.log(data);
      },
      err => {
        console.log(err);
      }
    );
  }
}
