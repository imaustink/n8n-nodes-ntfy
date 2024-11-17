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
    displayName: "Tags",
    name: "tags",
    type: "string",
    default: "",
    required: false,
    description: "Comma-separated list of tags for the notification.",
  },
];
