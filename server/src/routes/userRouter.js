import express from 'express'
import { UserController } from '../controllers/UserController.js'
import { requireAuth } from '../middleWare/requireAuth.js'
export const router = express.Router()

const controller = new UserController()

router.get('/', requireAuth, (req, res, next) => controller.getRecipes(req, res, next))

router.get('/cuisines', requireAuth, (req, res, next) => controller.findCuisine(req, res, next))

router.post('/', requireAuth, (req, res, next) => controller.createRecipe(req, res, next))

router.post('/delete', requireAuth, (req, res, next) => controller.deleteRecipe(req, res, next))
