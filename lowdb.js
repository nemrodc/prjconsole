import { JSONPreset } from 'lowdb/node'

// Read or create db.json
const defaultData = { uid: '' }
const db = await JSONPreset('db.json', defaultData)

export default db;