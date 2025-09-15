import express from 'express'
import { authenticateBusAPI, busSearch, getBusBoardingPoint, getBusCityList, getBusSeatLayout } from '../controllers/auth.js'

const router=express.Router()

router.post('/authenticate',authenticateBusAPI)
router.post('/getBusCityList',getBusCityList)
router.post('/busSearch', busSearch)
router.post('/busSeatLayout', getBusSeatLayout)
router.post('/busBoardingPoint', getBusBoardingPoint)

export default router
