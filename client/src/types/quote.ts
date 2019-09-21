export interface IQuote {
  id: number;
  hitokoto: string;
  from: string;
  fondTime: string;
  type?: string;
  creator?: string;
  created_at?: number;
  fond?: boolean;
  removed?: boolean;
  isNew?: boolean;
}
