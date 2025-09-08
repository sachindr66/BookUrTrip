import express from 'express'
import { authenticateBusAPI, busSearch, getBusCityList, getBusSeatLayout } from '../controllers/auth.js'

const router=express.Router()

router.post('/authenticate',authenticateBusAPI)
router.post('/getBusCityList',getBusCityList)
router.post('/busSearch', busSearch)
router.post('/busSeatLayout', getBusSeatLayout)

export default router
