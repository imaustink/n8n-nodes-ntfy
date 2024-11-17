import {
  ICredentialType,
  INodeProperties,
  ICredentialTestRequest,
  Icon,
} from "n8n-workflow";

export class Ntfy implements ICredentialType {
  name = "ntfyApi";
  displayName = "ntfy API";
  icon: Icon = "file:ntfy-logo.png";
  properties: INodeProperties[] = [
    {
      name: "url",
      displayName: "URL",
      type: "string",
      default: "https://ntfy.sh",
      placeholder: "https://ntfy.sh",
      description: "The ntfy API URL (default is https://ntfy.sh)",
      required: true,
      validateType: "url",
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

  test: ICredentialTestRequest = {
    request: {
      baseURL: "={{$credentials.url}}",
      url: "/test/auth",
      method: "GET",
      headers: {
        authorization: "=Bearer {{$credentials.apiKey}}",
      },
    },
  };
}
