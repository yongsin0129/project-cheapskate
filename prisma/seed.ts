import { PrismaClient, Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { object } from 'joi'
const prisma = new PrismaClient()

async function main () {
  // 先選出現在資料庫中所有電影的 Id
  const MoiveIdArray: { id: string }[] = await prisma.movieList.findMany({
    select: { id: true }
  })

  // 先將 database 的使用者全部清空
  console.log(`users db reset ...`)
  await prisma.user.deleteMany({})

  // 開始製作假的使用者清單
  console.log(`users db Start seeding ...`)
  for (let index = 1; index <= 20; index++) {
    const user = await prisma.user.create({
      data: {
        name: `user${index}`,
        email: `user${index}@example.com`,
        password: bcrypt.hashSync('123456', 10),
        followedMovies: { connect: getArrayRandomElement(MoiveIdArray) }
      }
    })
    console.log(`create ${user.name} successfully`)
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

/********************************************************************************
*
          helper function
*
*********************************************************************************/
function getArrayRandomElement (array: { id: string }[]): { id: string }[] {
  const randomElementArray: { id: string }[] = []
  while (randomElementArray.length < 5) {
    const randomNumber = Math.floor(Math.random() * array.length)
    const randomElement = array[randomNumber]
    // 避免選到同一個 movie id
    if (!randomElementArray.includes(randomElement)) {
      randomElementArray.push(randomElement)
    }
  }
  return randomElementArray
}
