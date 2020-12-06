import React from "react";
import {
  PROFILE_BABY_OGU,
  PROFILE_HAESEON,
  PROFILE_OGU,
  PROFILE_OVER_RABBIT,
  PROFILE_PANDAJINY,
  PROFILE_RABBIT,
} from "../profiles";

export function LoginModal(props: { onSelect: ProfileCallback }) {
  const profiles: Profile[] = [
    PROFILE_BABY_OGU,
    PROFILE_OGU,
    PROFILE_OVER_RABBIT,
    PROFILE_RABBIT,
    PROFILE_HAESEON,
    PROFILE_PANDAJINY,
  ];
  return (
    <div className="login-modal">
      <div className="content">
        <h1>사용자를 선택해 주세요!</h1>
        <div className="profile-container">
          {profiles.map((profile) => (
            <ProfileComponent
              onSelect={props.onSelect}
              key={Math.random()}
              profile={profile}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileComponent(props: {
  profile: Profile;
  onSelect: ProfileCallback;
}) {
  const { profile, onSelect } = props;
  return (
    <div className="profile-component" onClick={() => onSelect(profile)}>
      <img src={profile.imageSrc}></img>
      <h3>{profile.name}</h3>
      <p>{profile.stateMessage}</p>
    </div>
  );
}

export function ProfileComponentSmall(props: { profile: Profile | null }) {
  const { profile } = props;
  if (profile) {
    return (
      <div className="profile-component-small">
        <div className="content">
          <h3>
            {profile.name} <label>님 어서오세요!</label>
          </h3>
          <p>오늘의 채팅은 긍정적이에요 :)</p>
        </div>
        <img className="profile-image" src={profile.imageSrc} />
      </div>
    );
  } else {
    return (
      <div>
        <h3>로그인을 먼저 해주세요!</h3>
      </div>
    );
  }
}
