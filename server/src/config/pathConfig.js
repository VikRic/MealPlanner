// I add this module to shorten the path when using it in my code to make it more clean.
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const clientBuildPath = path.join(__dirname, '..', '..', '..', 'client', 'build')

export { clientBuildPath }
