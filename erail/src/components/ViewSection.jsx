import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ViewSection = ({ onClose }) => {
  const [ticketList, setTicketList] = useState({
    sectionA: [],
    sectionB: [],
    selectedView: "A",
  });

  useEffect(() => {
    async function getAllTickets() {
      try {
        const respObj = await fetch(`http://localhost:8080/train/tickets`, {
          method: "GET",
        });

        if (!respObj.ok) {
          const errorResponse = await respObj.json();
          throw new Error(errorResponse.error);
        }
        const response = await respObj.json();
        setTicketList({
          ...ticketList,
          sectionA: response.sectionA,
          sectionB: response.sectionB,
        });
      } catch (error) {
        toast.error(error.message, { position: "bottom-right" });
      }
    }

    getAllTickets();
  }, []);

  return (
    <>
      <div className="section-view-flex">
        <div
          className={`${ticketList.selectedView === "A" && "selected"} view`}
          style={
            ticketList.selectedView === "A"
              ? {
                  borderTopLeftRadius: "8px",
                  borderBottomLeftRadius: "8px",
                }
              : {}
          }
          onClick={() => setTicketList({ ...ticketList, selectedView: "A" })}
        >
          SectionA
        </div>
        <div
          className={`${ticketList.selectedView === "B" && "selected"} view`}
          style={
            ticketList.selectedView === "B"
              ? {
                  borderTopRightRadius: "8px",
                  borderBottomRightRadius: "8px",
                }
              : {}
          }
          onClick={() => setTicketList({ ...ticketList, selectedView: "B" })}
        >
          SectionB
        </div>
      </div>

      {((ticketList.selectedView === "A" && ticketList.sectionA.length > 0) || (ticketList.selectedView === "B" && ticketList.sectionB.length > 0)) ? <table className="table-container">
        <tbody>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>From</th>
            <th>To</th>
            <th>Section</th>
            <th>Seat Number</th>
            <th>Price</th>
          </tr>

          {ticketList.selectedView === "A" ? ticketList.sectionA.length > 0 &&
            ticketList.sectionA.map((tkt) => (
              <tr key={tkt._id}>
                <td>{tkt.user.firstName}</td>
                <td>{tkt.user.lastName}</td>
                <td>{tkt.from}</td>
                <td>{tkt.to}</td>
                <td>{tkt.seat.section}</td>
                <td>{tkt.seat.seatNumber}</td>
                <td>{tkt.pricePaid}</td>
              </tr>
            ))
            : ticketList.sectionB.length > 0 && 
            ticketList.sectionB.map((tkt) => (
              <tr key={tkt._id}>
                <td>{tkt.user.firstName}</td>
                <td>{tkt.user.lastName}</td>
                <td>{tkt.from}</td>
                <td>{tkt.to}</td>
                <td>{tkt.seat.section}</td>
                <td>{tkt.seat.seatNumber}</td>
                <td>{tkt.pricePaid}</td>
              </tr>
            ))
          }
        </tbody>
      </table> : <div className="not-found-section-seats">No seats available in section {ticketList.selectedView === "A" ? "A" : "B"}</div>}

      <div style={{ display: "flex", justifyContent: "end" }}>
        <button
          type="button"
          className="btn"
          style={{
            backgroundColor: "red",
            padding: "8px 20px 8px",
            fontSize: "16px",
          }}
          onClick={() => onClose("viewSectionTkt")}
        >
          Close
        </button>
      </div>
    </>
  );
};

export default ViewSection;
