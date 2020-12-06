import { io } from "socket.io-client";
import { profiles } from "../profiles";
import { LOAD_MESSAGES, MESSAGE_EVENT } from "../shared/SocketEvents";

console.log(`${location.hostname}:5001`);
export const serverUrl = `${location.hostname}:5001`;

const socket = io(serverUrl, {
  transports: ["websocket", "polling", "flashsocket"],
});

const listeners: ((chat: ChatLog[]) => void)[] = [];
socket.on(MESSAGE_EVENT, (args: { logs: ChatLog[] }) => {
  const { logs: chatLogs } = args;
  console.log(`${chatLogs.length} of chat logs recieved`, chatLogs);
  listeners.forEach((listener) => listener(chatLogs));
});

export function sendMessage(chatLog: ChatLog) {
  socket.emit(MESSAGE_EVENT, chatLog);
}

export function loadMessages() {
  socket.emit(LOAD_MESSAGES);
}

export function setChatListener(callback: (chatLogs: ChatLog[]) => void) {
  listeners.push(callback);
}

export function getProfile(props: { name: ProfileNameList }): Profile {
  const profile = profiles.get(props.name);
  if (!profile) {
    throw new Error("cannot get profile from name");
  }
  return profile;
}


interface PredictResult {
  isPositive: boolean,
  positiveRate: number
}
export async function predictChatRoom(props: { sender: ProfileNameList, reciever: ProfileNameList }): Promise<PredictResult> {
  const url = `http://${serverUrl}/predict?sender=${props.sender}&reciever=${props.reciever}`
  const response = await fetch(url)
  const result = await response.json()
  if (result.ok) {
    return { isPositive: result.isPositive, positiveRate: result.positiveRate }
  } {
    throw result.error_message
  }
}

interface IsPositiveResponse {
  ok: boolean,
  isPositive?: boolean
  error_message?: string
}

export async function getPrediction(input: string): Promise<IsPositiveResponse> {
  const url = encodeURI(`http://localhost:5001/predict/${input}`)

  const result = await fetchFromUrl<IsPositiveResponse>(url)
  return result
}

async function fetchFromUrl<T>(url: string): Promise<T> {
  const response = await fetch(url)
  const result = await response.json() as unknown
  return result as T
}