import {
  INodeType,
  INodeTypeDescription,
  INodeExecutionData,
  IExecuteFunctions,
  IHttpRequestMethods,
  ICredentialDataDecryptedObject,
  NodeApiError,
  NodeOperationError,
  NodeConnectionType,
} from "n8n-workflow";

import { properties } from "./Ntfy.properties";

interface Action {
  items: {
    action: string;
    label: string;
    url: string;
  }[];
}

export class Ntfy implements INodeType {
  description: INodeTypeDescription = {
    displayName: "ntfy",
    name: "ntfy",
    icon: "file:ntfy-logo.png",
    group: ["output"],
    version: 1,
    subtitle: '={{"Send: " + $parameter["topic"]}}',
    description: "Consume ntfy API to send notifications",
    defaults: {
      name: "ntfy",
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: "ntfyApi",
        required: true,
      },
    ],
    properties,
  };

  static async makeRequest(
    executeFunctions: IExecuteFunctions,
    method: IHttpRequestMethods,
    topic: string,
    message: string,
    title: string,
    tags: string,
    click: string,
    actions: Action
  ) {
    const credentials: ICredentialDataDecryptedObject =
      await executeFunctions.getCredentials("ntfyApi");

    if (!credentials.url) {
      throw new NodeOperationError(
        executeFunctions.getNode(),
        "No URL provided for ntfy API"
      );
    }

    console.log("inputs", JSON.stringify({
      url: credentials.url,
      method,
      topic,
      message,
      title,
      tags,
      click,
      actions
    }, null, 2));

    const headers = {
      ...(credentials.apiKey && {
        authorization: `Bearer ${credentials.apiKey}`,
      }),
      ...(tags && { tags }),
    };

    const options = {
      method,
      body: {
        topic,
        title,
        message,
        click,
        actions: actions?.items,
      },
      url: `${credentials.url}`,
      json: true,
      headers,
    };

    console.log("options", JSON.stringify(options));

    try {
      const result = await executeFunctions.helpers.request(options);
      return result;
    } catch (error) {
      throw new NodeApiError(executeFunctions.getNode(), {
        message: error.message,
        description: "Failed to send notification",
        httpCode: error.status || error.statusCode,
      });
    }
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const topic = this.getNodeParameter("topic", 0) as string;

    return await Promise.all(
      items.map(async () => {
        const message = this.getNodeParameter("message", 0) as string;
        const title = this.getNodeParameter("title", 0, "") as string;
        const tags = this.getNodeParameter("tags", 0, "") as string;
        const link = this.getNodeParameter("link", 0, "") as string;
        const actions = this.getNodeParameter("actions", 0, "") as Action;

        const responseData = await Ntfy.makeRequest(
          this,
          "POST",
          topic,
          message,
          title,
          tags,
          link,
          actions
        );
        return this.helpers.returnJsonArray(responseData);
      })
    );
  }
}
