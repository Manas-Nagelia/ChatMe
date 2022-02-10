export interface Avatar {
  url: string;
  size: number;
  onUpload: (url: string) => void;
}
