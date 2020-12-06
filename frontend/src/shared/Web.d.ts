interface Profile {
  name: ProfileNameList;
  imageSrc: string;
  stateMessage: string;
}

interface ProfileCallback {
  (profile: Profile): void;
}
