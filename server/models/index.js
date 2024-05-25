import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
});

const seatSchema = new mongoose.Schema({
  section: { type: String, enum: ["A", "B"], required: true },
  seatNumber: { type: Number, required: true },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
});

const ticketSchema = new mongoose.Schema({
  from: { type: String, required: true, default: "Mumbai" },
  to: { type: String, required: true, default: "Ahmedabad" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  seat: { type: mongoose.Schema.Types.ObjectId, ref: "Seat" },
  pricePaid: { type: Number, default: 20 },
});

export const User = mongoose.model("User", userSchema);
export const Seat = mongoose.model("Seat", seatSchema);
export const Ticket = mongoose.model("Ticket", ticketSchema);
