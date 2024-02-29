import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListProductsComponent } from './list-products.component';
import { ProductService } from '../../../../src/app/services/product.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('ListProductsComponent', () => {
  let component: ListProductsComponent;
  let fixture: ComponentFixture<ListProductsComponent>;
  let productService: ProductService;

  beforeEach(async () => {
    const productServiceStub = {
      getProducts: jest.fn(),
      deleteProduct: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [ListProductsComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: ProductService, useValue: productServiceStub }]
    }).compileComponents();

    productService = TestBed.inject(ProductService);
  });


  it('should create', (done) => {
    done();
  });

  // You can add more tests for other methods and behaviors of the component
});