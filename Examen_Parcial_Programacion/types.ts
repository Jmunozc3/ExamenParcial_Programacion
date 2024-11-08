import {ObjectId,type OptionalId} from "mongodb"

export type libros = {
   id:string;
   titulo:string;
   copias:number;
}

export type autores={
    id:string;
    nombre_completo:string;
    bibliografia:string;
}

export type Modellibros = OptionalId<{
    titulo:string;
    copias:number;
}>;

export type Modelautores = OptionalId<{
    nombre_completo:string;
    bibliografia:string;
}>;