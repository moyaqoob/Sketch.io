"use client";

import { Plus, Users } from "lucide-react";
import React, { useState } from "react";
import CreateRoomDialogBox from "@/components/dialogbox/create-room-dialogbox";
import JoinRoomDialogBox from "../dialogbox/join-room-dialogBox";

const Actions = () => {
  const [createRoom, setCreateRoom] = useState(false);
  const [joinRoom, setJoinRoom] = useState(false);

  return (
    <section className="flex justify-between md:flex-row flex-col gap-6 items-center max-w-7xl mx-auto mt-28 px-4">
      {/* Create New Room Card */}
      <div
        className="w-full  p-6 bg-white rounded-2xl shadow-lg border border-gray-200 transition hover:shadow-xl hover:bg-gray-50 flex items-center gap-4"
        onClick={() => {
          setCreateRoom(true);
        }}
        aria-label="Create Room"
      >
        <span className="rounded-xl p-3 bg-gray-200 w-fit">
          <Plus className="text-red-500 w-8 h-8" />
        </span>
        <div className="text-start">
          <h1 className="text-xl font-semibold text-gray-800">
            Create New Room
          </h1>
          <p className="text-gray-600 mt-1">
            Start a new collaborative drawing session
          </p>
        </div>
      </div>

      {/* Join Existing Room Card */}
      <div
        className="w-full p-6 bg-white rounded-2xl shadow-lg border border-gray-200 transition hover:shadow-xl hover:bg-gray-50 flex items-center gap-4"
        onClick={() => {
          setJoinRoom(true);
        }}
        aria-label="Join Room"
      >
        <span className="rounded-xl p-3 bg-gray-200 w-fit">
          <Users className="w-8 h-8 text-green-600" />
        </span>
        <div className="text-start">
          <h1 className="text-xl font-semibold text-gray-800">
            Join Existing Room
          </h1>
          <p className="text-gray-600 mt-1">Enter a room code to collaborate</p>
        </div>
      </div>
      {createRoom && <CreateRoomDialogBox onClose={setCreateRoom} />}
      {joinRoom && <JoinRoomDialogBox onClose={setJoinRoom} />}
    </section>
  );
};

export default Actions;
