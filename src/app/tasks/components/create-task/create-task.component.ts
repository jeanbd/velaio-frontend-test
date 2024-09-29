import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


import {ReactiveFormsModule, FormBuilder, FormArray, Validators} from '@angular/forms';

import tasks from '../../../../mocks/tareas.json';
import persons from '../../../../mocks/personas.json';


@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styles: [
  ],
  standalone:true,
  imports:[CommonModule,MatIconModule,ReactiveFormsModule,MatDialogModule, MatButtonModule]
})
export class CreateTaskComponent{
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateTaskComponent>
  ) {}

  taskForm = this.formBuilder.group({
    detail:['', [Validators.required, Validators.nullValidator]],
    limitDate:['', [Validators.required]],
    persons: this.formBuilder.array([]),
    status:['Pendiente']
    
  });

  addPerson() {
    const personForm = this.formBuilder.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      skills: this.formBuilder.array([])
    });
    this.persons.push(personForm);
    this.addSkill(this.persons.length - 1);
  }

  get persons() {
    return this.taskForm.get('persons') as FormArray;
  }

  addSkill(personIndex: number) {
    const skills = this.getSkills(personIndex);
    skills.push(this.formBuilder.control('', Validators.required));
  }

  getSkills(personIndex: number) {
    return this.persons.at(personIndex).get('skills') as FormArray;
  }

  removeSkill(personIndex: number, skillIndex: number) {
    const skills = this.getSkills(personIndex);
    skills.removeAt(skillIndex);
  }

  // get personsSkills() {
  //   return this.taskForm.get('persons.skills') as FormArray;
  // }

  // addSkill() {
  //   this.personsSkills.push(this.formBuilder.control('', [Validators.required]));
  // }

  

  // removeSkill(index: number) {
  //   this.personsSkills.removeAt(index);
  // }

  onSaveForm(){
    let newTask = this.taskForm.value

    // let personWithId = persons.length+1;

    // structuredClone(newTask.persons)
    
    const newTaskWithId:any = {id:tasks.length+1,...newTask}
    console.log('este es el newtask',newTaskWithId)

    tasks.push(newTaskWithId);
    this.closeDialog();

    // console.log('tasks actualizado?',tasks)
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
