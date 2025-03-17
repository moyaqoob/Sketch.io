"use client";

import React, { useState } from "react";
import { Input } from "../forms/input";

interface CreateRoomDialogBoxProps {
  onClose: (e: boolean) => void;
}

const CreateRoomDialogBox = ({ onClose }: CreateRoomDialogBoxProps) => {
  const [roomName, setRoomName] = useState("");

  return (
    <section
      className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-md z-50"
      onClick={() => onClose(false)} // Close when clicking outside
    >
      <div
        className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className="text-2xl font-semibold text-secondary mb-2">
          Create New Room
        </h2>

        {/* Input Field */}
        <Input
          placeholder="Room name"
          title="Enter a name for your room"
          type="text"
          required={true}
          value={roomName}
          onChange={(e) => {
            setRoomName(e.target.value);
          }}
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-6 font-bold">
          <button
            className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 transition"
            onClick={() => onClose(false)}
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-primary-darker text-white rounded-lg hover:bg-primary-chubb transition">
            Create Room
          </button>
        </div>
      </div>
    </section>
  );
};

export default CreateRoomDialogBox;
