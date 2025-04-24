import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
/**
 * @file Defines the HomeController class.
 * @module HomeController
 * @author Mats Loock
 */

/**
 * Encapsulates a controller.
 */
export class HomeController {
  /**
   * Renders a view and sends the rendered HTML string as an HTTP response.
   * index GET.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  index (req, res) {
    const directoryFullName = dirname(fileURLToPath(import.meta.url))
    res.sendFile(join(directoryFullName, '..', '..', '..', 'client', 'build', 'index.html'))
  }
}
