import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { Product } from 'src/app/models/Product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.scss']
})
export class AddProductsComponent implements OnInit {

  productForm!: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService,
  ) {
  }
  ngOnInit(): void {
    // Obtener la fecha actual
    const currentDate = new Date();
    // Formatear la fecha como YYYY-MM-DD para establecerla en el campo dateRelease
    const formattedDate = currentDate.toISOString().slice(0, 10);

    // Calcular la fecha de dateRevision como dateRelease + 1 año
    const dateRelease = new Date(formattedDate);
    const nextYearDate = new Date(dateRelease);
    nextYearDate.setFullYear(nextYearDate.getFullYear() + 1);

    // Formatear la nueva fecha como YYYY-MM-DD
    const formattedNextYearDate = nextYearDate.toISOString().slice(0, 10);

    this.productForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)], this.repeatedIdValidator() // Aquí debes pasar el validador asíncrono
      ],
      name: ['', Validators.required, Validators.min(5), Validators.max(100)],
      description: ['', Validators.required, Validators.min(10), Validators.max(200)],
      logo: ['', [Validators.required]],
      date_release: [formattedDate, [Validators.required], [this.dateTodayOrAfterValidator]],// Establecer la fecha de hoy en dateRelease
      date_revision: [{ value: formattedNextYearDate, disabled: true }, Validators.required] // Establecer la fecha de nextYear en dateRevision
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const dateRelease = new Date(this.productForm.get('date_release')?.value);
      const dateRevision = new Date(this.productForm.get('date_revision')?.value);

      const productData = {
        ...this.productForm.value,
        date_release: dateRelease.toISOString(),
        date_revision: dateRevision.toISOString()
      };
      this.productService.addProduct(productData).subscribe(
        (res) => {
          res
          this.productForm.reset();
          this.router.navigate(['/products']);
        },
        error => {
          console.error('Error al agregar el producto:', error);
        }
      );
    } else {

    }
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
    this.productForm.reset(); // Restablecer todos los campos del formulario
  }
}

