import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of, throwError } from 'rxjs';
import { AddProductsComponent } from './add-products.component';
import { ProductService } from '../../../../src/app/services/product.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderBrandComponent } from '../header-brand/header-brand.component';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('AddProductsComponent', () => {
  let component: AddProductsComponent;
  let fixture: ComponentFixture<AddProductsComponent>;
  let productService: ProductService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddProductsComponent, HeaderBrandComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        ProductService,
        HttpClient,
        HttpHandler,
        DatePipe,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {
                isEditMode: 'false' // or 'false' for testing both modes
              }
            }
          }
        }
      ]
    }).compileComponents();

    productService = TestBed.inject(ProductService);
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize productForm and labelPrincipal', () => {
      expect(component.productForm).toBeTruthy();
      expect(component.labelPrincipal).toBe('Formulario de Registro');
    });
  });

  describe('onDateReleaseChange', () => {
    it('should update date_revision field based on date_release field', () => {
      component.productForm.patchValue({ date_release: '2024-03-01' });
      component.onDateReleaseChange();
      expect(component.productForm.get('date_revision')?.value).toBe('2025-03-01');
    });
  });

  describe('dateTodayOrAfterValidator', () => {
    it('should return null if selected date is today or after', async () => {
      const control = { value: new Date().toISOString() };
      const result = await component.dateTodayOrAfterValidator(control as any);
      expect(result).toBeNull();
    });

    it('should return error if selected date is before today', async () => {
      const control = { value: '2024-01-01' };
      const result = await component.dateTodayOrAfterValidator(control as any);
      expect(result).toEqual({ dateTodayOrAfter: true });
    });
  });

  describe('repeatedIdValidator', () => {
    it('should return null if id is empty', async () => {
      const control = { value: '' };
      const result = await component.repeatedIdValidator()(control as any).toPromise();
      expect(result).toBeNull();
    });

    it('should return error if id is repeated', async () => {
      const control = { value: '1' };
      jest.spyOn(productService, 'verifyId').mockReturnValue(of(true));
      const result = await component.repeatedIdValidator()(control as any).toPromise();
      expect(result).toEqual({ repeatedId: true });
    });

    it('should return null if id is not repeated', async () => {
      const control = { value: '1' };
      jest.spyOn(productService, 'verifyId').mockReturnValue(of(false));
      const result = await component.repeatedIdValidator()(control as any).toPromise();
      expect(result).toBeNull();
    });
  });
});
