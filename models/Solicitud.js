const mongoose = require("mongoose");

const SolicitudSchema  = new mongoose.Schema({
  idmascota: {type: mongoose.Schema.Types.ObjectId, ref: 'Mascota',required: true}, //Recupera el id de la mascota
  fechaDeCreacion: {type:Date, required: true}, //fecha de la solicitud
  idUsuarioAnunciante: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario',required: true}, //Persona que pone en adopcion
  idUsuarioSolicitante: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario',required: true}, //Persona que quiere adoptar
  estado:{type: String, enum:['aprobada', 'cancelada', 'pendiente'],required: true},
}, { timestamps: true , collection : 'Solicitudes'})

SolicitudSchema.methods.publicData = function(){
  return {
    id: this.id,
    idmascota: this.idmascota,
    fechaDeCreacion: this.fechaDeCreacion,
    idUsuarioAnunciante: this.idUsuarioAnunciante,
    idUsuarioSolicitante: this.idUsuarioSolicitante,
    estado: this.estado
  };
};

mongoose.model('Solicitud', SolicitudSchema);

// // Solicitud.js
// /** Clase que representa una solicitud de adopción */
// class Solicitud {
//     constructor(id, idMascota, fechaDeCreacion, idUsuarioAnunciante, idUsuarioSolicitante, estado) {
//       this.id = id;
//       this.idMascota = idMascota;
//       this.fechaDeCreacion = fechaDeCreacion;
//       this.idUsuarioAnunciante = idUsuarioAnunciante;
//       this.idUsuarioSolicitante = idUsuarioSolicitante;
//       this.estado = estado;
//     }
  
//   }
  
//   module.exports = Solicitud;
  