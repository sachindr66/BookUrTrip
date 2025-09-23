import express from 'express'
import { authenticateBusAPI, busBlock, busSearch, getBusBoardingPoint, getBusBook, getBusCityList, getBusSeatLayout } from '../controllers/auth.js'

const router=express.Router()

router.post('/authenticate',authenticateBusAPI)
router.post('/getBusCityList',getBusCityList)
router.post('/busSearch', busSearch)
router.post('/busSeatLayout', getBusSeatLayout)
router.post('/busBoardingPoint', getBusBoardingPoint)
router.post('/busBlock', busBlock)
// router.post('/busBlockSimple', busBlockSimple)
router.post('/getBusBook', getBusBook)


export default router
