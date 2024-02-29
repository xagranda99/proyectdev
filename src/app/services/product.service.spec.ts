import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/Product';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Debe crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('Debe obtener los productos de la API', (done) => {
    const mockProducts: Product[] = [{ id: '1', name: 'Product 1', description: 'Description 1', logo: 'Logo 1', date_release: new Date(), date_revision: new Date() }];

    service.getProducts().subscribe(products => {
      expect(products.length).toBeGreaterThan(0);
      done();
    });

    const req = httpMock.expectOne(`${service.apiUrl}/bp/products`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('Debe agregar un producto via API', (done) => {
    const mockProduct: Product = { id: '1', name: 'Product 1', description: 'Description 1', logo: 'Logo 1', date_release: new Date(), date_revision: new Date() };

    service.addProduct(mockProduct).subscribe(response => {
      expect(response).toBeTruthy();
      done();
    });

    const req = httpMock.expectOne(`${service.apiUrl}/bp/products`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);
    req.flush({}); // Mocking an empty response from server
  });

  it('Debe editar un producto via API', (done) => {
    const mockProduct: Product = { id: '1', name: 'Product 1', description: 'Description 1', logo: 'Logo 1', date_release: new Date(), date_revision: new Date() };

    service.editProduct(mockProduct).subscribe(response => {
      expect(response).toBeTruthy();
      done();
    });

    const req = httpMock.expectOne(`${service.apiUrl}/bp/products`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockProduct);
    req.flush({}); // Mocking an empty response from server
  });

  it('Debe verificar un ID via API', (done) => {
    const productId = '1';

    service.verifyId(productId).subscribe(response => {
      expect(response).toBeTruthy(); // Assuming server returns some truthy response
      done();
    });

    const req = httpMock.expectOne(`${service.apiUrl}/bp/products/verification?id=${productId}`);
    expect(req.request.method).toBe('GET');
    req.flush({}); // Mocking an empty response from server
  });

  it('Debe eliminar un producto via API', (done) => {
    const productId = '1';

    service.deleteProduct(productId).subscribe(response => {
      expect(response).toBeTruthy();
      done();
    });

    const req = httpMock.expectOne(`${service.apiUrl}/bp/products?id=${productId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({}); // Mocking an empty response from server
  });

  it('Debe manejar el error al traer productos via API', (done) => {
    service.getProducts().subscribe(
      () => { },
      error => {
        expect(error).toBeTruthy();
        done();
      }
    );

    const req = httpMock.expectOne(`${service.apiUrl}/bp/products`);
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('Network error'));
  });

  it('Debe manejar el error al agregar un producto via API', (done) => {
    const mockProduct: Product = { id: '1', name: 'Product 1', description: 'Description 1', logo: 'Logo 1', date_release: new Date(), date_revision: new Date() };

    service.addProduct(mockProduct).subscribe(
      () => { },
      error => {
        expect(error).toBeTruthy();
        done();
      }
    );

    const req = httpMock.expectOne(`${service.apiUrl}/bp/products`);
    expect(req.request.method).toBe('POST');
    req.error(new ErrorEvent('Network error'));
  });

});