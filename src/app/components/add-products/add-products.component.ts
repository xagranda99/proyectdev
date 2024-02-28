import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, debounceTime, distinctUntilChanged, map, of, switchMap, take } from 'rxjs';
import { Product } from 'src/app/models/Product';
import { ProductService } from 'src/app/services/product.service';
import { HeaderBrandComponent } from '../header-brand/header-brand.component';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss']
})
export class AddProductsComponent implements OnInit, AfterViewInit {

  productForm!: FormGroup;
  isEditMode: boolean | undefined;
  tempProduct: Product | undefined;
  labelPrincipal!: string;
  @ViewChild('header') header: HeaderBrandComponent | undefined;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.isEditMode = false;
  }
  ngAfterViewInit(): void {
    this.header?.hideBackButtonHandler(false);
  }
  ngOnInit(): void {
    this.labelPrincipal = 'Formulario de Registro'
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    const dateRelease = new Date(formattedDate);
    const nextYearDate = new Date(dateRelease);
    nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);
    const formattedNextYearDate = nextYearDate.toISOString().slice(0, 10);
    this.isEditMode = this.route.snapshot.queryParams['isEditMode'] === 'true';

    const dateValidators = this.isEditMode ? [] : [this.dateTodayOrAfterValidator];
    const idValidators = this.isEditMode ? [] : [Validators.required, Validators.minLength(3), Validators.maxLength(10)];
    const idRepeatedValidators = this.isEditMode ? [] : this.repeatedIdValidator();

    this.productForm = this.fb.group({
      id: [{ value: '', disabled: this.isEditMode }, idValidators, idRepeatedValidators],
      name: ['',
        [Validators.required, Validators.minLength(5), Validators.maxLength(100)]
      ],
      description: ['',
        [Validators.required, Validators.minLength(10), Validators.maxLength(200)]
      ],
      logo: ['',
        [Validators.required]
      ],
      date_release: [
        { value: formattedDate, disabled: this.isEditMode },
        [Validators.required], dateValidators
      ],
      date_revision: [{ value: formattedNextYearDate, disabled: true }]
    });

    if (this.isEditMode) {
      this.tempProduct = this.productService.getTempProduct();
      const formattedDateRelease = this.datePipe.transform(this.tempProduct.date_release, 'yyyy-MM-dd');
      const formattedDateRevision = this.datePipe.transform(this.tempProduct.date_revision, 'yyyy-MM-dd');
      if (this.tempProduct) {
        this.labelPrincipal = 'Edición de Producto'
        this.productForm.patchValue({
          id: this.tempProduct.id,
          name: this.tempProduct.name,
          description: this.tempProduct.description,
          logo: this.tempProduct.logo,
          date_release: formattedDateRelease,
          date_revision: formattedDateRevision
        });
        this.productForm.markAllAsTouched();
      }
      const idControl = this.productForm.get('id');
      if (idControl) {
        idControl.clearValidators(); // Eliminar todos los validadores
        idControl.updateValueAndValidity();
      }

      const dateReleaseControl = this.productForm.get('date_release');
      if (dateReleaseControl) {
        dateReleaseControl.clearValidators();
        dateReleaseControl.updateValueAndValidity();
      }
    }
  }


  onSubmit() {
    if (!this.productForm.valid) return;

    const dateRelease = new Date(this.productForm.get('date_release')?.value);
    const dateRevision = new Date(this.productForm.get('date_revision')?.value);
    const id = this.productForm.get('id')?.value

    let productData = [];
    if (this.isEditMode) {
      productData = {
        ...this.productForm.value,
        id: id,
        date_release: dateRelease.toISOString(),
        date_revision: dateRevision.toISOString()
      };
    } else {
      productData = {
        ...this.productForm.value,
        date_release: dateRelease.toISOString(),
        date_revision: dateRevision.toISOString()
      };
    }


    const productServiceMethod = this.isEditMode ? 'editProduct' : 'addProduct';

    this.productService[productServiceMethod](productData).subscribe(
      (res) => {
        this.productForm.reset();
        this.router.navigate(['/products']);
      },
      error => {
        console.error('Error al agregar/editar el producto:', error);
      }
    );
  }

  onDateReleaseChange(): void {
    const dateReleaseValue = this.productForm.get('date_release')?.value;
    const dateRelease = new Date(dateReleaseValue);
    const dateRevision = new Date(dateRelease.getFullYear() + 1, dateRelease.getMonth(), dateRelease.getDate());
    const formattedDateRevision = dateRevision.toISOString().slice(0, 10);
    this.productForm.get('date_revision')?.setValue(formattedDateRevision);
  }

  dateTodayOrAfterValidator(control: AbstractControl): Promise<ValidationErrors | null> {
    return new Promise(resolve => {
      const selectedDate = new Date(control.value);
      selectedDate.setDate(selectedDate.getDate() + 1);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      selectedDate.setHours(today.getHours());
      selectedDate.setMinutes(today.getMinutes());
      selectedDate.setSeconds(today.getSeconds());
      selectedDate.setMilliseconds(today.getMilliseconds());

      if (selectedDate >= today) {
        resolve(null);
      } else {
        resolve({ dateTodayOrAfter: true }); // La fecha es anterior a hoy, es inválida
      }
    });
  }

  repeatedIdValidator(): (control: AbstractControl) => Observable<ValidationErrors | null> {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const id = control.value;
      if (!id) {
        return of(null); // Si el ID está vacío, retorna null
      }

      return this.productService.verifyId(id).pipe(
        map(result => (result ? { repeatedId: true } : null))
      );
    };
  }

  resetForm() {
    if (!this.isEditMode) {
      this.productForm.reset();
    } else {
      const fieldsToReset = {
        name: '',
        description: '',
        logo: ''
      };
      this.productForm.patchValue(fieldsToReset);
    }
  }
}

