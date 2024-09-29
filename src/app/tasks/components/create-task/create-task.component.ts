import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


import { ReactiveFormsModule, FormBuilder, FormArray, Validators, NgModel } from '@angular/forms';

import tasks from '../../../../mocks/tareas.json';
import { Task } from '../../interfaces/task.interface';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styles: [
  ],
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, MatDialogModule, MatButtonModule,MatSlideToggleModule]
})
export class CreateTaskComponent implements OnInit {


  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isEditing: boolean, task: Task }
  ) { }

  ngOnInit(): void {
    console.log('existe el editing?', this.data)
    if (this.data && this.data.task != null) this.loadData();
  }

  toggleStatus:boolean=false;

  taskForm = this.formBuilder.group({
    detail: ['', [Validators.required, Validators.minLength(5)]],
    limitDate: ['', [Validators.required]],
    persons: this.formBuilder.array([]),
    status: [false]

  });

  addPerson() {
    const personForm = this.formBuilder.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
      skills: this.formBuilder.array([])
    });
    this.persons.push(personForm);
    this.addSkill(this.persons.length - 1);
  }

  removePerson(personIndex: number) {
    this.persons.removeAt(personIndex);
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

  onSaveForm() {
    if (this.data) {

      const taskIndex = tasks.findIndex(task => task.id === this.data.task.id)
      if (taskIndex !== -1) {
        const taskEditedWithId: any = { id: this.data.task.id, ...this.taskForm.value }
        console.log('este es el taskedited', taskEditedWithId)

        tasks[taskIndex] = taskEditedWithId
      }
      console.log('los tasks', tasks)
      this.closeDialog();
    } else {
      let newTask = this.taskForm.value

      const newTaskWithId: any = { id: tasks.length + 1, ...newTask }
      console.log('este es el newtask', newTaskWithId)

      tasks.push(newTaskWithId);
      this.closeDialog();
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
        name: [person.name, Validators.required],
        age: [person.age, [Validators.required, Validators.min(0)]],
        skills: this.formBuilder.array([])
      });

      // Add skills for each person
      const skillsArray = personForm.get('skills') as FormArray;
      person.skills.forEach(skill => {
        skillsArray.push(this.formBuilder.control(skill, Validators.required));
      });

      this.persons.push(personForm);
    })
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
