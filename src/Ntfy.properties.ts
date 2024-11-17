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
    name: "string",
    type: "string",
    default: "",
    required: false,
    description: "URL to open when notification is clicked.",
    validateType: "url",
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
