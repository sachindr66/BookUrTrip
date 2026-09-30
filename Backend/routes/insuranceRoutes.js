
import express from "express"
import { authenticateInsuranceAPI, insurancerSearchAPI } from "../controllers/insurance.js"

const router=express.Router()

router.post('/authenticates',authenticateInsuranceAPI)
router.post('/insuranceSearch',insurancerSearchAPI)

export default router
