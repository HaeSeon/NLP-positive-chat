export type ProfileNameList =
  | "아기오구"
  | "오구"
  | "오버토끼"
  | "토끼"
  | "해서니"
  | "판다몬";

export interface ChatLog {
  sender: ProfileNameList;
  reciever: ProfileNameList;
  sendTime: number;
  content: string;
}
