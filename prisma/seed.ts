import { PrismaClient, Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main () {
  console.log(`users db reset ...`)
  await prisma.user.deleteMany({})
  console.log(`users db Start seeding ...`)

  for (let index = 1; index <= 10; index++) {
    const user = await prisma.user.create({
      data: {
        name: `user${index}`,
        email: `user${index}@example.com`,
        password: bcrypt.hashSync('123456', 10)
      }
    })
    console.log(`Created user with id: ${user.id}`)
  }

  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
