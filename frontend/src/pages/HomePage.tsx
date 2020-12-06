import React, { useContext, useEffect, useState } from "react";
import { ProfileContext } from "../App";
import {
  ChatComponent,
  ChatRoomItemComponent,
} from "../components/ChatComponents";
import { setChatListener } from "../modules/ChatModule";
import { profiles } from "../profiles";

export function HomePage() {
  const myProfile = useContext(ProfileContext);
  const sampleChatRooms: Profile[] = [];

  profiles.forEach((profile) => {
    if (myProfile && myProfile.name != profile.name) {
      sampleChatRooms.push(profile);
    }
  });

  const [logs, setLogs] = useState<ChatLog[]>([]);

  useEffect(() => {
    setChatListener((chatLogs) => {
      setLogs(chatLogs);
    });
  }, []);
  const [lastMessages, _] = useState<Map<ProfileNameList, string>>(new Map());
  useEffect(() => {
    let i = logs.length - 1;
    const checkedNames: ProfileNameList[] = [];
    const map = new Map<ProfileNameList, string>();
    for (; i >= 0; i--) {
      const log = logs[i];
      const sender = log.sender;
      const reciever = log.reciever;

      if (!checkedNames.includes(sender) && reciever == myProfile?.name) {
        map.set(sender, log.content);
        checkedNames.push(sender);
      }

      if (!checkedNames.includes(reciever) && sender == myProfile?.name) {
        map.set(reciever, log.content);
        checkedNames.push(reciever);
      }
    }
    _(map);
  }, [logs]);

  return (
    <div className="home-page">
      <div className="chat-list-container">
        <div className="chat-list">
          {sampleChatRooms.map((profile) => (
            <ChatRoomItemComponent
              key={Math.random()}
              profile={profile}
              lastMessage={lastMessages.get(profile.name) || ""}
            // unreadCount={0}
            />
          ))}
        </div>
      </div>
      <ChatComponent />
    </div>
  );
}
