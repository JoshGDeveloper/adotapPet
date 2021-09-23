/*  Archivo controllers/usuarios.js
 *  Simulando la respuesta de objetos Usuario
 *  en un futuro aquí se utilizarán los modelos
 */

// importamos el modelo de usuarios
// const Usuario = require('../models/Usuario')

const mongoose = require("mongoose")
const Usuario = mongoose.model("Usuario")
const passport = require('passport');

// function crearUsuario(req, res) {
//   // Instanciaremos un nuevo usuario utilizando la clase usuario
//   var usuario = new Usuario(req.body)
//   //Se debe agregar la validación de los datos que estan llegando
//   res.status(201).send(usuario)
// }

function crearUsuario(req, res, next) {
  // Instanciaremos un nuevo usuario utilizando la clase usuario
  const body = req.body,
    password = body.password

  delete body.password
  const usuario = new Usuario(body)
  usuario.crearPassword(password)
  usuario.save()
  .then(user => {                                         //Guardando nuevo usuario en MongoDB.
    return res.status(201).json(user.toAuthJSON())
  }).catch(next)
}

// function obtenerUsuarios(req, res) {
//   // Simulando dos usuarios y respondiendolos
//   var usuario1 = new Usuario(1, 'juancho','Juan', 'Vega', 'juan@vega.com', 'abc','normal')
//   var usuario2 = new Usuario(2, 'montse','Monserrat', 'Vega', 'mon@vega.com', '123','normal')
//   res.send([usuario1, usuario2])
// }

function obtenerUsuarios(req, res, next) {                              //Obteniendo usuario desde MongoDB.
  Usuario.findById(req.usuario.id, (err, user) => {
    if (!user || err) {
      return res.sendStatus(401)
    }
    return res.json(user.publicData());
  }).catch(next);
}

// function modificarUsuario(req, res) {
//   // simulando un usuario previamente existente que el cliente modifica
//   var usuario1 = new Usuario(req.params.id, 'juancho','Juan', 'Vega', 'juan@vega.com', 'abc','normal')
//   var modificaciones = req.body
//   usuario1 = { ...usuario1, ...modificaciones }
//   res.send(usuario1)
// }

function modificarUsuario(req, res, next) {
  console.log(req.usuario)
  Usuario.findById(req.usuario.id).then(user => {
    if (!user) { return res.sendStatus(401); }
    let nuevaInfo = req.body
    if (typeof nuevaInfo.username !== 'undefined')
      user.username = nuevaInfo.username
    if (typeof nuevaInfo.nombre !== 'undefined')
      user.nombre = nuevaInfo.nombre
    if (typeof nuevaInfo.apellido !== 'undefined')
      user.apellido = nuevaInfo.apellido
    if (typeof nuevaInfo.email !== 'undefined')
      user.email = nuevaInfo.email
    if (typeof nuevaInfo.tipo !== 'undefined')
      user.tipo = nuevaInfo.tipo
    if (typeof nuevaInfo.password !== 'undefined')
      user.crearPassword(nuevaInfo.password)
    user.save().then(updatedUser => {                                   //Guardando usuario modificado en MongoDB.
      res.status(201).json(updatedUser.publicData())
    }).catch(next)
  }).catch(next)
}

// function eliminarUsuario(req, res) {
//   // se simula una eliminación de usuario, regresando un 200
//   res.status(200).send(`Usuario ${req.params.id} eliminado`);
// }

function eliminarUsuario(req, res) {
  // únicamente borra a su propio usuario obteniendo el id del token
  Usuario.findOneAndDelete({ _id: req.usuario.id }).then(r => {         //Buscando y eliminando usuario en MongoDB.
    res.status(200).send(`Usuario ${req.params.id} eliminado: ${r}`);
  })
}

function iniciarSesion(req, res, next) {
  if (!req.body.email) {
    return res.status(422).json({ errors: { email: "no puede estar vacío" } });
  }

  if (!req.body.password) {
    return res.status(422).json({ errors: { password: "no puede estar vacío" } });
  }

  passport.authenticate('local', { session: false }, function (err, user, info) {
    if (err) { return next(err); }

    if (user) {
      user.token = user.generarJWT();
      return res.json({ user: user.toAuthJSON() });
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
}

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  modificarUsuario,
  eliminarUsuario,
  iniciarSesion
}
