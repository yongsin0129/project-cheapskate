import express from 'express'

const router = express.Router()

router.get('/', async (req, res) => {
  res.send('this route is deprecated. try to use graphql api')
})

router.post('/', async (req, res) => {
  res.send('this route is deprecated. try to use graphql api')
})

router.put('/', async (req, res) => {
  res.send('this route is deprecated. try to use graphql api')
})

router.delete('/', async (req, res) => {
  res.send('this route is deprecated. try to use graphql api')
})

export default router
