import { Component, OnInit } from '@angular/core';
import {User} from '../model/user';
import {CreatorService} from '../_services/creator.service';
import * as sha256 from '../../../node_modules/sha256/lib/sha256.js'
import {SelectorService} from '../_services/selector.service';

declare const alertify:any;
declare const formcheck:any;
@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.css']
})
export class UserSettingComponent implements OnInit {
  userOData:User;
  confirmPassword;
  edit;
  userList;
  selectedUser;
  constructor(private creatorService:CreatorService, private selectorService:SelectorService) {
    this.userOData = new User();

  }

  ngOnInit() {
      this.loadAllUser();
  }
openNewUser(){
    this.edit = false;
    this.selectedUser = -1;
this.clear();
}
clear(){
  for(let item in this.userOData){
    this.userOData[item] = '';
  }
  this.confirmPassword = '';
}
  createNewUser(){
      if(!formcheck('createModal',1)){
        return;
      }
    if(this.confirmPassword !== this.userOData.password){
      alertify.error('password and confirm-password not mach')
      return;
    }
    this.creatorService.registerUser(this.userOData).subscribe(data=>{
      try {
        if(data['data'][0]['message'] === 'succeed'){
          ($("#createModal") as any).modal('hide');
          this.loadAllUser();
        }else if(data['data'][0]['message'] === 'duplicate email'){
          alertify.error('duplicate email');
        }
      }catch (e) {
        alertify.error('error');
      }
    },err=>{
     alertify.error('error');
    })
  }


  loadAllUser(){
    $('#gridHolder').empty();
    let div = `<div style="margin-top: 20px" id="grid"></div>`;
    $('#gridHolder').append(div);
    this.selectorService.loadAllUsers(-1,-1).subscribe(response => {

      this.userList = response['data'];
      let cloneData = JSON.parse(JSON.stringify(this.userList));

      let source =
        {
          datatype: 'array',
          datafields: [
            {name: 'FldEmail', type: 'string'},
            {name: 'FldName', type: 'string'},
            {name: 'FldLastName', type: 'string'},
            {name: 'FldPkUserCo', type: 'string'},
          ],
          localdata: cloneData
        };
      let mythis = this;
      var dataAdapter = new ($ as any).jqx.dataAdapter(source);
      ($ as any)('#grid').jqxGrid(
        {
          width: '100%',
          source: dataAdapter,
          pageable: true,
          filterable: true,
          autoheight: true,
          sortable: true,
          altrows: true,
          enabletooltips: true,
          editable: false,
          theme: 'material',
          selectionmode: 'multiplecellsadvanced',
          columns: [
            {text: 'Firt Name', datafield: 'FldName'},
            {text: 'Last Name', datafield: 'FldLastName'},
            {text: 'Email', datafield: 'FldEmail'},
            // {text: 'Date Created', datafield: 'Date',width:'10%'},
            {
              text: 'Edit',
              datafield: 'FldPkUserCo',
              width: 50,
              columntype: 'custom',
              sortable: false,
              filterable: false,
              editable: false,
              groupable: false,
              draggable: false,
              resizable: false,
              createwidget:  (row, column, value, htmlElement)=> {
                var button = $(`<div style="border:none;text-align:center">
                  <a style="cursor: pointer">
                  <span id="${row.bounddata.ID}" class="fa fa-pencil" style="text-align:center;color:dodgerblue;margin-top:13px"</span>
                  </a></div>`);
                $(htmlElement).append(button);
                button.click( (event)=> {

                  var id = event.target.id;
                  if(!id){
                    if(event.target.tagName === "A") {
                      id = event.target.firstElementChild.id;
                    }
                    if(event.target.tagName === "DIV") {
                      id = event.target.firstElementChild.firstElementChild.id;
                    }
                  }
                  var datarow = this.userList.find(x=>x.FldPkUserCo === +id);
                  this.userOData.name = datarow['FldName'];
                  this.userOData.family = datarow['FldLastName'];
                  this.userOData.type = datarow['FldFkTypeCo'].toString();;
                  this.userOData.email = datarow['FldEmail'];
                  this.userOData.id = datarow['FldPkUserCo'];
                  this.edit = true;
                  ($("#createModal") as any).modal('show');
                  // mythis.service.edit = datarow;
                  // mythis.router.navigate([`project/${id}`]);
                });
              },
              initwidget: (row, column, value, htmlElement)=> {
                let id = value;
                $(htmlElement).find('.fa-pencil')[0].id = id;
              }
            }
          ]
        });
    });
  }

}
