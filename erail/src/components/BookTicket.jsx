import React, { useState } from "react";
import  toast from "react-hot-toast";

const BookTicket = ({ onClose }) => {
  const [ticketDetails, setTicketDetails] = useState({
    from: "Mumbai",
    to: "Ahmedabad",
    firstName: "",
    lastName: "",
    email: "",
  });

  const handleInputChange = (e, field) => {
    setTicketDetails({
      ...ticketDetails,
      [field]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const respObj = await fetch("http://localhost:8080/train/bookTicket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(ticketDetails)
      });

      if (!respObj.ok) {
        const errorResponse = await respObj.json();
        throw new Error(errorResponse.error);
      }
      const response = await respObj.json();
      onClose("bookTkt");
      toast.success(response.message, {position: 'bottom-right'});
    } catch (error) {
      toast.error(error.message, {position: 'bottom-right'});
      onClose("bookTkt");
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="input-container" style={{ paddingTop: "20px" }}>
        <label htmlFor="from">From</label>

        <input
          readOnly
          required
          type="text"
          placeholder="Departure city"
          value={ticketDetails.from}
        />
      </div>

      <div className="input-container">
        <label htmlFor="to">To</label>

        <input
          readOnly
          required
          type="text"
          placeholder="Destination city"
          value={ticketDetails.to}
        />
      </div>

      <div className="input-container">
        <label htmlFor="firstName">First Name</label>

        <input
          required
          type="text"
          placeholder="Enter you first name"
          value={ticketDetails.firstName}
          onChange={(e) => handleInputChange(e, "firstName")}
        />
      </div>

      <div className="input-container">
        <label htmlFor="lastName">Last Name</label>

        <input
          required
          type="text"
          placeholder="Enter you last name"
          value={ticketDetails.lastName}
          onChange={(e) => handleInputChange(e, "lastName")}
        />
      </div>

      <div className="input-container">
        <label htmlFor="email">Email</label>

        <input
          required
          type="email"
          placeholder="Enter you email address"
          value={ticketDetails.email}
          onChange={(e) => handleInputChange(e, "email")}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "end",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "10px",
        }}
      >
        <button
          type="button"
          className="btn"
          style={{
            backgroundColor: "#e74c3c",
            padding: "8px 20px 8px",
            fontSize: "16px",
          }}
          onClick={() => onClose("bookTkt")}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn book-btn"
          style={{ padding: "8px 20px 8px", fontSize: "16px" }}
        >
          Book
        </button>
      </div>
    </form>
  );
};

export default BookTicket;
