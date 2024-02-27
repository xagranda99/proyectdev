import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {

  products!: any[];
  searchTerm: string;
  p: number;
  pageSize: number
  currentPage: number;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {
    this.searchTerm = '';
    this.p = 1;
    this.pageSize = 5;
    this.currentPage = 1;
  }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
        console.log(this.products); // Hacer algo con los datos
      },
      (error) => {
        console.error('Error al obtener productos:', error);
      }
    );
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
    this.router.navigate(['add-product'])
  }
}
