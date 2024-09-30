import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';


import { ReactiveFormsModule, FormBuilder, FormArray, Validators, ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';

import tasks from '../../../../mocks/tareas.json';
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
    private taskService:TasksService
  ) { }

  ngOnInit(): void {
    console.log('existe el editing?', this.data)
    if (this.data && this.data.task != null) this.loadData();
  }

  toggleStatus:boolean=false;

  taskForm = this.formBuilder.group({
    detail: ['', [Validators.required, this.voidFieldValidator()]],
    limitDate: ['', [Validators.required, this.voidFieldValidator()]],
    persons: this.formBuilder.array([],[this.uniquePersonNameValidator()]),
    status: [false]

  });

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

  removePerson(personIndex: number) {
    this.persons.removeAt(personIndex);
  }

  get persons() {
    return this.taskForm.get('persons') as FormArray;
  }

  addSkill(personIndex: number) {
    const skills = this.getSkills(personIndex);
    skills.push(this.formBuilder.control('', [Validators.required, this.voidFieldValidator()]));
  }

  getSkills(personIndex: number) {
    return this.persons.at(personIndex).get('skills') as FormArray;
  }

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

  

  statusToggle(){
    // this.toggleStatus= !this.toggleStatus
    console.log('toggle',this.taskForm.controls.status.value)
  }

  loadData() {
    // this.taskForm.controls.detail.setValue(tasks[0].detail)
    // this.taskForm.controls.limitDate.setValue(tasks[0].limitDate)
    // this.taskForm.controls.persons.setValue(tasks[0].persons)

    this.taskForm.patchValue({
      detail: this.data.task.detail,
      limitDate: this.data.task.limitDate,
      status: this.data.task.status
    });

    // Add persons from the task
    this.data.task.persons.forEach(person => {
      const personForm = this.formBuilder.group({
        name: [person.name, [Validators.required, Validators.minLength(5)]],
        age: [person.age, [Validators.required, Validators.min(0)]],
        skills: this.formBuilder.array([])
      });

      // Add skills for each person
      const skillsArray = personForm.get('skills') as FormArray;
      person.skills.forEach(skill => {
        skillsArray.push(this.formBuilder.control(skill, [Validators.required, this.voidFieldValidator()]));
      });

      this.persons.push(personForm);
    })
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  isValidField(field: keyof typeof this.taskForm.controls, index: number): boolean | null {
    const formArray = this.taskForm.get('persons') as FormArray;
    const control = formArray.at(index); // Acceder al FormControl en el índice
  
    return control.errors && control.touched;
  }

  // Custom validator to ensure age is older than 18
  ageValidator(control: AbstractControl): ValidationErrors | null {
    const age = control.value;
    if (age && age < 18) {
      return { 'underage': true };
    }
    return null;
  }
  
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

  voidFieldValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value.trim() === '') {
        return { voidField: true };
      }
      return null;
    };
  }

  postTask(task:Task){
    this.taskService.createTasks(task).subscribe(response => console.log('este es el response', response))
  }

  patchTask(task:Task){
    this.taskService.updateTask(task).subscribe(response => console.log('este es el response', response))
  }

  onSaveForm() {
    if (this.data) {
      /*
      const taskIndex = this.taskService.finalTaskList!.findIndex(task => task.id === this.data.task.id)
      if (taskIndex !== -1) {
        const taskEditedWithId: any = { id: this.data.task.id, ...this.taskForm.value }
        console.log('este es el taskedited', taskEditedWithId)

        this.taskService.finalTaskList![taskIndex] = taskEditedWithId
      }
      console.log('los tasks', this.taskService.finalTaskList)
      this.closeDialog();
      */
     const editedTask = {id:this.data.task.id, ...this.taskForm.value} as Task
     this.patchTask(editedTask);
     this.closeDialog();
    } else {
      let newTask = this.taskForm.value as Task

      // const newTaskWithId: any = { id: tasks.length + 1, ...newTask }
      // console.log('este es el newtask', newTaskWithId)

      // tasks.push(newTaskWithId);
      this.postTask(newTask);
      this.closeDialog();
    }
  }
}
