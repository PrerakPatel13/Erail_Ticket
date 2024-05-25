import React, { useState } from "react";
import  toast from "react-hot-toast";

const ViewTicketModal = ({ onClose, openTicketSection }) => {
  const [inputData, setInputData] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const respObj = await fetch(`http://localhost:8080/train/receipt/${inputData}`, {
        method: "GET",
      });

      if (!respObj.ok) {
        const errorResponse = await respObj.json();
        throw new Error(errorResponse.error);
      }
      const response = await respObj.json();
      openTicketSection(response);
    } catch (error) {
      onClose("viewTktModal");
      toast.error(error.message, {position: 'bottom-right'});
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <div className="input-container" style={{ paddingTop: "20px" }}>
        <label htmlFor="email">Email</label>

        <input
          required
          type="email"
          placeholder="Enter your email"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
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
          onClick={() => onClose("viewTktModal")}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="btn book-btn"
          style={{ padding: "8px 20px 8px", fontSize: "16px" }}
        >
          View
        </button>
      </div>
    </form>
  );
};

export default ViewTicketModal;
