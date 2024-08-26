import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { CustomerService } from '../../services/customer.service';
import { ContactService } from '../../contact.service';
import { Contact } from '../../models/contacts.models';
import { InvoiceService } from '../../services/invoice.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatOptionModule,
  ],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.css',
})
export class BillingComponent implements OnInit {
  rec: FormGroup;
  productService = inject(ProductService);
  contactService = inject(ContactService);
  products: Product[] = [];
  filteredProducts: Product[] = [];
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];

  private invoiceService = inject(InvoiceService);
  private fb = inject(FormBuilder);

  constructor() {
    this.rec = this.fb.group({
      invId: [this.generateInvoiceNumber()],
      from: [''],
      billTo: [{ value: '', disabled: true }],
      date: [''],
      dueDate: [''],
      lineItems: this.fb.array([this.createLineItem()]), // FormArray for dynamic items
      notes: [''],
      terms: [''],
      itemDiscount: [''],
      subTotal: [{ value: 0, disabled: true }],
      amount: [''],
      tax: [''],
      discount: [''],
      total: [{ value: 0, disabled: true }],
      shipping: [''],
      amountPaid: [''],
      balanceDue: [{ value: 0, disabled: true }],
    });
  }
  ngOnInit(): void {
    this.loadProducts();
    this.loadCustomers();
    this.setupFromAutocomplete();
  }

  get lineItems() {
    return this.rec.get('lineItems') as FormArray;
  }

  generateInvoiceNumber(): string {
    const prefix = 'INV';
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = uuidv4().slice(0, 6);
    return `${prefix}-${datePart}-${randomPart}`;
  }

  createLineItem(): FormGroup {
    return this.fb.group({
      product: [''],
      quantity: [1],
      rate: [{ value: 0, disabled: true }],
      itemDiscount: [0],
      amount: [{ value: 0, disabled: true }],
    });
  }

  calculateAmount(index: number) {
    const item = this.lineItems.at(index) as FormGroup;
    const quantity = item.get('quantity')?.value;
    const rate = item.get('rate')?.value;
    console.log(item.get('rate')?.value)

    const discount = parseFloat(item.get('itemDiscount')?.value || '0') / 100;
    console.log(item.get('itemDiscount')?.value);

    const total = quantity * rate;
    const discountedAmount = total - total * discount;
    item.get('amount')?.setValue(discountedAmount.toFixed(2));
    console.log(item.get('amount')?.value)


  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }

  loadCustomers() {
    this.contactService.getContacts().subscribe({
      next: (data) => {
        this.contacts = data;
      },
      error: (error) => {
        console.error('Error fetching contacts:', error);
      },
    });
  }

  setupFromAutocomplete() {
    this.rec
      .get('from')
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.filterContacts(value);
      });
  }

  onProductSelected(event: MatAutocompleteSelectedEvent, index: number) {
    const selectedProduct = this.products.find(
      (p) => p.name === event.option.value
    );
    if (selectedProduct) {
      const lineItem = this.lineItems.at(index) as FormGroup;
      lineItem.patchValue({
        description: selectedProduct.name,
        rate: selectedProduct.price,
      });
      this.calculateAmount(index);
      this.updateSubtotal();
    }
  }

  filterProducts(index: number) {
    const lineItem = this.lineItems.at(index) as FormGroup;
    const productControl = lineItem.get('product');

    productControl?.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.filteredProducts = this.products.filter((product) =>
          product.name.toLowerCase().includes(value.toLowerCase())
        );
      });
  }

  filterContacts(value: string) {
    const filterValue = value.toLowerCase();
    this.filteredContacts = this.contacts.filter((contact) =>
      contact.name.toLowerCase().includes(filterValue)
    );
  }

  onContactSelected(event: MatAutocompleteSelectedEvent) {
    const selectedContact = this.contacts.find(
      (contact) => contact.name === event.option.value
    );
    if (selectedContact) {
      this.rec.patchValue({
        from: selectedContact.name,
        billTo: selectedContact.address,
      });
    }
  }

  updateSubtotal() {
    const subtotal = this.lineItems.controls
      .map((item) => parseFloat(item.get('amount')?.value || '0'))
      .reduce((acc, value) => acc + value, 0);

    this.rec.get('subTotal')?.setValue(subtotal.toFixed(2));

    const tax = parseFloat(this.rec.get('tax')?.value || '0');

    const finalDiscount = parseFloat(this.rec.get('discount')?.value || '0');

    const taxedTotal = subtotal + (subtotal * tax) / 100;

    const total = taxedTotal - (taxedTotal * finalDiscount) / 100;

    this.rec.get('total')?.setValue(total.toFixed(2));

    const amountPaid = parseFloat(this.rec.get('amountPaid')?.value || '0');
    const balanceDue = amountPaid - total;
    this.rec.get('balanceDue')?.setValue(balanceDue.toFixed(2));
  }

  addLineItem() {
    this.lineItems.push(this.createLineItem());
  }

  removeLineItem(index: number) {
    this.lineItems.removeAt(index);
  }

  private enableFormControls() {
    ['billTo', 'from','rate', 'amount', 'balanceDue', 'subTotal', 'total'].forEach((control) =>
      this.rec.get(control)?.enable()
    );
  }

  private disableFormControls() {
    ['billTo', 'from','rate', 'amount', 'balanceDue', 'subTotal', 'total'].forEach((control) =>
      this.rec.get(control)?.disable()
    );
  }


  submitInvoice() {
    this.enableFormControls();
    if (this.rec.valid) {
      const invoiceData = this.prepareInvoiceData();
      console.log(invoiceData);
      console.log(this.rec.value);
      this.invoiceService.createInvoice(invoiceData).subscribe({
        next: (response) => {
          console.log('Invoice created successfully', response);
          // Handle success (e.g., show a success message, reset form, etc.)
        },
        error: (error) => {
          console.error('Error creating invoice', error);
          // Handle error (e.g., show error message)
        }
      });
    } else {
      // Handle invalid form
      console.log('Form is invalid');
    }
    this.disableFormControls();
  }
  
  prepareInvoiceData() {
    const formValue = this.rec.value;
    return {
      invoiceNumber: formValue.invId,
      invoiceDate: formValue.date,
      dueDate: formValue.dueDate,
      from: formValue.from,
      billTo: formValue.billTo,
      subtotal: formValue.subTotal,
      tax: formValue.tax,
      discount: formValue.discount,
      total: formValue.total,
      amountPaid: formValue.amountPaid,
      balanceDue: formValue.balanceDue,
      notes: formValue.notes,
      terms: formValue.terms,
      orderItems: formValue.lineItems.map((item: any) => ({
        productName: item.product,
        quantity: item.quantity,
        rate: item.rate,
        discount: item.itemDiscount,
        amount: item.amount
      }))
    };
  }

  // downloadInvoice() {
  //   // Get the invoice element
  //   const invoice = document.getElementById('invoice');

  //   if (invoice) {
  //     // Use html2canvas to capture the invoice as an image
  //     html2canvas(invoice).then((canvas) => {
  //       const imgData = canvas.toDataURL('image/png');
  //       const pdf = new jsPDF({
  //         orientation: 'portrait',
  //         unit: 'px',
  //         format: [canvas.width, canvas.height],
  //       });

  //       pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  //       pdf.save('invoice.pdf');
  //     });
  //   } else {
  //     console.error('Invoice element not found');
  //   }
  // }
}
