import { Collection, MongoClient, ObjectId } from "mongodb";
import type { Modelautores, Modellibros } from "./types.ts";
import { fromModeltoLibros } from "./utils.ts";

const MONGO_URL= Deno.env.get("MONGO_URL");
if(!MONGO_URL){
    console.error("Mongo_URL not found");
    Deno.exit(1);
}

const client=new MongoClient(MONGO_URL);
await client.connect();
console.info("Conexión exitosa")

const db=client.db("biblioteca");
const collection_libros=db.collection<Modellibros>("libros");
const collection_autores=db.collection<Modelautores>("autores");

export async function handler(req:Request): Promise<Response> {
    const method=req.method;
    const url=new URL(req.url);
    const path= url.pathname;

    if(method==="POST"){

        if(path===("/autor")){
          const autor= await req.json();
          const {insertedId} =await collection_autores.insertOne({
            nombre_completo:autor.nombre_completo,
            bibliografia:autor.bibliografia,
          })
          return new Response(JSON.stringify({
            id:insertedId,
            nombre_completo:autor.nombre_completo,
            bibliografia:autor.bibliografia,
          }),{status:201})
          

        }else if(path===("/libro")){
            const libro= await req.json();
            if(!libro.titulo||!libro.copias){
                return new Response("Faltan argumentos que poner",{status:400});
            }
            const {insertedId} =await collection_libros.insertOne({
                titulo:libro.titulo,
                copias:libro.copias,
            })
            return new Response(JSON.stringify({
                titulo:libro.titulo,
                copias:libro.copias,
                id:insertedId,
            }
            ),{status:201})

        }


    }else if(method==="DELETE"){

        if(path==="/libro"){

            const id = url.searchParams.get("id");

            const {deletedCount} = await collection_libros.deleteOne({ _id:new ObjectId(id) });

            if(deletedCount===0){
                return new Response("Not Found",{status:404});
            }
            return new Response("BIEN",{ status:200 });
        }

    }else if(method==="PUT"){
        if(path==="/libro"){
            const id = url.searchParams.get("id");
            const {modifiedCount} = await collection_libros.updateOne(
                { _id: new ObjectId(id) },
                { $set: body },
              );
            if(modifiedCount===0){
                return new Response("Not Found",{status:404});
            }
            return new Response("BIEN",{ status:200 });
        }
    }else if(method==="GET"){

        if(path==="/libro"){
            
            const id = url.searchParams.get("id");
            const lib = await collection_libros.findOne({ _id:new ObjectId(id) });
            if (!lib) {
                return new Response(JSON.stringify({ error: "Todo not found" }), {
                  status: 404,
                  headers: { "Content-Type": "application/json" },
            })};
            
        }
    }
    return new Response("Another error",{status:404});
}

Deno.serve({ port: 3000 }, handler);
