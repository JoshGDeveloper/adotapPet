// // Usuario.js
// /** Clase que representa a un usuario de la plataforma*/
// class Usuario {
//     constructor(id, username, nombre, apellido, email, password, tipo) {
//       this.id = id;
//       this.username = username;
//       this.nombre = nombre;
//       this.apellido = apellido;
//       this.email = email;
//       this.password = password;
//       this.tipo = tipo; // tipo normal o anunciante
//     }
//   }
//   module.exports = Usuario;

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');                             
//Importando módulo crypto, pendiente de instalar.
const jwt = require('jsonwebtoken');                          
//Importando módulo jsonwebtoken, pendiente de instalar.
const secret = require('../config').secret;                   
// ???? es un misterio que resolveremos en la última sesión


const UsuarioSchema = new mongoose.Schema({      
  username: {
    type: String,
    unique: true, //Que el usuario sea unico
    required: [true, "No puede estar vacío el campo username"],
    lowercase: true, //Que este escrito en minisculas
    match: [/^[a-z0-9]+$/, "Username inválido"],
    index: true
  },                              
  nombre: {
    type: String,
    required: true
  },
  apellido:{
    type: String,
    required: true
  }, 
  email: {
    type: String,
    unique: true,
    required: [true, "Falta email"],
    match: [/\S+@\S+.\S+/, "Email inválido"],
    index: true
  },
  //ubicacion: String,
  //telefono: String,
  //bio: String,
  //foto: String,
  tipo: {
    type: String,
    enum: ['normal', 'anunciante']
  },
  hash: String,
  salt: String
}, { timestamps: true, collection: 'Usuarios' });         

UsuarioSchema.plugin(uniqueValidator, {message: "Ya existe"});

UsuarioSchema.methods.crearPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex"); // generando una "sal" random para cada usuario
  this.hash = crypto
  .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
  .toString("hex"); // generando un hash utilizando la salt
};

UsuarioSchema.methods.validarPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

UsuarioSchema.methods.generarJWT = function() {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60); // 60 días antes de expirar

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

UsuarioSchema.methods.toAuthJSON = function(){
  return {
    username: this.username,
    email: this.email,
    token: this.generarJWT()
  };
};

//Este metodo regresa toda la información publica del esquema
UsuarioSchema.methods.publicData = function() {
  return {
    id: this.id,
    username: this.username,
    email: this.email,
    nombre: this.nombre,
    apellido: this.apellido,
    //bio: this.bio,
    //foto: this.foto,
    tipo: this.tipo
    //ubicacion: this.ubicacion,
    //telefono: this.telefono,
    //createdAt: this.createdAt,
    //updatedAt: this.updatedAt
  };
};

mongoose.model("Usuario", UsuarioSchema); 



  