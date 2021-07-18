import { createSchema, list } from "@keystone-next/keystone/schema";
import { text, relationship, password, timestamp, select } from "@keystone-next/fields";
import { document } from "@keystone-next/fields-document";

import User from "./schemas/User";
import Bot from "./schemas/Bot";

export const lists = createSchema({
  User,
  Bot,
});
