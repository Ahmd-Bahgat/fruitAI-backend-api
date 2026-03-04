import { createClient } from "redis";

export const client = createClient({url:'redis://127.0.0.1:6379'})

client.on('error', (err) => console.log('Redis client error', err))

export const connectRedis = async () => {
    await client.connect()
    console.log('Redis connected successfully')
}
