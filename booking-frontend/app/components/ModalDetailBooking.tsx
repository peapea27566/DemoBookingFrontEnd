import React, { useState } from "react";
import { Event } from "../models/Event";
import { GetYearMonth } from "../until/DateTimeHelper";
import ModalAction from "./ModalAction";
import BookingService from "../services/BookingService";
import { toast } from "react-toastify";
import { ModalContent } from "../models/ModalContent";
import { useLoading } from "../context/LoadingContext";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  updateSuccess: (date: DateCallback) => void;
  selectedEvent: Event | null;
}

export interface DateCallback {
  year: number;
  month: number;
  day: number;
}

const ModalDetailBooking: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  selectedEvent,
  updateSuccess,
}) => {
  if (!isOpen || !selectedEvent) return null;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    message: "",
    action: null,
  });

  const handleActionClick = (actionType: string) => {
    let title = "";
    let message = "";
    let action = null;

    if (actionType === "Check in") {
      title = "Confirm Check in";
      message = "Are you sure you want to check in this booking?";
      action = () => handleUpdateStatusBooking(1);
    } else if (actionType === "Check Out") {
      title = "Confirm Check Out";
      message = "Are you sure you want to check out this booking?";
      action = () => handleUpdateStatusBooking(2);
    } else if (actionType === "Reject") {
      title = "Confirm Rejection";
      message = "Are you sure you want to reject this booking?";
      action = () => handleUpdateStatusBooking(3);
    }

    setModalContent({ title, message, action });
    setIsModalOpen(true);
  };


  const {setLoading , setMessage}  = useLoading();

  const handleUpdateStatusBooking = async (status: number) => {
    setMessage("Please wait a moment. Booking is being updated.")
    setLoading(true);
    
    try {
      const response = await BookingService.updateStatusBooking(
        selectedEvent.booking.id,
        status
      );
      if (response.status === 201 || response.status == 200) {
        toast.success(response.message);
        const { year, month, day } = GetYearMonth(
          selectedEvent.booking.checkInDate
        );

        updateSuccess({ year, month, day });
        onClose();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
    }finally{
      setLoading(false)
    }
  };

  const handleModalConfirm = () => {
    if (modalContent.action) {
      modalContent.action();
    }
    setIsModalOpen(false);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const startDate = GetYearMonth(selectedEvent.booking.checkInDate);
  const endDate = GetYearMonth(selectedEvent.booking.checkOutDate);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-50">
      <div className="bg-white w-[400px] p-6 rounded-xl shadow-lg relative animate-fade-in">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {!selectedEvent.booking.note
              ? "No topic"
              : selectedEvent.booking.note}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700 transition"
            onClick={onClose}
          >
            ✖
          </button>
        </div>

        <div className="text-gray-700 space-y-2">
          {selectedEvent.booking.checkInDate}
          {selectedEvent.booking.checkOutDate}
          <p className="flex justify-between">
            <span >
              <strong>Start:</strong> {startDate.year}-{startDate.month}-
              {startDate.day}
            </span>
            <span>
              <strong>End:</strong> {endDate.year}-{endDate.month}-{endDate.day}
            </span>
          </p>
          <p className="flex justify-between">
            <strong>Name:</strong>
            <span>{selectedEvent.booking.user.name}</span>
          </p>
          <p className="flex justify-between">
            <strong>Email:</strong>
            <span>{selectedEvent.booking.user.email}</span>
          </p>
          <p className="flex justify-between">
            <strong>Tel:</strong>
            <span>{selectedEvent.booking.user.tel}</span>
          </p>
          <p className="flex justify-between">
            <strong>Status:</strong>
            <span
              className={`font-semibold px-2 py-1 rounded-lg ${
                selectedEvent.booking.status === 0
                  ? "text-yellow-600 bg-yellow-100" // Wait (Yellow)
                  : selectedEvent.booking.status === 1
                  ? "text-blue-600 bg-blue-100" // Check-in (Blue)
                  : selectedEvent.booking.status === 2
                  ? "text-orange-600 bg-orange-100" // Check-out (Green)
                  : "text-red-600 bg-red-100" // Reject (Red)
              }`}
            >
              {selectedEvent.booking.status === 0
                ? "Wait"
                : selectedEvent.booking.status === 1
                ? "Check-in"
                : selectedEvent.booking.status === 2
                ? "Check-out"
                : "Reject"}
            </span>
          </p>
        </div>

        <div
          className={`flex justify-end space-x-3 mt-6 ${
            !selectedEvent.isMe ? "hidden" : ""
          }`}
        >
          {selectedEvent.status === 0 && (
            <button
              onClick={() => handleActionClick("Reject")}
              className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition"
            >
              Reject
            </button>
          )}

          {selectedEvent.status === 0 && selectedEvent.isToday && (
            <button
              onClick={() => handleActionClick("Check in")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Check in
            </button>
          )}
          {selectedEvent.status === 1 && (
            <button
              onClick={() => handleActionClick("Check Out")}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-orange-700 transition"
            >
              Check Out
            </button>
          )}
        </div>
      </div>

      <ModalAction
        isOpen={isModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />
    </div>
  );
};

export default ModalDetailBooking;
