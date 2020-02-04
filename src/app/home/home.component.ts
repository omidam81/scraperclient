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
  Status;
  myInterval;
  messages = [];
  constructor(private selectorService: SelectorService) {
    this.scrapReport = new ScrapReport();
  }

  ngOnInit() {
    this.checkStatus();
    this.selectorService.getLastPorts().subscribe(
      data => {
      },
      err => { }
    );
    this.selectorService.getLastRouts().subscribe(
      data => {
      },
      err => { }
    );
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
      err => { }
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
        var datalist: any = data;
        if (datalist.msg === 'success') {
          this.list = datalist.data;
          var source = {
            localdata: this.list,
            datafields: [
              { name: 'FldArrivalDate', type: 'date' },
              { name: 'etd', type: 'date' },
              { name: 'eta', type: 'date' },
              { name: 'FldPortTime', type: 'date' },
              { name: 'FldFkFromPort', type: 'number' },
              { name: 'FldFkMasterRoute', type: 'number' },
              { name: 'FldPkRoute', type: 'number' },
              { name: 'FldFkToPort', type: 'number' },
              { name: 'FldFkFromPort', type: 'number' },
              { name: 'from_port_name', type: 'string' },
              { name: 'service', type: 'string' },
              { name: 'to_port_name', type: 'string' },
              { name: 'voyage', type: 'string' },
              { name: 'vessel', type: 'string' }
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
            ready: function () { },
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
                cellsrenderer: function (row, column, value) {
                  return (
                    "<div style='margin:4px;margin-right: 4px'>" +
                    (value + 1) +
                    '</div>'
                  );
                }
              },
              { text: 'From', datafield: 'from_port_name', width: '15%' },
              { text: 'To', datafield: 'to_port_name', width: '15%' },
              {
                text: 'Arrival Date',
                datafield: 'eta',
                width: '15%',
                cellsformat: 'yyyy-MM-dd'
              },
              {
                text: 'Departure Date',
                datafield: 'etd',
                width: '15%',
                cellsformat: 'yyyy-MM-dd'
              },

              { text: 'service', datafield: 'service', width: '10%' },
              { text: 'Vessel', datafield: 'vessel', width: '15%' },
              { text: 'voyage', datafield: 'voyage', width: '10%' }
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
  checkStatus() {
    this.myInterval = setInterval(() => {
      this.selectorService.getServicesStatus().subscribe(data => {
        this.Status = data['result'];
        for (let s of this.Status) {
          if (s.err) {
            this.messages.push({
              msg: `Service ${s.name} has problem please pause Service and check your connection to ${s.name} site`,
              see: false
            }
            );
          }
        }

      }, err => {
        console.log(err);
      })
    }, 3000)

  }
  forceStop(name, isPause) {
    alertify.confirm('Pause Service', `Are you sure for ${isPause ? 'start' : 'stop'} ${name} Scrap`, () => {
      let siteOData = {
        site: name
      }
      this.selectorService.forceStop(siteOData).subscribe((data) => {

      }, (err) => {

      })
    }, () => {
      alertify.error('Cancel')
    });
  }
  checkMessage(index) {
    this.messages[index]['see'] = true;
  }
  toggleLog(name) {
    let siteOData = {
      site: name
    }
    this.selectorService.showLog(siteOData).subscribe((data) => {

    }, (err) => {

    })
  }
}
