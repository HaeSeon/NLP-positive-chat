import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ChatContext as FriendNameContext,
  ProfileContext,
  SetChatContext as SetFriendContext,
} from "../App";
import {
  predictChatRoom,
  getPrediction,
  getProfile,
  loadMessages,
  sendMessage,
  setChatListener,
} from "../modules/ChatModule";
import {
  enterKeyPressListener,
  handleInputChange,
} from "../modules/DocumentModule";
import { getCurrentTime } from "../modules/TimeModules";
import { PROFILE_BABY_OGU } from "../profiles";

export function ChatRoomItemComponent(props: {
  profile: Profile;
  lastMessage: string;
  // unreadCount: number;
}) {
  const { profile, lastMessage } = props;
  const setFriend = useContext(SetFriendContext)!;

  return (
    <div
      className="chat-room-item-component"
      onClick={() => {
        setFriend(profile.name);
      }}
    >
      <img
        className="profile-image"
        src={profile.imageSrc}
        alt={require("../images/profiles/default.png")}
      ></img>
      <div className="chat-room-information">
        <h3 className="chat-room-title">{profile.name}</h3>
        <p className="last-message">{lastMessage}</p>
      </div>
      {/* <h3 className="icon">{unreadCount}</h3> */}
    </div>
  );
}

function isRelatedMessage(props: {
  myName: ProfileNameList | undefined;
  friendName: ProfileNameList | null;
  chat: ChatLog;
}) {
  const { chat, friendName, myName } = props;
  return (
    (chat.sender == myName && chat.reciever == friendName) ||
    (chat.sender == friendName && chat.reciever == myName)
  );
}

export function ChatComponent() {
  const [message, setMessage] = useState("채팅방 분석 중..")

  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const logsRef = useRef<HTMLDivElement>(null);

  const myProfile = useContext(ProfileContext);
  const [friend, setFriend] = useState<Profile>();
  const friendName = useContext(FriendNameContext);


  // const [positiveRate, setPositiveRate] = useState<PredictResult | null>(null)

  useEffect(() => {
    if (friendName) {
      const friendProfile = getProfile({ name: friendName });
      setFriend(friendProfile);
      loadMessages();
    }

    predictChatRoom({ sender: myProfile?.name || "해서니", reciever: friendName || "오구" }).then(result => {
      setMessage(`${parseRate(result.positiveRate)}% 만큼 ${result.isPositive ? "긍정" : "부정"}적이에요`)
    }).catch(err => {
      setMessage(`${err}`)
    })

  }, [friendName]);

  useEffect(() => {
    setChatListener(setChatLogs);
  }, []);

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }


    const PREDICT_PER_COUNT = 5
    const myMessages = chatLogs.filter(c => c.sender == myProfile?.name && c.reciever == friendName)
    if (myMessages.length % PREDICT_PER_COUNT == 0 && myMessages.length != 0) {
      const input = chatLogs.slice(chatLogs.length - 5, chatLogs.length).map(c => ` ${c.content} `).join("")
      getPrediction(input).then((isPositiveResult) => {
        if (isPositiveResult.ok && isPositiveResult.isPositive != undefined) {
          const isPositive = isPositiveResult.isPositive
          alertPositiveWarning(isPositive)
        }
      })
    }

    if (myMessages.length % PREDICT_PER_COUNT == 0 && myMessages.length != 0) {
      predictChatRoom({ sender: myProfile?.name || "해서니", reciever: friendName || "오구" }).then(result => {
        setMessage(`${parseRate(result.positiveRate)}% 만큼 ${result.isPositive ? "긍정" : "부정"}적이에요`)
      }).catch(err => {
        setMessage(`${err}`)
      })
    }
  }, [chatLogs]);

  function alertPositiveWarning(isPositive: boolean) {
    if (logsRef.current) {
      if (isPositive) {
        logsRef.current.className = "chat-logs positive"
        setTimeout(() => {
          if (logsRef.current)
            logsRef.current.className = "chat-logs"
        }, 1500)
      } else {
        logsRef.current.className = "chat-logs angry"
        setTimeout(() => {
          if (logsRef.current)
            logsRef.current.className = "chat-logs"
        }, 1500)
      }
    }
  }

  function parseRate(rate: number): number {
    return parseInt(`${rate * 100}`)
  }


  return (
    <div className="chat-component">
      {friend ? (
        <>
          <div className="title-container">
            <img className="profile-image" src={friend?.imageSrc}></img>
            <div>
              <h2 className="title">{friend?.name} 님과의 대화</h2>
              <p>{message}</p>
            </div>
          </div>
          <div className="chat-logs" ref={logsRef}>
            {chatLogs.map((chat) => {
              if (
                isRelatedMessage({
                  myName: myProfile?.name,
                  friendName: friendName,
                  chat,
                })
              ) {
                return <ChatLogComponent key={Math.random()} chatLog={chat} />;
              }
            })}
          </div>
          <ChatInputComponent />
        </>
      ) : (
          <>
            <h3 className="alert-message">대화 상대를 선택해주세요.</h3>
          </>
        )}
    </div>
  );
}

function ChatLogComponent(props: { chatLog: ChatLog }) {
  const myProfile = useContext(ProfileContext);
  const { content, sendTime, sender } = props.chatLog;

  return (
    <div
      className={`chat-log-component ${sender == myProfile?.name ? "me" : ""}`}
    >
      <div className="content">{content}</div>
    </div>
  );
}

function ChatInputComponent() {
  const friendName = useContext(FriendNameContext);
  const myProfile = useContext(ProfileContext);
  const [input, setInput] = useState("");

  return (
    <div className="chat-input-component">
      <input
        value={input}
        onChange={(ev) => {
          handleInputChange(ev, setInput);
        }}
        onKeyPress={(ev) => {
          enterKeyPressListener(ev, () => {
            if (myProfile && friendName && input != "") {
              const chatLog: ChatLog = {
                content: input,
                sender: myProfile.name,
                reciever: friendName,
                sendTime: getCurrentTime(),
              };
              sendMessage(chatLog);
              setInput("");
            }
          });
        }}
      ></input>
      <button className="send-button">전송</button>
    </div>
  );
}
