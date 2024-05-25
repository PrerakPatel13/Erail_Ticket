import "./App.css";
import React, { useState } from "react";
import Modal from "./components/Modal";
import BookTicket from "./components/BookTicket";
import ViewTicketModal from "./components/ViewTicketModal";
import ViewTicketReceipt from "./components/ViewTicketReceipt";
import ViewSection from "./components/ViewSection";
import { Toaster } from "react-hot-toast";

function App() {
  const [isModalOpen, setModalOpen] = useState({
    bookTkt: false,
    viewTktModal: false,
    viewTktSection: false,
    viewTktDetails: [],
    viewSectionTkt: false,
  });

  const openTicketSection = (ticketReceipts) => {
    setModalOpen({ ...isModalOpen, viewTktSection: true, viewTktDetails: ticketReceipts, viewTktModal: false });
  };

  const closeModal = (modelType, openAnotherSection) => {
    setModalOpen({ ...isModalOpen, [modelType]: false });
  };

  return (
    <div>
      <div className="background">
        <Toaster />
        <h1>Welcome to Train Ticket Booking</h1>
        <div className="btn-container">
          <button
            type="button"
            className="btn book-btn"
            onClick={() => setModalOpen({ ...isModalOpen, bookTkt: true })}
          >
            Book ticket
          </button>

          <Modal isOpen={isModalOpen.bookTkt} onClose={closeModal} label="bookTkt">
            <BookTicket onClose={closeModal} />
          </Modal>

          <button
            type="button"
            className="btn view-tkt-btn"
            onClick={() => setModalOpen({ ...isModalOpen, viewTktModal: true })}
          >
            View ticket
          </button>

          <Modal isOpen={isModalOpen.viewTktModal} onClose={closeModal} label="viewTktModal">
            <ViewTicketModal onClose={closeModal} openTicketSection={openTicketSection} />
          </Modal>

          <Modal isOpen={isModalOpen.viewTktSection} onClose={closeModal} label="viewTktSection">
            <ViewTicketReceipt onClose={closeModal} ticketReceiptDetails={isModalOpen.viewTktDetails} />
          </Modal>

          <button
            type="button"
            className="btn view-section-btn"
            onClick={() => setModalOpen({ ...isModalOpen, viewSectionTkt: true })}
          >
            View section
          </button>

          <Modal isOpen={isModalOpen.viewSectionTkt} onClose={closeModal} label="viewSectionTkt">
            <ViewSection onClose={closeModal} />
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default App;
