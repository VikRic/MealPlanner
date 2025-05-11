/**
 * @file Defines the home router.
 * @module homeRouter
 * @author Mats Loock
 */
import express from 'express'
import { UserController } from '../controllers/UserController.js'

export const router = express.Router()

const controller = new UserController()

/* router.get('/', (req, res) => {
  const { userId } = getAuth(req)
  console.log(userId)
  res.json({ message: 'User route is alive!' })
}) */
/* router.get('/', (req, res, next) => controller.index(req, res, next)) */
router.get('/', (req, res, next) => controller.getRecipes(req, res, next))
router.post('/', (req, res, next) => controller.adder(req, res, next))
