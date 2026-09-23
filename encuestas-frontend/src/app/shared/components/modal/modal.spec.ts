import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Modal } from './modal';
import { DatosModal } from '../../models/modal-interface';

describe('Modal', () => {
  let component: Modal;
  let fixture: ComponentFixture<Modal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modal, RouterModule],
      providers: [
        provideHttpClient(),
        { provide: MatDialogRef, useValue: { close: () => {} } },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { titulo: 'Test', tipoAccion: 'ver', tipoEntidad: 'Cliente', entidad: {} } as DatosModal,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Modal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('Modal con formulario de Cliente', () => {
  let component: Modal;
  let fixture: ComponentFixture<Modal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modal, RouterModule],
      providers: [
        provideHttpClient(),
        { provide: MatDialogRef, useValue: { close: () => {} } },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            titulo: 'MODIFICAR Cliente',
            tipoAccion: 'modificar',
            tipoEntidad: 'Cliente',
            entidad: { id: 1, nombre: 'Alpha', email: 'a@b.com', cuit: 30111111118, telefono: '', activo: true },
          } as DatosModal,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Modal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('construye el formulario con los campos del Cliente', () => {
    expect(component.form.get('nombre')).toBeTruthy();
    expect(component.form.get('email')).toBeTruthy();
    expect(component.form.get('cuit')).toBeTruthy();
    expect(component.form.get('telefono')).toBeTruthy();
    expect(component.form.get('activo')).toBeTruthy();
  });
});