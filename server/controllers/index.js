import { User, Seat, Ticket } from "../models/index.js";

export const bookTicket = async (req, res) => {
  try {
    const { from, to, firstName, lastName, email } = req.body;
    let user;
    user = await User.findOne({ email: email });

    if (!user) {
      user = new User({
        firstName,
        lastName,
        email,
      });

      await user.save();
    }

    const seatsBookedInA = await Seat.countDocuments({
      section: "A",
    });

    const seatsBookedInB = await Seat.countDocuments({
      section: "B",
    });

    let sectionToBook;
    let seatNumberToBook;

    const findMissingNumbers = (arr, start, end) => {
      const allNumbers = new Set(
        Array.from({ length: end - start + 1 }, (_, i) => i + start)
      );
      const existingNumbers = new Set(arr);

      const missingNumbers = [...allNumbers].filter(
        (num) => !existingNumbers.has(num)
      );

      return missingNumbers;
    };

    if (seatsBookedInA < 50) {
      sectionToBook = "A";
      let seatNumbersInAscendingOrder = await Seat.find({
        section: "A",
      })
        .sort({ seatNumber: 1 })
        .select("seatNumber");

      seatNumbersInAscendingOrder = seatNumbersInAscendingOrder.map(
        (seat) => seat.seatNumber
      );

      seatNumberToBook = findMissingNumbers(seatNumbersInAscendingOrder, 1, 50);
    } else if (seatsBookedInB < 50) {
      sectionToBook = "B";
      let seatNumbersInAscendingOrder = await Seat.find({
        section: "B",
      })
        .sort({ seatNumber: 1 }) 
        .select("seatNumber");

      seatNumbersInAscendingOrder = seatNumbersInAscendingOrder.map(
        (seat) => seat.seatNumber
      );

      seatNumberToBook = findMissingNumbers(seatNumbersInAscendingOrder, 1, 50);
    } else {
      res
        .status(400)
        .json({ error: "No available seats in both section A and B" });
      return;
    }

    const newSeat = new Seat({
      section: sectionToBook,
      seatNumber:
        seatNumberToBook[Math.floor(Math.random(seatNumberToBook.length))],
      bookedBy: user._id,
    });

    await newSeat.save();

    const newTicket = new Ticket({
      user: user._id,
      seat: newSeat._id,
      pricePaid: 20, 
    });

    await newTicket.save();

    res.status(201).json({
      message: "Ticket created successfully",
      section: sectionToBook,
      seatNumber: seatNumberToBook,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getUserReceipt = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "Invalid Email" });
      return;
    }
    const ticketReceipts = await Ticket.find({ user: user._id })
      .populate({
        path: "user",
        model: User,
      })
      .populate({
        path: "seat",
        model: Seat,
      });

    res.status(200).json(ticketReceipts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getAvailableSeats = async (req, res) => {
  try {
    const findMissingNumbers = (arr, start, end) => {
      const allNumbers = new Set(
        Array.from({ length: end - start + 1 }, (_, i) => i + start)
      );
      const existingNumbers = new Set(arr);

      const missingNumbers = [...allNumbers].filter(
        (num) => !existingNumbers.has(num)
      );

      return missingNumbers;
    };

    let seatNumbersSectionA = await Seat.find({
      section: "A",
    })
      .sort({ seatNumber: 1 }) 
      .select("seatNumber");

    seatNumbersSectionA = seatNumbersSectionA.map((seat) => seat.seatNumber);

    seatNumbersSectionA = findMissingNumbers(seatNumbersSectionA, 1, 50);
    let seatNumbersSectionB = await Seat.find({
      section: "B",
    })
      .sort({ seatNumber: 1 }) 
      .select("seatNumber");

    seatNumbersSectionB = seatNumbersSectionB.map((seat) => seat.seatNumber);

    seatNumbersSectionB = findMissingNumbers(seatNumbersSectionB, 1, 50);

    res
      .status(200)
      .json({ sectionA: seatNumbersSectionA, sectionB: seatNumbersSectionB });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTicketList = async (req, res) => {
  try {
    const ticketList = await Ticket.find({})
      .populate({
        path: "user",
        model: User,
      })
      .populate({
        path: "seat",
        model: Seat,
      });

    const sectionViewTickets = {
      sectionA: [],
      sectionB: [],
    };

    ticketList.forEach((ticket) => {
      if (ticket.seat.section === "A") {
        sectionViewTickets.sectionA.push(ticket);
      } else {
        sectionViewTickets.sectionB.push(ticket);
      }
    });
    res.status(200).json(sectionViewTickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const udpateTicket = async (req, res) => {
  try {
    const { currentSection, newSection, currentSeatNo, newSeatNo } = req.body;

    const seat = await Seat.findOne({
      section: currentSection,
      seatNumber: currentSeatNo,
    });

    const ticket = await Ticket.findOne({
      seat: seat._id
    });

    const newSeat = new Seat({
      section: newSection,
      seatNumber: newSeatNo,
      bookedBy: ticket.user,
    });

    await newSeat.save();

    const newTicket = new Ticket({
      user: ticket.user,
      seat: newSeat._id,
      pricePaid: 20, 
    });

    await newTicket.save();

    const deletedSeat = await Seat.findOneAndDelete({
      _id: seat._id,
    });

    const deletedTicket = await Ticket.findOneAndDelete({
      _id: ticket._id,
    });
    
    res.status(200).json("Ticket updated successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    let { id } = req.params;

    const ticket = await Ticket.findOne({
      _id: id,
    });

    const deletedSeat = await Seat.findOneAndDelete({
      _id: ticket.seat._id,
    });

    const deletedTicket = await Ticket.findOneAndDelete({
      _id: id,
    });
    res.status(200).json("Ticket deleted successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
