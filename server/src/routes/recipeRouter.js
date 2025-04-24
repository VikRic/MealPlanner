/**
 * @file Defines the home router.
 * @module homeRouter
 * @author Mats Loock
 */

import express from 'express'
import { RecipeController } from '../controllers/RecipeController.js'

export const router = express.Router()

const controller = new RecipeController()

router.get('/', (req, res, next) => controller.index(req, res, next))
router.post('/', (req, res, next) => controller.frontEndPost(req, res, next))
/* router.post('/', (req, res) => {
  console.log('Received Data:', req.body)
  res.json({ message: 'Data Received!' })
}) */
