import { list } from "@keystone-next/keystone/schema";
import { text, relationship, password, timestamp, select } from "@keystone-next/fields";

const Bot = list({
  ui: {
    listView: {
      initialColumns: ["name"],
    },
  },
  fields: {
    name: text({ isRequired: true, isUnique: true }),
    status: select({
      dataType: "integer",
      options: [
        { label: "Enable", value: 1 },
        { label: "Disable", value: 0 },
      ],
      defaultValue: 1,
      isRequired: true,
      isUnique: true,
      ui: { displayMode: "select" },
    }),
  },
});

export default Bot;
