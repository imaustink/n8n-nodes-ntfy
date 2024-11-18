import { INodeProperties } from "n8n-workflow";

export const properties: INodeProperties[] = [
  {
    displayName: "Topic",
    name: "topic",
    type: "string",
    default: "",
    required: true,
    description: "The topic to send the notification to.",
  },
  {
    displayName: "Message",
    name: "message",
    type: "string",
    default: "",
    required: true,
    description: "The message to send.",
  },
  {
    displayName: "Title",
    name: "title",
    type: "string",
    default: "",
    required: false,
    description: "The title of the notification.",
  },
  {
    displayName: "Link",
    name: "link",
    type: "string",
    default: "",
    required: false,
    description: "URL to open when notification is clicked.",
  },
  {
    displayName: "Actions",
    name: "actions",
    type: "fixedCollection",
    typeOptions: {
      multipleValues: true,
      multipleValueButtonText: "Add Action",
    },
    default: {},
    description: "Actions for the notifications.",
    placeholder: "Add Action",
    options: [
      {
        name: "actions",
        displayName: "Actions",
        values: [
          {
            displayName: "Type",
            name: "action",
            type: "collection",
            required: true,
            default: "",
            options: [
              {
                displayName: "View",
                name: "view",
                value: "view",
                description:
                  "Opens a website or app when the action button is tapped",
              },
              {
                displayName: "Broadcast",
                name: "broadcast",
                value: "broadcast",
                description:
                  "Sends an Android broadcast intent when the action button is tapped (only supported on Android)",
              },
              {
                displayName: "HTTP",
                name: "http",
                value: "http",
                description:
                  "Sends HTTP POST/GET/PUT request when the action button is tapped",
              },
            ],
          },
          {
            displayName: "Label",
            name: "label",
            type: "string",
            required: true,
            default: "",
          },
          {
            displayName: "Link",
            name: "url",
            type: "string",
            required: true,
            default: "",
          },
        ],
      },
    ],
  },
  {
    displayName: "Tags",
    name: "tags",
    type: "string",
    default: "",
    required: false,
    description: "Comma-separated list of tags for the notification.",
  },
];
