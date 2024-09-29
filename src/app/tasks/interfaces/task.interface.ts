import { Persona } from "./person.interface";

export interface Task{
    id?:number;
    detail:string;
    limitDate:string;
    persons:Persona[];
    status:boolean;
}

