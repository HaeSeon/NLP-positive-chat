export const PROFILE_BABY_OGU: Profile = {
  name: "아기오구",
  imageSrc: require("./images/profiles/BABY_OGU.png"),
  stateMessage: "세상은 너무 화가나",
};

export const PROFILE_OGU: Profile = {
  name: "오구",
  imageSrc: require("./images/profiles/OGU.jpg"),
  stateMessage: "오늘도 오구는 구른다",
};
export const PROFILE_OVER_RABBIT: Profile = {
  name: "오버토끼",
  imageSrc: require("./images/profiles/BABY_RABBIT.png"),
  stateMessage: "오늘은 모하고 놀까 ~~",
};
export const PROFILE_RABBIT: Profile = {
  name: "토끼",
  imageSrc: require("./images/profiles/RABBIT.jpg"),
  stateMessage: "오버 여기는 토끼",
};
export const PROFILE_HAESEON: Profile = {
  name: "해서니",
  imageSrc: require("./images/profiles/default.png"),
  stateMessage: "나는 귀요미",
};
export const PROFILE_PANDAJINY: Profile = {
  name: "판다몬",
  imageSrc: require("./images/profiles/default.png"),
  stateMessage: "너는 귀요미",
};

export const profiles: Map<ProfileNameList, Profile> = new Map();

profiles.set("아기오구", PROFILE_BABY_OGU);
profiles.set("오구", PROFILE_OGU);
profiles.set("오버토끼", PROFILE_OVER_RABBIT);
profiles.set("토끼", PROFILE_RABBIT);
profiles.set("해서니", PROFILE_HAESEON);
profiles.set("판다몬", PROFILE_PANDAJINY);
