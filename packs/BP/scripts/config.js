export const SCHEMA_VERSION = 1;
export const KEY_PREFIX = "hcp:";

export const PlayerStatus = Object.freeze({
  ALIVE: "alive",
  ELIMINATED: "eliminated",
});

export const Tier = Object.freeze({
  EXPERT: "expert",
  NOVICE: "novice",
});

export const Gender = Object.freeze({
  MALE: "m",
  FEMALE: "f",
  BOTH: "fm",
});

export const LIVES_BY_TIER = Object.freeze({
  [Tier.EXPERT]: 3,
  [Tier.NOVICE]: 5,
});

export const ROLES = Object.freeze({
  invesile: Object.freeze({ displayName: "Invesile", tier: Tier.EXPERT, gender: Gender.BOTH }),
  invesil:  Object.freeze({ displayName: "Invesil",  tier: Tier.EXPERT, gender: Gender.MALE }),
  invesila: Object.freeze({ displayName: "Invesila", tier: Tier.EXPERT, gender: Gender.FEMALE }),
  puberto:  Object.freeze({ displayName: "Puberto",  tier: Tier.NOVICE, gender: Gender.MALE }),
  puberta:  Object.freeze({ displayName: "Puberta",  tier: Tier.NOVICE, gender: Gender.FEMALE }),
});

export const DEFAULT_ROLE_ID = "invesile";