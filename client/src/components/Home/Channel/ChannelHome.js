import React from "react";
import ChatHome from "../Chat/ChatHome";
import ChannelInfo from "./ChannelInfo";
// importing Chat folder, putting all together for whole "Chatting Section"
export default function ChannelHome() {
  return (
    <>
      <ChatHome />
      <ChannelInfo />
    </>
  );
}
