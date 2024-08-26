import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { Contact } from '../../models/contacts.models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [AsyncPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  http = inject(HttpClient);
  currentlyEditingId: string | null = null;

  contactsForm = new FormGroup({
    name: new FormControl<string>(''),
    email: new FormControl<string>(''),
    phone: new FormControl<string>(''),
    address: new FormControl<string>(''),
  });

  onFormSubmit() {
    const addContactRequest = {
      name: this.contactsForm.value.name,
      email: this.contactsForm.value.email,
      phoneNo: this.contactsForm.value.phone,
      address: this.contactsForm.value.address,
    };

    const editContactRequest = {
      id: this.currentlyEditingId,
      name: this.contactsForm.value.name,
      email: this.contactsForm.value.email,
      phone: this.contactsForm.value.phone,
      address: this.contactsForm.value.address,
    };

    if (this.currentlyEditingId) {
      // Update existing contact

      this.http
        .post(`https://localhost:7071/api/Contact/Edit`, editContactRequest)
        .subscribe({
          next: (value) => {
            console.log('Contact updated', value);
            this.contacts$ = this.getContacts();
            this.contactsForm.reset();
            this.currentlyEditingId = null;
          },
          error: (err) => {
            console.error('Error updating contact', err);
          },
        });
    } else {
      this.http
        .post('https://localhost:7071/api/Contact', addContactRequest)
        .subscribe({
          next: (value) => {
            console.log(value);
            this.contacts$ = this.getContacts();
            this.contactsForm.reset();
          },
          error: (err) => {
            console.error('Error adding contact', err);
          },
        });
    }
  }

  onDelete(id: string) {
    const confirmDeletion = window.confirm(
      'Are you sure you want to delete this contact?'
    );
    if (confirmDeletion) {
      console.log(`Deleting contact with ID: ${id}`);
      this.http.delete(`https://localhost:7071/api/Contact/${id}`).subscribe({
        next: (value) => {
          alert('Item Deleted');
          this.contacts$ = this.getContacts();
        },
        error: (err) => {
          console.error('Delete error', err);
        },
      });
    }
  }

  onEdit(id: string) {
    console.log(`Editing contact with ID: ${id}`);
    this.currentlyEditingId = id;

    // Fetch the contact details
    this.http
      .get<Contact>(`https://localhost:7071/api/Contact/${id}`)
      .subscribe({
        next: (contact) => {
          // Populate the form with the contact details
          this.contactsForm.patchValue({
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            address: contact.address,
          });
        },
        error: (err) => {
          console.error('Error fetching contact details', err);
        },
      });
  }

  clearForm() {
    this.contactsForm.reset();
    this.currentlyEditingId = null;
  }

  contacts$ = this.getContacts();

  private getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>('https://localhost:7071/api/Contact');
  }
}
