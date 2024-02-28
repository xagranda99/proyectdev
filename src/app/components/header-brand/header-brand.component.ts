import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-brand',
  templateUrl: './header-brand.component.html',
  styleUrls: ['./header-brand.component.scss']
})
export class HeaderBrandComponent implements OnInit {

  hideBackButton: boolean = false;

  constructor() {

  }

  ngOnInit(): void {

  }

  hideBackButtonHandler(option: boolean): void {
    this.hideBackButton = option;
  }

  backAction() {

  }

}
