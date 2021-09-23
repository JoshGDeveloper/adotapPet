const router = require('express').Router()

const {
	crearSolicitud,
	obtenerSolicitud,
	modificarSolicitud,
	eliminarSolicitud,
	count
} = require('../controllers/solicitudes');

router.get('/', obtenerSolicitud);
router.get('/count/:idm', count);
router.get('/:id', obtenerSolicitud);
router.post('/', crearSolicitud);
router.put('/:id', modificarSolicitud);
router.delete('/:id', eliminarSolicitud);

module.exports = router;
