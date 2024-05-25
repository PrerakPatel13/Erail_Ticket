
import express from "express";
import { bookTicket, getUserReceipt, getTicketList, deleteTicket, getAvailableSeats, udpateTicket } from "../controllers/index.js";

const router = express.Router();

router.post("/bookTicket", bookTicket);

router.get("/receipt/:email", getUserReceipt);

router.get("/availableSeats", getAvailableSeats);

router.get("/tickets", getTicketList);

router.put("/ticket", udpateTicket);

router.delete("/ticket/:id", deleteTicket);

export default router;