const express = require('express');
const app = express();




const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuracion de la base de datos
/*********************** Mongoose Configuration *******************************/
const mongoose = require("mongoose");

mongoose.connect(
    process.env.MONGODB_URI, // obtiene la url de conexión desde las variables de entorno
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
);

mongoose.set("debug", true);

require('./models/Usuario');
require('./models/Mascota');
require('./models/Solicitud');

require('./config/passport');

/*********************** Mongoose Configuration *******************************/

//Configurando las rutas
app.use('/v1', require('./routes'));

//Definimos un puerto (lugar por el cual se va a entrar)
// const PORT = 4001;
//Activa la aplicacion en el puerto indicado y le indicamos que va a hacer
app.listen(process.env.PORT, () =>{
    console.log(`ITS ALIVE!!! Server listening on on port ${process.env.PORT}`);
})


// //Definimos un arreglo de objetos con los dioses
// const gods = { 
//     Zeus: { live: 'Olympus', symbol: 'Thunderbolt' }, 
//     Hades : { live : 'Underworld', symbol: 'Cornucopia' } 
//   };

// const constelaciones = {
//     Andromeda : {
//         abreviatura : 'And',
//         superficie :  722.3,
//         num_estrellas : 152,
//         estr_mas_brillante : 'Alpheratz' 
//     },
//     Aquiles : {
//         abreviatura : 'Aqui',
//         superficie :  652.5,
//         num_estrellas : 124,
//         estr_mas_brillante : 'Altair' 
//     },
//     Corvus : {
//         abreviatura : 'Crv',
//         superficie :  183.8,
//         num_estrellas : 29,
//         estr_mas_brillante : 'Gienah' 
//     },
//     Cygnus : {
//         abreviatura : 'Cyg',
//         superficie :  804,
//         num_estrellas : 262,
//         estr_mas_brillante : 'Deneb' 
//     },
//     Draco : {
//         abreviatura : 'Dra',
//         superficie :  1083,
//         num_estrellas : 211,
//         estr_mas_brillante : 'Etamin' 
//     }
// };

// function busca(parametro){
//     if(constelaciones[parametro]){
//         return constelaciones[parametro];
//     }else{
//         for (const constelacion in constelaciones){
//             for (const propiedad in constelaciones[constelacion]){
//                 if(constelaciones[constelacion][propiedad] == parametro){
//                     return constelaciones[constelacion];
//                 }
//             }
//         }
//     }
// }


// //Estructura basica de un servicio
// //Necesita la subdirección y el comportamiento
// //El comportamiento, Con dos parametros las peticion y la respuesta
// //Reconocer todas las peticiones con intencion GET
// app.get('/gods', (req, res) => {
//     res.send(gods);
// })

// app.get('/gods/:name', (req, res, next) => {
//     var name = req.params.name;
//     var god = gods[name];
//     if(god){
//         res.send(god);
//     } else{
//         res.status(404).send("No encontre el dios");
//     }
//   });  

// app.get('/constelaciones', (req, res) => {
//     res.send(constelaciones);
// });

// app.get('/constelaciones/:parametro', (req, res) => {
//     const atributo = req.params.parametro;
//     const busqueda = busca(atributo);
//     if(busqueda){
//         res.send(busqueda);
//     } else{
//         res.status(404).send("No se encontro la constelacion");
//     }
// });

// app.put('/gods/:name', (req, res) => {
//     //Se recupera el nombre del dios a modificar
//     var god = req.params.name;
//     //buscamos al dios en el arreglo y se pasan los nuveos valores
//     gods[god] = req.body;
//     //Se manda la respuesta
//     res.send(gods);
// });

