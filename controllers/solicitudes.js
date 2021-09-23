// const Solicitud = require('../models/Solicitud')

// // CRUD

// function crearSolicitud(req, res){
// 	var solicitud = new Solicitud(req.body);
// 	res.status(200).send(solicitud);
// }

// function obtenerSolicitud(req, res){
// 	var solicitud1 = new Solicitud(1, 2, '25/06/2021', 3, 2, 'Activa')
//   	var solicitud2 = new Solicitud(2, 5, '5/12/2021', 4, 1, 'Rechazada')
//   	res.send([solicitud1,solicitud2])
// }

// function modificarSolicitud(req, res){
// 	var solicitud = new Solicitud(req.params.id,2, '25/06/2021', 3, 2, 'Activa')
// 	var modificaciones = req.body
// 	solicitud = {...solicitud,...modificaciones }
// 	res.send(solicitud)
// }

// function eliminarSolicitud(req, res){
// 	res.status(200).send(`La solicitud ${req.params.id} se elimino`)
// }

const mongoose = require('mongoose');
const Solicitud = mongoose.model("Solicitud");

// -----------CRUD para el modelo de Solicitudes
//Create - Insert
function crearSolicitud(req, res, next){
	const solicitud = new Solicitud(req.body);
	solicitud.save().then( soli => {
		res.status(200).send(soli);
	}).catch(next)
}

//Read - Select
function obtenerSolicitud(req, res, next){
	if (req.params.id) {
		Solicitud.findById(req.params.id)
		  .then(soli => {
			res.status(200).send(soli)
		  })
		  .catch(next)
	  } else {
		Solicitud.find()
		  .then(solicitudes => {
			res.status(200).send(solicitudes)
		  })
		  .catch(next)
	  }
}

//Update
function modificarSolicitud(req, res, next){
	Solicitud.findById(req.params.id)
	.then( solicitud => {
		//Si no existe la solicitud
		if (!solicitud){
			return res.status(404);
		}

		let nuevaInfo = req.body;
		if(typeof nuevaInfo.idmascota !== "undefined"){
			solicitud.idmascota = nuevaInfo.idmascota;
		}
		if(typeof nuevaInfo.idUsuarioAnunciante !== "undefined"){
			solicitud.idUsuarioAnunciante = nuevaInfo.idUsuarioAnunciante;
		}
		if(typeof nuevaInfo.idUsuarioSolicitante !== "undefined"){
			solicitud.idUsuarioSolicitante = nuevaInfo.idUsuarioSolicitante;
		}
		if(typeof nuevaInfo.estado !== "undefined"){
			solicitud.estado = nuevaInfo.estado;
		}
		solicitud.save()
		.then( solicitud =>{
			res.status(200).send(solicitud.publicData());
		})
		.catch(next)

	})
}

//Delete
function eliminarSolicitud(req, res, next){
	Solicitud.findOneAndDelete({ _id: req.params.id })
  .then(r => {
      res.status(200).send(`Solicitud ${req.params.id} eliminada: ${r}`);
    })
  .catch(next)
}

//Numero de solicitudes por mascota
function count(req,res,next){
	const idmascota = mongoose.Types.ObjectId(req.params.idm);
	Solicitud.aggregate([
		{
		  '$match': {
			'idmascota': idmascota
		  }
		}, {
		  '$count': 'total'
		}
	  ]).then( r =>{
		  res.status(200).send(r);
	  })
	  .catch(next)
}
module.exports = {
	crearSolicitud,
	obtenerSolicitud,
	modificarSolicitud,
	eliminarSolicitud,
	count
}

