import cron from 'node-cron'
import { RecipeController } from '../controllers/RecipeController.js'
import { RecipeModel } from '../models/RecipeModel.js'
// This fetches 2 recipes every 1 hour.
cron.schedule('0 * * * *', async () => {
  const controller = new RecipeController()
  await controller.getReq(2)
  console.log('Fetching recipes')
})

cron.schedule('*/5 * * * *', async () => {
  try {
    await RecipeModel.findOne()

    console.log('Sending heartbeat recipes')
  } catch {
    console.error('Heartbeat failed')
  }
})
