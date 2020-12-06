import {
  CONNECTION_EVENT,
  DISCONNECT_EVENT,
  LOAD_MESSAGES,
  MESSAGE_EVENT,
} from "./shared/SocketEvents";


import { Server as SocketServer, Socket } from "socket.io";
import fs from "fs";
import { ChatLog, ProfileNameList } from "./shared/Chat";
import { getPrediction } from "./app";

let chatCount = 0
let tempString = ""

function getLogs(): ChatLog[] {
  return JSON.parse(fs.readFileSync("./chatlogs.json").toString())
}

export function filterLogs(args: { sender: ProfileNameList, reciever: ProfileNameList }): ChatLog[] {
  const logs = getLogs()
  const filteredLogs = (logs as ChatLog[]).filter(chatLog => {
    return chatLog.sender == args.sender && chatLog.reciever == args.reciever
  })

  return filteredLogs
}

export function setEventListener(io: SocketServer) {
  io.on(CONNECTION_EVENT, (socket: Socket) => {
    const id = socket.id;
    console.log(`socket ${id} has connected`);

    socket.on(DISCONNECT_EVENT, () => {
      console.log(`socket ${socket.id} has left`);
    });

    socket.on(MESSAGE_EVENT, async (chat: ChatLog) => {
      recieveChat(chat);
      chatCount += 1
      tempString += chat.content
      if (chatCount % 10 == 0) {
        const result = await getPrediction(tempString)
        console.log(result)
      }
    });

    socket.on(LOAD_MESSAGES, () => {
      const logs = getLogs()
      sendChat(logs as ChatLog[]);
    });
  });

  function recieveChat(chat: ChatLog) {
    const { content, reciever, sendTime, sender } = chat;
    console.log(`recieve chat from ${sender} to ${reciever} : ${content}`);
    const chatLogs = getLogs()
    chatLogs.push(chat)

    fs.writeFile('./chatlogs.json', JSON.stringify(chatLogs), (err) => {
      if (err) {
        throw err
      }
      sendChat(getLogs());
    });
  }

  function sendChat(chatLogs: ChatLog[]) {
    io.emit(MESSAGE_EVENT, { logs: chatLogs });
  }
}
