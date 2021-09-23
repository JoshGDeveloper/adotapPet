// // importamos el modelo de usuarios
// const Mascota = require('../models/Mascota')

// function crearMascota(req, res) {
//   // Instanciaremos un nuevo usuario utilizando la clase usuario
//   var mascota = new Mascota(req.body)
//   //Se debe agregar la validación de los datos que estan llegando
//   res.status(201).send(mascota)
// }

// function obtenerMascotas(req, res) {
//   // Simulando dos usuarios y respondiendolos
//   var mascota1 = new Mascota(1, 'peke','perro', 'foto.png', 'cachorro', 'Josue','CDMX')
//   var mascota2 = new Mascota(2, 'firulais','gato', 'foto.png', 'egipcio', 'Ruben','EdoMex')
//   res.send([mascota1, mascota2])
// }

// function modificarMascota(req, res) {
//   // simulando un usuario previamente existente que el cliente modifica
//   var mascota1 = new Mascota(req.params.id, 'peke','perro', 'foto.png', 'cachorro', 'Josue','CDMX')
//   var modificaciones = req.body
//   mascota1 = { ...mascota1, ...modificaciones }
//   res.send(mascota1)
// }

// function eliminarMascota(req, res) {
//   // se simula una eliminación de usuario, regresando un 200
//   res.status(200).send(`Mascota ${req.params.id} eliminada`);
// }

const mongoose = require('mongoose');
const Mascota = mongoose.model("Mascota");

// CRUD
//Create - Insert
function crearMascota(req, res, next) {
  const mascota = new Mascota(req.body);
  //Save - Hace el insert a la base datos
  //Si toda sale bien entra a then
  mascota.save().then(mas => {
    res.status(200).send(mas);
  }).catch(next)
}

//Read - Select
function obtenerMascota(req, res, next) {
  //findById - Si se esta buscando una en especifico
  if (req.params.id) {
    Mascota.findById(req.params.id)
      .then(mas => {
        res.status(200).send(mas)
      })
      .catch(next)
  } else { //find Si se esta buscando la lista completa de Mascotas
    Mascota.find()
      .then(mascotas => {
        res.send(mascotas)
      })
      .catch(next)
  }
}

//Update
function modificarMascota(req, res, next) {
  //1. Busco la mascota y la traigo
  Mascota.findById(req.params.id)
    .then(mascota => {
      //Si no existe la mascota
      if (!mascota) {
        return res.status(404);
      }
      //2. Modifico lo que le cliente solicito
      let nuevaInfo = req.body;
      if (typeof nuevaInfo.nombre !== "undefined") {
        mascota.nombre = nuevaInfo.nombre;
      }
      if (typeof nuevaInfo.categoria !== 'undefined')
        mascota.categoria = nuevaInfo.categoria
      if (typeof nuevaInfo.fotos !== 'undefined')
        mascota.fotos = nuevaInfo.fotos
      if (typeof nuevaInfo.descripcion !== 'undefined')
        mascota.descripcion = nuevaInfo.descripcion
      if (typeof nuevaInfo.anunciante !== 'undefined')
        mascota.anunciante = nuevaInfo.anunciante
      if (typeof nuevaInfo.ubicacion !== 'undefined')
        mascota.ubicacion = nuevaInfo.ubicacion
      //3. Guardo la mascota en la bd
      mascota.save()
      .then(mascota => {
        res.status(200).send(mascota.publicData())
      })
      .catch(next)
    })
    .catch(next)
}

//Delete
function eliminarMascota(req, res, next){
  Mascota.findOneAndDelete({ _id: req.params.id })
  .then(r => {
      res.status(200).send(`Mascota ${req.params.id} eliminada: ${r}`);
    })
  .catch(next)
}

function count(req, res, next){
  const categoria = req.params.cat;
  Mascota.aggregate([
    { '$match': { 'categoria': categoria } }, 
    { '$count': 'total'}
  ]).then( r => {
    res.status(200).send(r);
  })
  .catch(next)
}

// exportamos las funciones definidas
module.exports = {
  crearMascota,
  obtenerMascota,
  modificarMascota,
  eliminarMascota,
  count
}