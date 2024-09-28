export interface Task{
    id?:number;
    detalle:string;
    fechaLimite:string;
    personas:Persona[];
    estado:string;
}

interface Persona{
    nombre:string;
    edad:number;
    habilidades:string[]

}