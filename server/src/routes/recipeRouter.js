/**
 * @file Defines the home router.
 * @module homeRouter
 * @author Mats Loock
 */

import express from 'express'
import { RecipeController } from '../controllers/RecipeController.js'

export const router = express.Router()

const controller = new RecipeController()

router.get('/', (req, res) => {
  res.json({ message: 'Recipe route is alive!' })
})
router.post('/', (req, res, next) => controller.frontEndPost(req, res, next))
