import { ICredentialType, INodeProperties } from "n8n-workflow";

export class Ntfy implements ICredentialType {
  name = "ntfyApi";
  displayName = "Ntfy API";
  properties: INodeProperties[] = [
    {
      name: "url",
      displayName: "URL",
      type: "string",
      default: "https://ntfy.sh",
      placeholder: "https://ntfy.sh",
      description: "The ntfy API URL (default is https://ntfy.sh)",
      required: true,
    },
    {
      name: "apiKey",
      displayName: "API Key",
      type: "string",
      default: "",
      typeOptions: {
        password: true,
      },
      description: "API Key (optional)",
    },
  ];
}