import express from 'express'
import {getAllJoyas, getFilterJoyas} from '../controllers/joyasController.js'

const router = express.Router()

router.get('/joyas', getAllJoyas)
router.get('/joyas/filtros', getFilterJoyas)

export default router