export type habitType = {
  id: number;
  name: string;
  purpose: string;
  created_at: number;
  done_times: number;
};

export type eventType = {
  id: number;
  habit_id: number;
  done_at: number;
};
