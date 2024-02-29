import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header-brand',
  templateUrl: './header-brand.component.html',
  styleUrls: ['./header-brand.component.scss']
})
export class HeaderBrandComponent implements OnInit {

  hideBackButton: boolean = false;
  @Output() onClickBack: EventEmitter<any> = new EventEmitter();

  constructor(private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {

  }

  hideBackButtonHandler(option: boolean): void {
    setTimeout(() => {
      this.hideBackButton = option;
      this.cdr.detectChanges();
    }, 0);
  }

  backAction() {
    this.onClickBack.emit();
  }

}
