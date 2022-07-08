// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const Modules = {
  "IS2101": "IS2101",
  "BT2102": "BT2102",
  "ES2660": "ES2660",
  "BT2103": "BT2103",
  "IS3103": "IS3103",
  "BT2201": "BT2201",
  "BT3102": "BT3102",
  "CS2102": "CS2102",
  "CS2101": "CS2101",
  "CS2103": "CS2103",
  "BT4103": "BT4103"
};

const Genders = {
  "MALE": "MALE",
  "FEMALE": "FEMALE",
  "OTHER": "OTHER"
};

const { Match, User } = initSchema(schema);

export {
  Match,
  User,
  Modules,
  Genders
};