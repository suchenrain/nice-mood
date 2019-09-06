export interface IPhoto {
  _id: string;
  author: string;
  fileID: string;
  pid: string;
  profile: string;
  url: string;
  localPath: string;
  tempFileURL: string;
  color: string;
  alt: string;
  id: string;
  fond?: boolean;
  removed?: boolean;
  isNew?: boolean;
}
