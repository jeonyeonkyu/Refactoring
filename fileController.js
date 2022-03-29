import fs from 'fs'

export const readJSON = (path) => JSON.parse(fs.readFileSync(path, 'utf-8'))
