import {Component, OnInit} from '@angular/core';
import {Select2OptionData} from 'ng2-select2';
import {SelectorService} from '../_services/selector.service';
import {SiteSetting, PortToPort, SystemEmail} from '../model/setting';
import {CreatorService} from '../_services/creator.service';
import {subscribeTo} from 'rxjs/internal-compatibility';
import {promise} from 'selenium-webdriver';


declare const $: any;
declare const alertify: any;

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  option: Select2Options;
  option2: Select2Options;

  searchString;
  email;
  siteList;
  portList;
  serchPoint;
  filterList;
  listOfPortForSave;
  selectedSite;
  scrapTime;
  origin;
  destination;
  portToPortList;
  hasSetting;
  scrapType;
  weekNumber;
  monthNumber;
  dayOfWeek = '1';
  dayOfMonth = '1';
  dayLength;
  emailSetting: SystemEmail;
  emailList;
  ReportTime;
  masterEmailId;
  systemEmailId = -1;
  comCode;
  SubsidiaryId;
  enableSite;
  constructor(private selectorService: SelectorService, private creatorService: CreatorService) {
    this.weekNumber = Array(7).fill(0).map((x, i) => i + 1);
    this.monthNumber = Array(30).fill(0).map((x, i) => i + 1);
    this.emailSetting = new SystemEmail();
  }

  async ngOnInit() {
    this.option = {
      placeholder: 'Select Port...',
      width: '100%',


    };
    this.option2 = {
      placeholder: 'Select Port...',
      width: '100%'

    };

    this.selectorService.loadSites(-1).subscribe(data => {
      this.siteList = data['data'];

    }, err => {

    });

    this.getAllPorts();
    await this.loadMasterEmailSetting();
    this.loadEmailSetting();
    this.loadEmailList();

  }

  showModal(id) {
    this.listOfPortForSave = [];
    $('#settingSiteModal').modal('show');
    this.selectedSite = id;
    this.selectorService.loadSetting(id).subscribe(data => {
      if (data['data'][0]) {
        let siteSetting = data['data'][0];
        this.hasSetting = true;
        this.scrapType = siteSetting['Schedule'].toString();
        this.dayOfWeek = siteSetting['DayMounth'];
        this.dayLength = siteSetting['LenghtScrap'];
        this.scrapTime = siteSetting['Time'];
        this.comCode = siteSetting['com_code'];
        this.SubsidiaryId = siteSetting['Subsidiary_id'];
        this.enableSite = siteSetting['DisableEnable'];
        this.loadPortToPort();
      } else {
        this.hasSetting = false;
      }
    }, err => {

    });

  }

  getAllPorts() {
    this.selectorService.loadPorts(-1).subscribe(data => {
      this.portList = data['data'];
      this.filterList = JSON.parse(JSON.stringify(this.portList));
    }, err => {

    });
  }

  searchPort(event) {
    this.filterList = this.portToPortList.filter(
      x => x.fromPortname.toLowerCase().includes(event.target.value.toLowerCase()) ||
        x.toPortname.toLowerCase().includes(event.target.value.toLowerCase()));
  }

  addTo(event, id) {
    let index = this.listOfPortForSave.indexOf(id);
    index === -1 ? this.listOfPortForSave.push(id) : this.listOfPortForSave.splice(index, 1);
  }

  isCheck(id) {
    if (this.listOfPortForSave) {
      return this.listOfPortForSave.indexOf(id) === -1 ? false : true;
    }
    return false;
  }

  saveScrapSetting() {
    let siteModel = new SiteSetting();
    siteModel.SiteId = this.selectedSite;
    siteModel.Time = this.scrapTime;
    siteModel.String = this.convertToSchduleFormat(new Date(this.scrapTime));
    siteModel.TypeSchedule = this.scrapType;
    siteModel.DayOfMounth = this.setDayOf();
    siteModel.LenghtToScraping = this.dayLength;
    siteModel.ComCode = this.comCode;
    siteModel.SubsidiaryId = this.SubsidiaryId;
    siteModel.DisableEnable = this.enableSite;
    this.creatorService.saveSetting(siteModel).subscribe(data => {
      alertify.success('Success');
    }, err => {
      alertify.error('error');
    });
  }

  setDayOf() {
    switch (this.scrapType) {
      case '1':
        return 0;
      case '2':
        return this.dayOfWeek;
      case '3':
        return this.dayOfMonth;
    }
  }

  convertToSchduleFormat(time: Date, type = 1) {
    if (type = 2) {
      return `${time.getSeconds()} ${time.getMinutes()} ${time.getHours()} * * *`;
    }
    if (this.scrapType === '1') {
      return `${time.getSeconds()} ${time.getMinutes()} ${time.getHours()} * * *`;
    }
    if (this.scrapType === '2') {
      return `${time.getSeconds()} ${time.getMinutes()} ${time.getHours()} * * ${this.dayOfWeek}`;
    }
    if (this.scrapType === '3') {
      return `${time.getSeconds()} ${time.getMinutes()} ${time.getHours()} * ${this.dayOfMonth} *`;
    }
  }

  savePorttoPort() {
    let portToPort = new PortToPort();
    portToPort.from = this.origin;
    portToPort.to = this.destination;
    portToPort.siteId = this.selectedSite;
    this.creatorService.savePortToPort(portToPort).subscribe(data => {
      if (data['data'][0]) {
        alertify.success('success');
        this.loadPortToPort();
      } else {
        alertify.error('error');
      }
    }, err => {
      alertify.error('error');
    });
  }

  loadPortToPort() {
    this.selectorService.loadPortToPort(this.selectedSite).subscribe(data => {
      this.portToPortList = data['data'];
      this.filterList = JSON.parse(JSON.stringify(data['data']));
    }, err => {

    });
  }

  changedOrigin(e) {
    this.origin = e.value;
  }

  changedDestination(e) {
    this.destination = e.value;
  }

  RemovePortToPort(id) {
    this.creatorService.deletePortToPort(id).subscribe(data => {
      alertify.success('success');
          this.loadPortToPort();
    }, err => {
      alertify.error('error');
    });
  }

  setDayValue(e) {
    if (e.target.value === '1') {
      this.dayLength = 1;
    }
    if (e.target.value === '2') {
      this.dayLength = 7;
    }
    if (e.target.value === '3') {
      this.dayLength = 30;
    }
  }

  saveEmailSetting() {
    //save Time
    this.creatorService.saveEmailSetting(this.masterEmailId, this.ReportTime, this.convertToSchduleFormat(this.ReportTime, 2)).subscribe(data => {
      try {
        this.masterEmailId = data['data'][0]['PkEmailSeting'];
      } catch (e) {
        alertify.error('error save time');
      }
    }, err => {
      alertify.error('error');
    });

    //save Config
    this.creatorService.saveSysyemEmail(this.emailSetting).subscribe(data => {
      try {
        if (data['data'][0]['message'] === 'succeed') {
          alertify.success('success');
        }
      } catch (e) {
        alertify.error('error');
      }

    }, err => {
      alertify.error('error');
    });
  }

  loadEmailSetting() {
    this.creatorService.loadSystemEmail(-1).subscribe(data => {
      this.emailSetting.password = data['data'][0]['FldPass'];
      this.emailSetting.username = data['data'][0]['FldUserName'];
      this.emailSetting.email = data['data'][0]['FldEmail'];
      this.emailSetting.port = data['data'][0]['FldPort'];
      this.emailSetting.server = data['data'][0]['FldServer'];
      this.systemEmailId = data['data'][0]['FldPkSystemEmail'];
    }, err => {
      console.log('error fetching data');
    });
  }

  addEmailToList() {
    this.creatorService.addEmail(this.masterEmailId, this.email).subscribe(data => {

      alertify.success('success');
      this.loadEmailList();
    }, err => {
      alertify.error('error');
    });
  }

  loadEmailList() {
    this.selectorService.loadEmailList(1).subscribe(data => {
      this.emailList = data['data'];

    }, err => {
      alertify.error('error fetching data');
    });
  }

  loadMasterEmailSetting() {
    this.selectorService.loadMasterEmailSetting().subscribe(data => {
      if (data['data'].length == 0) {
        this.masterEmailId = -1;
      } else {
        this.masterEmailId = data['data'][0]['PkId'];
        this.ReportTime = data['data']['0']['FldSendTime'];
      }
    }, err => {
      alertify.error('error fetching data');
    });

  }

  deleteEmail(id) {
    this.creatorService.deleteEmail(id).subscribe(data => {
      alertify.success('success');
      this.loadEmailList();
    }, err => {
      alertify.error('error');
    });
  }
}
