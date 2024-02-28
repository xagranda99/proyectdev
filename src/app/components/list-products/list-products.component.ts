import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/Product';
import { ProductService } from 'src/app/services/product.service';
import { HeaderBrandComponent } from '../header-brand/header-brand.component';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit, AfterViewInit {

  products!: any[];
  searchTerm: string;
  p: number;
  pageSize: number
  currentPage: number;
  pageSizeOptions: number[];
  maxPaginationValue: number;
  modalVisible!: boolean;
  titleProduct: any;
  idProductSelected: any;

  @ViewChild('header') header: HeaderBrandComponent | undefined;

  constructor(
    private productService: ProductService,
    private router: Router,
    private elementRef: ElementRef
  ) {
    //Parametros iniciales que se pueden cambiar, de acuerdo a los requerimientos
    this.searchTerm = '';
    this.p = 1;
    this.pageSize = 5;
    this.currentPage = 1;
    this.pageSizeOptions = [5, 10, 20];
    this.maxPaginationValue = 20;
  }

  ngAfterViewInit(): void {
    this.header?.hideBackButtonHandler(true);
  }

  ngOnInit(): void {
    this.modalVisible = false;
    this.getProducts();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  get filteredProducts() {
    return this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get pagedProducts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(startIndex, startIndex + this.pageSize);
  }

  getProducts() {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
        this.products.forEach(product => {
          product.showDropdown = false;
        });
      },
      (error) => {
        console.error('Error al obtener productos:', error);
      }
    );
  }

  prevPage() {
    this.currentPage--;
  }

  nextPage() {
    this.currentPage++;
  }

  updatePage() {
    this.currentPage = 1;
  }

  addProduct() {
    this.router.navigate(['/products/add'])
  }

  openModal(product: any): void {
    this.titleProduct = product.name;
    this.idProductSelected = product.id;
    this.modalVisible = true;
  }

  closeModal(): void {
    this.modalVisible = false;
  }

  toggleDropdown(event: Event) {
    const target = event.currentTarget as HTMLElement;
    const parentTr = target.closest('tr');
    if (parentTr && parentTr.parentElement) {
      const index = Array.from(parentTr.parentElement.children).indexOf(parentTr);
      this.pagedProducts.forEach((product, i) => {
        if (i !== index) {
          product.showDropdown = false;
        }
      });
      this.pagedProducts[index].showDropdown = !this.pagedProducts[index].showDropdown;
    }
  }

  @HostListener('document:click', ['$event'])
  closeDropdowns(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.pagedProducts.forEach(product => product.showDropdown = false);
    }
  }

  editProduct(product: Product) {
    this.productService.setTempProduct(product);
    this.router.navigate(['/products/add'], { queryParams: { isEditMode: true } })
  }

  deleteProduct() {
    this.modalVisible = false;
    this.productService.deleteProduct(this.idProductSelected).subscribe(data => {
      this.getProducts();
    },
      err => {
        this.getProducts();
      });
  }
}
