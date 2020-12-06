import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { HomePage } from "./pages/HomePage";
import "./modules/ChatModule";
import { LoginModal, ProfileComponentSmall } from "./components/LoginModel";
import { profiles } from "./profiles";
import { createContinue } from "typescript";
import { profile } from "console";
import { loadMessages } from "./modules/ChatModule";

export const ProfileContext = createContext<Profile | null>(null);
export const SetProfileContext = createContext<Dispatch<
  SetStateAction<Profile | null>
> | null>(null);
export const ChatContext = createContext<ProfileNameList | null>(null);
export const SetChatContext = createContext<Dispatch<
  SetStateAction<ProfileNameList | null>
> | null>(null);

function getProfileFromLocalStorage(): Profile | null {
  const name = localStorage.getItem("name") as ProfileNameList | undefined;
  console.log(`current logged in user : ${name}`);
  if (name) {
    const profile = profiles.get(name);
    return profile ? profile : null;
  } else {
    return null;
  }
}

export function App() {
  const profile = useContext(ProfileContext)!;
  const setProfile = useContext(SetProfileContext)!;

  useEffect(() => {
    setProfile(getProfileFromLocalStorage());
    loadMessages();
  }, []);

  return (
    <div className="app">
      {!profile && (
        <LoginModal
          onSelect={(profile) => {
            setProfile(profile);
            localStorage.setItem("name", profile.name);
          }}
        />
      )}
      <div className="top-bar">
        <div className="title">
          <label>오늘의 긍정채팅</label>
          <h2>정말</h2>
        </div>
        <ProfileComponentSmall profile={profile} />
      </div>
      <div className="main">
        <BrowserRouter>
          <Switch>
            <Route path="/" exact>
              <HomePage />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );
}

export function ContextProvider(props: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [chat, setChat] = useState<ProfileNameList | null>(null);

  return (
    <ProfileContext.Provider value={profile}>
      <SetProfileContext.Provider value={setProfile}>
        <ChatContext.Provider value={chat}>
          <SetChatContext.Provider value={setChat}>
            {props.children}
          </SetChatContext.Provider>
        </ChatContext.Provider>
      </SetProfileContext.Provider>
    </ProfileContext.Provider>
  );
}
