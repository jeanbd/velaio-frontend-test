import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


import { ReactiveFormsModule, FormBuilder, FormArray, Validators, ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';

import { Task } from '../../interfaces/task.interface';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styles: [
  ],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSnackBarModule]
})
export class CreateTaskComponent implements OnInit {


  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isEditing: boolean, task: Task },
    private snackBar: MatSnackBar,
    private taskService: TasksService
  ) { }

  /**
   * Revisa si es para crear o editar
   */
  ngOnInit(): void {
    if (this.data && this.data.task != null) this.loadData();
  }

  toggleStatus: boolean = false;

  /**
   * Builder del formulario
   */
  taskForm = this.formBuilder.group({
    detail: ['', [Validators.required, this.voidFieldValidator()]],
    limitDate: ['', [Validators.required, this.voidFieldValidator()]],
    persons: this.formBuilder.array([], [this.uniquePersonNameValidator()]),
    status: [false]

  });

  /**
   * Agregar una persona al arreglo
   */
  addPerson() {
    const personForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      age: ['', [Validators.required, Validators.min(0), this.ageValidator]],
      skills: this.formBuilder.array([])
    });
    this.persons.push(personForm);
    this.addSkill(this.persons.length - 1);
    this.persons.updateValueAndValidity();
  }

  /**
   * Eliminar la persona del arreglo
   */
  removePerson(personIndex: number) {
    this.persons.removeAt(personIndex);
  }

  get persons() {
    return this.taskForm.get('persons') as FormArray;
  }

  /**
   * Agrega una habilidad al arreglo
   */
  addSkill(personIndex: number) {
    const skills = this.getSkills(personIndex);
    skills.push(this.formBuilder.control('', [Validators.required, this.voidFieldValidator()]));
  }

  getSkills(personIndex: number) {
    return this.persons.at(personIndex).get('skills') as FormArray;
  }

  /**
   * Elimina una habilidad
   */
  removeSkill(personIndex: number, skillIndex: number) {
    const skills = this.getSkills(personIndex);
    if (skills.length > 1) {
      skills.removeAt(skillIndex);
    } else {
      this.snackBar.open('Una persona tiene que tener minimo una habilidad', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }

  }


  /**  
   * Carga los datos si va a editar
  */
  loadData() {

    this.taskForm.patchValue({
      detail: this.data.task.detail,
      limitDate: this.data.task.limitDate,
      status: this.data.task.status
    });

    // Agrega personas a la tarea
    this.data.task.persons.forEach(person => {
      const personForm = this.formBuilder.group({
        name: [person.name, [Validators.required, Validators.minLength(5)]],
        age: [person.age, [Validators.required, Validators.min(0), this.ageValidator]],
        skills: this.formBuilder.array([])
      });

      // Agrega las habilidades a la persona
      const skillsArray = personForm.get('skills') as FormArray;
      person.skills.forEach(skill => {
        skillsArray.push(this.formBuilder.control(skill, [Validators.required, this.voidFieldValidator()]));
      });

      this.persons.push(personForm);
    })
  }

  /**
   * Cierra el modal
   */
  closeDialog(): void {
    this.dialogRef.close();
  }

  // Custom validator de edad de la persona
  ageValidator(control: AbstractControl): ValidationErrors | null {
    const age = control.value;
    if (age && age < 18) {
      return { 'underage': true };
    }
    return null;
  }

  //Custom validator de nombre unico en la tarea
  uniquePersonNameValidator(): ValidatorFn {
    return (formArray: AbstractControl): ValidationErrors | null => {
      const personNames = (formArray as FormArray).controls.map(
        (person) => person.get('name')?.value.toLowerCase()
      );
      const hasDuplicates = personNames.some(
        (name, index) => personNames.indexOf(name) !== index
      );
      return hasDuplicates ? { duplicateNames: true } : null;
    };
  }

  // Custom validator de campo vacion
  voidFieldValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value.trim() === '') {
        return { voidField: true };
      }
      return null;
    };
  }

  /**
   * Post de la tarea
   */
  postTask(task: Task) {
    this.taskService.createTasks(task).subscribe(response => {return})
  }

  /**
   * Edita la tarea
   */
  patchTask(task: Task) {
    this.taskService.updateTask(task).subscribe(response => {return})
  }

  /**
   * Accion del formulario
   */
  onSaveForm() {
    if (this.data && this.data.task) {

      const editedTask = { id: this.data.task.id, ...this.taskForm.value } as Task
      this.taskService.updateTask(editedTask).subscribe({
        next: () => this.closeDialog(),
        error: (err) => console.error('Error actualizando tarea:', err)
      });
    } else {
      let newTask = this.taskForm.value as Task
      this.taskService.createTasks(newTask).subscribe({
        next: () => this.closeDialog(),
        error: (err) => console.error('Error actualizando tarea:', err)
      });
    }
  }
}
