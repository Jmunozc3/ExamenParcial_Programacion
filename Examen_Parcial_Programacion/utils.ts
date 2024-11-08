import { Collection } from "mongodb";
import type { autores, libros, Modelautores, Modellibros } from "./types.ts";

export const fromModeltoAutores =(model:Modelautores): autores =>({
   id:model._id!.toString(),
   nombre_completo:model.nombre_completo,
   bibliografia:model.bibliografia,
});

export const fromModeltoLibros = (model:Modellibros): libros=>{
   // const autor= await collection.find({_id:{$in:model.autores}})
    return {
      id:model._id!.toString(),
      titulo:model.titulo,
      copias:model.copias,
      //autores:autor.map((p)=>fromModeltoAutores(p))
    };
}; 
