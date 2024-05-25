import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const ViewTicketReceipt = ({ onClose, ticketReceiptDetails }) => {
  const [editSeat, setEditSeat] = useState({
    modifySeat: false,
    availableSeats: { sectionA: [], sectionB: [] },
    currentSection: "",
    currentSeatNo: "",
    newSection: "",
    newSeatNo: "",
  });

  const currentSeatNo = ticketReceiptDetails.map((tkt) => tkt.seat.seatNumber);

  useEffect(() => {
    async function getAllTickets() {
      try {
        const respObj = await fetch(
          `http://localhost:8080/train/availableSeats`,
          {
            method: "GET",
          }
        );

        if (!respObj.ok) {
          const errorResponse = await respObj.json();
          throw new Error(errorResponse.error);
        }
        const response = await respObj.json();
        setEditSeat({
          ...editSeat,
          availableSeats: {
            sectionA: response.sectionA,
            sectionB: response.sectionB,
          },
        });
      } catch (error) {
        toast.error(error.message, { position: "bottom-right" });
      }
    }

    getAllTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const deleteTicket = async (tkt) => {
    try {
      const respObj = await fetch(
        `http://localhost:8080/train/ticket/${tkt._id}`,
        {
          method: "DELETE",
        }
      );

      if (!respObj.ok) {
        const errorResponse = await respObj.json();
        throw new Error(errorResponse.error);
      }

      const response = await respObj.json();
      toast.success(response, { position: "bottom-right" });
      onClose("viewTktSection");
    } catch (error) {
      onClose("viewTktSection");
      toast.error(error.message, { position: "bottom-right" });
    }
  };

  const handleInputChange = (e, field) => {
    setEditSeat({ ...editSeat, [field]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (editSeat.currentSection !== "A" && editSeat.currentSection !== "B") {
      toast.error("Invalid current section");
      return;
    }

    else if (editSeat.newSection !== "A" && editSeat.newSection !== "B") {
      toast.error("Invalid new section");
      return;
    }

    else if(editSeat.availableSeats.sectionA.length === 0 && !editSeat.availableSeats.sectionA  && editSeat.newSection === "A"){
      toast.error("Seats are not available in Section A");
      return; 
    }

    else if(editSeat.availableSeats.sectionB.length === 0 && !editSeat.availableSeats.sectionB  && editSeat.newSection === "B"){
      toast.error("Seats are not available in Section B");
      return; 
    }

    else if (!currentSeatNo.includes(+editSeat.currentSeatNo)) {
      toast.error("Invalid current seat number");
      return;
    }

    else if (editSeat.newSection === "A" && !editSeat.availableSeats.sectionA.includes(+editSeat.newSeatNo)) {
      toast.error("New seat number you entered  not available in Section A");
      return;
    }

    else if (editSeat.newSection === "B" && !editSeat.availableSeats.sectionB.includes(+editSeat.newSeatNo)) {
      toast.error("New seat number you entered  not available in Section B");
      return;
    }

    try {
      const respObj = await fetch(
        `http://localhost:8080/train/ticket`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({currentSection: editSeat.currentSection.toUpperCase(),newSection: editSeat.newSection.toUpperCase(), currentSeatNo: editSeat.currentSeatNo, newSeatNo: editSeat.newSeatNo}),
        }
      );

      if (!respObj.ok) {
        const errorResponse = await respObj.json();
        throw new Error(errorResponse.error);
      }

      const response = await respObj.json();
      toast.success(response, { position: "bottom-right" });
      onClose("viewTktSection");
    } catch (error) {
      onClose("viewTktSection");
      toast.error(error.message, { position: "bottom-right" });
    }

  };

  return (
    <>
      {ticketReceiptDetails.length > 0 && ticketReceiptDetails ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <h1
              style={{
                textAlign: "left",
                fontSize: "28px",
                color: "green",
              }}
            >
              {ticketReceiptDetails[0].user.firstName}{" "}
              {ticketReceiptDetails[0].user.lastName} Booked Train Seats
              Overview
            </h1>

            <button
              className="edit"
              onClick={() =>
                setEditSeat({ ...editSeat, modifySeat: !editSeat.modifySeat })
              }
            >
              Edit
            </button>
          </div>
          {editSeat.modifySeat && (
            <form className="update-seat" onSubmit={handleSubmit}>
              <label htmlFor="currentSection">Current Section:</label>
              <input
                required
                type="text"
                placeholder="Enter a current section"
                value={editSeat.currentSection}
                onChange={(e) => handleInputChange(e, "currentSection")}
              />

              <label htmlFor="currentSeatNumber">Current Seat Number:</label>
              <input
                required
                type="number"
                min={1}
                max={50}
                placeholder="Enter a current seat number"
                value={editSeat.currentSeatNo}
                onChange={(e) => handleInputChange(e, "currentSeatNo")}
              />

              <label htmlFor="newSection">New Section:</label>
              <input
                required
                type="text"
                placeholder="Enter a new section"
                value={editSeat.newSection}
                onChange={(e) => handleInputChange(e, "newSection")}
              />

              <label htmlFor="newSeatNumber">New Seat Number:</label>
              <input
                required
                type="number"
                min={1}
                max={50}
                placeholder="Enter a new seat number"
                value={editSeat.newSeatNo}
                onChange={(e) => handleInputChange(e, "newSeatNo")}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  marginTop: "20px",
                }}
              >
                <button
                  type="submit"
                  className="btn"
                  style={{ backgroundColor: "blue" }}
                >
                  Update
                </button>
              </div>
            </form>
          )}
          {editSeat.modifySeat && (
            <h1
              style={{
                textAlign: "left",
                fontSize: "28px",
                color: "purple",
              }}
            >
              Available Seats
            </h1>
          )}
          {editSeat.modifySeat && (
            <div className="available-seats-container">
              <h3>Section A</h3>

              {editSeat.availableSeats.sectionA.length > 0 ? (
                <div className="available-seats-card">
                  {editSeat.availableSeats.sectionA.map((seatNo) => (
                    <div key={seatNo} style={+editSeat.newSeatNo === seatNo && editSeat.newSection === "A" ? {backgroundColor: "green", color: "white"} : {}}>{seatNo}</div>
                  ))}
                </div>
              ) : (
                <div>No available seats in section A.</div>
              )}
            </div>
          )}
          {editSeat.modifySeat && (
            <div className="available-seats-container">
              <h3>Section B</h3>

              {editSeat.availableSeats.sectionB.length > 0 ? (
                <div className="available-seats-card">
                  {editSeat.availableSeats.sectionB.map((seatNo) => (
                    <div key={seatNo} style={+editSeat.newSeatNo === seatNo && editSeat.newSection === "B" ? {backgroundColor: "green", color: "white"} : {}}>{seatNo}</div>
                  ))}
                </div>
              ) : (
                <div>No available seats in section B.</div>
              )}
            </div>
          )}
          <table className="table-container">
            <tbody>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>From</th>
                <th>To</th>
                <th>Section</th>
                <th>Seat Number</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>

              {ticketReceiptDetails.map((tkt) => (
                <tr key={tkt._id}>
                  <td>{tkt.user.firstName}</td>
                  <td>{tkt.user.lastName}</td>
                  <td>{tkt.from}</td>
                  <td>{tkt.to}</td>
                  <td>{tkt.seat.section}</td>
                  <td>{tkt.seat.seatNumber}</td>
                  <td>{tkt.pricePaid}</td>
                  <td
                    style={{ textAlign: "center", cursor: "pointer" }}
                    onClick={() => deleteTicket(tkt)}
                  >
                    <img src="/icons/trash.svg" alt="trash" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>{" "}
        </>
      ) : (
        <div
          style={{
            padding: "20px 0px",
            textAlign: "center",
            fontSize: "20px",
            fontWeight: "500",
          }}
        >
          You have not booked any tickets yet.
        </div>
      )}
    </>
  );
};

export default ViewTicketReceipt;
