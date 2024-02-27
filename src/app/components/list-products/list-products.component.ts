import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {

  products!: any[];

  constructor(private productService: ProductService) { }

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
}
