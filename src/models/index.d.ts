import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum Modules {
  IS2101 = "IS2101",
  BT2102 = "BT2102",
  ES2660 = "ES2660",
  BT2103 = "BT2103",
  IS3103 = "IS3103",
  BT2201 = "BT2201",
  BT3102 = "BT3102",
  CS2102 = "CS2102",
  CS2101 = "CS2101",
  CS2103 = "CS2103",
  BT4103 = "BT4103"
}

export enum Genders {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}



type MatchMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Match {
  readonly id: string;
  readonly User1ID: string;
  readonly User2ID: string;
  readonly User1?: User | null;
  readonly User2?: User | null;
  readonly isMatch: boolean;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly matchUser1Id?: string | null;
  readonly matchUser2Id?: string | null;
  constructor(init: ModelInit<Match, MatchMetaData>);
  static copyOf(source: Match, mutator: (draft: MutableModel<Match, MatchMetaData>) => MutableModel<Match, MatchMetaData> | void): Match;
}

export declare class User {
  readonly id: string;
  readonly name: string;
  readonly image?: string | null;
  readonly bio: string;
  readonly lookingFor: Modules | keyof typeof Modules;
  readonly sub: string;
  readonly module?: Modules | keyof typeof Modules | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}