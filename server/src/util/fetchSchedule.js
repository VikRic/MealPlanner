import cron from 'node-cron'
import { RecipeController } from '../controllers/RecipeController.js'
// This fetches 2 recipes every 1 hour.
cron.schedule('0 * * * *', async () => {
  const controller = new RecipeController()
  await controller.getReq(2)
  console.log('Fetching recipes')
})
