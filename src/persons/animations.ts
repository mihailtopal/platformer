interface IAnimation {
  key: string;
  prefix: string;
  end: number;
  frameRate: number;
  repeat: number;
}

export const characterAnimation: IAnimation[] = [
  { key: "idle_1", prefix: "idle_1", end: 3, frameRate: 4, repeat: -1 },
  { key: "idle_2", prefix: "idle_2", end: 3, frameRate: 3, repeat: -1 },
  { key: "pushing", prefix: "pushing_1", end: 4, frameRate: 5, repeat: -1 },
  {
    key: "shield_bash_1",
    prefix: "shield_bash_1",
    end: 5,
    frameRate: 15,
    repeat: 0,
  },
  {
    key: "shield_idle_1",
    prefix: "shield_idle_1",
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    key: "shield_up_1",
    prefix: "shield_up_1",
    end: 3,
    frameRate: 15,
    repeat: 0,
  },
  { key: "talking", prefix: "talking_1", end: 3, frameRate: 4, repeat: -1 },
  { key: "walking_1", prefix: "walking_1", end: 6, frameRate: 9, repeat: -1 },
  { key: "walking_2", prefix: "walking_2", end: 6, frameRate: 9, repeat: -1 },
  { key: "wallside", prefix: "wallside_1", end: 1, frameRate: 2, repeat: -1 },
  { key: "attack_1", prefix: "attack_1", end: 5, frameRate: 10, repeat: 0 },
  { key: "attack_2", prefix: "attack_2", end: 5, frameRate: 10, repeat: 0 },
  { key: "attack_3", prefix: "attack_3", end: 8, frameRate: 12, repeat: 0 },
  { key: "attack_4", prefix: "attack_4", end: 4, frameRate: 12, repeat: 0 },
  {
    key: "crouching_idle_1",
    prefix: "crouching_idle_1",
    end: 2,
    frameRate: 3,
    repeat: -1,
  },
  {
    key: "crouching_idle_2",
    prefix: "crouching_idle_2",
    end: 2,
    frameRate: 3,
    repeat: -1,
  },
  {
    key: "crouching_1",
    prefix: "crouching_1",
    end: 2,
    frameRate: 10,
    repeat: 0,
  },
  {
    key: "crouching_2",
    prefix: "crouching_2",
    end: 3,
    frameRate: 10,
    repeat: 0,
  },
  {
    key: "crouching_walk_1",
    prefix: "crouching_walk_1",
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    key: "crouching_walk_2",
    prefix: "crouching_walk_2",
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  { key: "dashing_1", prefix: "dashing_1", end: 3, frameRate: 12, repeat: 0 },
  { key: "drinking_1", prefix: "drinking_1", end: 6, frameRate: 6, repeat: 0 },
  { key: "dying_1", prefix: "dying_1", end: 4, frameRate: 7, repeat: 0 },
  { key: "dying_2", prefix: "dying_2", end: 5, frameRate: 7, repeat: 0 },
  { key: "fall_1", prefix: "fall_1", end: 2, frameRate: 4, repeat: -1 },
  { key: "fall_2", prefix: "fall_2", end: 2, frameRate: 4, repeat: -1 },
  { key: "grab_idle", prefix: "grab_idle_1", end: 2, frameRate: 3, repeat: -1 },
  { key: "hurt_1", prefix: "hurt_1", end: 3, frameRate: 12, repeat: 0 },
  { key: "hurt_2", prefix: "hurt_2", end: 3, frameRate: 12, repeat: 0 },
  { key: "jump_1", prefix: "jump_1", end: 5, frameRate: 6, repeat: 0 },
  { key: "jump_2", prefix: "jump_2", end: 5, frameRate: 6, repeat: 0 },
  {
    key: "knight_win",
    prefix: "knight_win_1",
    end: 4,
    frameRate: 5,
    repeat: 0,
  },
  { key: "ladders", prefix: "ladders_1", end: 3, frameRate: 4, repeat: -1 },
  { key: "landing_1", prefix: "landing_1", end: 3, frameRate: 12, repeat: 0 },
  { key: "landing_2", prefix: "landing_2", end: 3, frameRate: 12, repeat: 0 },
  {
    key: "ledge_grab",
    prefix: "ledge_grab_1",
    end: 5,
    frameRate: 5,
    repeat: -1,
  },
  { key: "power_up", prefix: "power_up_1", end: 9, frameRate: 8, repeat: 0 },
];
