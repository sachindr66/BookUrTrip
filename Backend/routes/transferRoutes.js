import express from 'express'

import { authenticataTransferAPI, countryList, getDestinationSearchStaticData } from "../controllers/transfer.js";



const routes=express.Router()

routes.post("/transfer/authenticate",authenticataTransferAPI)
routes.post("/transfer/countrylist",countryList)
routes.post("/transfer/getDestinationSearchStaticData", getDestinationSearchStaticData)

export default routes