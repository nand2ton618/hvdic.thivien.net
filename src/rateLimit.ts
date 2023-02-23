import fs from 'fs'
import path from 'path'

const filePath = path.join(__dirname, '..', 'position.txt')

const getPosition = (): number => {
  const position = Number(fs.readFileSync(filePath).toString())
  return position
}

const savePosition = (position: number) => {
  fs.writeFileSync(filePath, position.toString())
}

export { getPosition, savePosition }
