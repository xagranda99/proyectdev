import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public apiUrl = environment.apiUrl;
  public headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'authorId': environment.authorId
  });
  private tempProduct!: Product

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<any[]>(this.apiUrl + '/bp/products', { headers: this.headers }).pipe(
      map(productsData => productsData.map(product => this.mapToProduct(product)))
    );
  }

  setTempProduct(product: Product) {
    this.tempProduct = product;
  }

  getTempProduct(): Product {
    return this.tempProduct;
  }

  private mapToProduct(data: any): Product {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      logo: data.logo,
      date_release: data.date_release,
      date_revision: data.date_revision
    };
  }

  addProduct(productData: Product): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/bp/products', productData, { headers: this.headers });
  }

  editProduct(productData: Product): Observable<any> {
    return this.http.put<any>(this.apiUrl + '/bp/products', productData, { headers: this.headers });
  }

  verifyId(id: string): Observable<boolean> {
    return this.http.get<any>(this.apiUrl + '/bp/products/verification', { params: { id } });
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/bp/products`, {
      params: { id },
      headers: this.headers
    })
  }
}