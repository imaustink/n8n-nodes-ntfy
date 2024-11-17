// Set up mocks before any imports otherwise Jest's mock hosting causes a reference error
const mockNodeOperationError = jest.fn();
const mockNodeApiError = jest.fn();

import type { IExecuteFunctions } from "n8n-workflow";
import { Ntfy } from "./Ntfy.node";

jest.mock("n8n-workflow", () => ({
  NodeApiError: mockNodeApiError,
  NodeOperationError: mockNodeOperationError,
}));

describe("ntfy", () => {
  let node: Ntfy;
  let mockExecuteFunctions: jest.Mocked<IExecuteFunctions>;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Create a new instance of Ntfy
    node = new Ntfy();

    // Create mock execute functions with proper typing
    mockExecuteFunctions = {
      getInputData: jest.fn(),
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn(),
      getNode: jest.fn(),
      helpers: {
        request: jest.fn() as jest.MockedFunction<
          (...args: any[]) => Promise<any>
        >,
        returnJsonArray: jest.fn() as jest.MockedFunction<
          (...args: any[]) => any[]
        >,
      },
    } as unknown as jest.Mocked<IExecuteFunctions>;
  });

  describe("description", () => {
    it("should have correct properties", () => {
      expect(node.description.displayName).toBe("Ntfy");
      expect(node.description.name).toBe("ntfy");
      expect(node.description.group).toEqual(["output"]);
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toEqual(["main"]);
      expect(node.description.outputs).toEqual(["main"]);
    });
  });

  describe("makeRequest", () => {
    it("should successfully make a request with all parameters", async () => {
      const mockResponse = { success: true };
      const mockCredentials = {
        url: "https://ntfy.example.com",
        apiKey: "test-key",
      };

      mockExecuteFunctions.getCredentials.mockResolvedValue(mockCredentials);
      (mockExecuteFunctions.helpers.request as jest.Mock).mockResolvedValue(
        JSON.stringify(mockResponse)
      );

      const result = await Ntfy.makeRequest(
        mockExecuteFunctions,
        "POST",
        "/test-topic",
        "Test message",
        "Test title",
        "warning,alert"
      );

      expect(mockExecuteFunctions.helpers.request).toHaveBeenCalledWith({
        method: "POST",
        body: "Test message",
        url: "https://ntfy.example.com/test-topic",
        json: false,
        headers: {
          authorization: "Bearer test-key",
          title: "Test title",
          tags: "warning,alert",
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it("should make request without optional parameters", async () => {
      const mockResponse = { success: true };
      const mockCredentials = { url: "https://ntfy.example.com" };

      mockExecuteFunctions.getCredentials.mockResolvedValue(mockCredentials);
      (mockExecuteFunctions.helpers.request as jest.Mock).mockResolvedValue(
        JSON.stringify(mockResponse)
      );

      const result = await Ntfy.makeRequest(
        mockExecuteFunctions,
        "POST",
        "/test-topic",
        "Test message",
        "",
        ""
      );

      expect(mockExecuteFunctions.helpers.request).toHaveBeenCalledWith({
        method: "POST",
        body: "Test message",
        url: "https://ntfy.example.com/test-topic",
        json: false,
        headers: {},
      });
      expect(result).toEqual(mockResponse);
    });

    it("should throw NodeOperationError when no URL is provided", async () => {
      mockExecuteFunctions.getCredentials.mockResolvedValue({});
      mockNodeOperationError.mockImplementation(
        (node: any, message: string) => {
          const error = new Error(message);
          error.name = "NodeOperationError";
          return error;
        }
      );

      await expect(
        Ntfy.makeRequest(
          mockExecuteFunctions,
          "POST",
          "/test-topic",
          "Test message",
          "",
          ""
        )
      ).rejects.toThrow("No URL provided for ntfy API");
    });

    it("should throw NodeApiError when request fails", async () => {
      const mockCredentials = { url: "https://ntfy.example.com" };
      const mockError = new Error("Request failed") as Error & {
        statusCode?: number;
      };
      mockError.statusCode = 500;

      mockExecuteFunctions.getCredentials.mockResolvedValue(mockCredentials);
      (mockExecuteFunctions.helpers.request as jest.Mock).mockRejectedValue(
        mockError
      );
      mockNodeApiError.mockImplementation((node: any, error: any) => {
        const apiError = new Error(error.message);
        apiError.name = "NodeApiError";
        return apiError;
      });

      await expect(
        Ntfy.makeRequest(
          mockExecuteFunctions,
          "POST",
          "/test-topic",
          "Test message",
          "",
          ""
        )
      ).rejects.toThrow("Request failed");
    });
  });

  describe("execute", () => {
    it("should successfully process input items", async () => {
      const mockInputData = [{ json: { data: "test" } }];
      const mockResponse = { success: true };

      mockExecuteFunctions.getInputData.mockReturnValue(mockInputData);
      mockExecuteFunctions.getNodeParameter.mockImplementation((param) => {
        switch (param) {
          case "topic":
            return "test-topic";
          case "message":
            return "Test message";
          case "title":
            return "Test title";
          case "tags":
            return "warning,alert";
          default:
            return "";
        }
      });

      const spyMakeRequest = jest
        .spyOn(Ntfy, "makeRequest")
        .mockResolvedValue(mockResponse);
      (
        mockExecuteFunctions.helpers.returnJsonArray as jest.Mock
      ).mockReturnValue([{ json: mockResponse }]);

      const result = await node.execute.call(mockExecuteFunctions);

      expect(spyMakeRequest).toHaveBeenCalledWith(
        mockExecuteFunctions,
        "POST",
        "/test-topic",
        "Test message",
        "Test title",
        "warning,alert"
      );
      expect(result).toEqual([[{ json: mockResponse }]]);
    });
  });
});
