#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { get_encoding } from "tiktoken";

import { loginWithAuthToken,Client } from "@evex/linejs";
import { BaseClient } from "@evex/linejs/base";
import { FileStorage } from "@evex/linejs/storage";


const args = process.argv.slice(2);
const EMAIL = args[0];
const PASSWORD = args[1];
const STORAGE_PATH = args[2];

if (!EMAIL || !PASSWORD) {
  console.error("Usage: npx line-mcp <email> <password>");
  console.error("Example: npx line-mcp user@example.com mypassword");
  process.exit(1);
}

interface Contact {
  mid: string;
  displayName: string;
  [key: string]: any;
}

interface FilteredContact {
  mid: string;
  displayName: string;
}

const server = new McpServer({
  name: "line-mcp",
  version: "0.2.3"
});

const storage = new FileStorage(
  STORAGE_PATH
);
let baseClient = new BaseClient({
  device: "IOSIPAD",
  storage: storage,
})
baseClient.on("update:authtoken", async(token) => {
  await storage.set("authtoken", token);
});
let client: Client | null = null;

try {
  const authtoken = await storage.get("authtoken");
  if (typeof authtoken === "string") {
    client = await loginWithAuthToken(authtoken,{
      device: "IOSIPAD",
      storage: storage,
    });
  }
} catch (error) {
  console.error('Error:', error);
}

const encoding = get_encoding("cl100k_base");

function calculateTokens(data: any): number {
  const jsonString = JSON.stringify(data);
  const tokens = encoding.encode(jsonString);
  return tokens.length;
}

server.registerTool("login",
  {
    title: "Login to LINE",
    description: "Login to LINE using email and password from command line arguments",
    inputSchema: {}
  },
  async () => {
    try {

      const loginResult = await new Promise<{success: boolean, pincode?: string, error?: string}>((resolve) => {  
        baseClient.on("pincall", (pincode) => {    
          resolve({ success: true, pincode });  
        });  
    
        baseClient.loginProcess.login({  
          email: EMAIL,  
          password: PASSWORD,  
        })  
          .then(async () => {  
            await baseClient.loginProcess.ready();  
            client = new Client(baseClient);  
            resolve({ success: true });  
          })  
          .catch((error) => {  
            console.error('Login error:', error);  
            resolve({ success: false, error: error.message });  
          });  
      });       

      if (!loginResult.success) {
        return {
          content: [{
            type: "text",
            text: `Login error: ${loginResult.error}`
          }],
          isError: true
        };
      }

      if (loginResult.pincode) {
        return {
          content: [{
            type: "text",
            text: `Login in progress. Please verify the following pincode:\n${loginResult.pincode}\n\nPlease check the pincode to complete the login process.`
          }]
        };
      }

      return {
        content: [{
          type: "text",
          text: "Login successful! You can now get contacts and send messages."
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
);

server.registerTool("get_contacts",
  {
    title: "Get Contacts",
    description: "Get contacts list with optional search query for displayName and token limit. Use this if you want to know a user's MID.",
    inputSchema: {
      query: z.string().optional().describe("Optional search query to filter contacts by displayName (partial match)"),
      max_token: z.number().optional().describe("Optional maximum token count limit for the response")
    }
  },
  async ({ query, max_token }) => {
    try {
      if (!client) {
        return {
          content: [{
            type: "text",
            text: "Error: Please login first using the login tool"
          }],
          isError: true
        };
      }

      const mids = await client.base.talk.getAllContactIds({
        syncReason: "INTERNAL",
      });

      const contacts: Contact[] = await client.base.talk.getContacts({ mids });

      let filteredContacts: FilteredContact[] = contacts.map((contact: Contact) => ({
        mid: contact.mid,
        displayName: contact.displayName
      }));

      if (query) {
        filteredContacts = filteredContacts.filter((contact: FilteredContact) =>
          contact.displayName.includes(query)
        );
      }

      let finalContacts = filteredContacts;
      let tokenLimited = false;
      
      if (max_token && max_token > 0) {
        finalContacts = [];
        
        for (const contact of filteredContacts) {
          const testContacts = [...finalContacts, contact];
          const testMessage = query
            ? `Found ${testContacts.length} contacts matching query "${query}" (token limit: ${max_token})`
            : `Retrieved ${testContacts.length} contacts (token limit: ${max_token})`;
          
          const testResult = {
            content: [{
              type: "text",
              text: `${testMessage}\n${JSON.stringify(testContacts, null, 2)}`
            }]
          };
          
          const tokenCount = calculateTokens(testResult);
          
          if (tokenCount <= max_token) {
            finalContacts = testContacts;
          } else {
            tokenLimited = true;
            break;
          }
        }
      }

      const resultMessage = query
        ? `Found ${filteredContacts.length} contacts matching query "${query}"`
        : `Retrieved ${filteredContacts.length} contacts`;
      
      const tokenInfo = max_token 
        ? ` (token limit: ${max_token}${tokenLimited ? `, limited to ${finalContacts.length} contacts` : ''})`
        : '';

      return {
        content: [{
          type: "text",
          text: `${resultMessage}${tokenInfo}\n${JSON.stringify(finalContacts, null, 2)}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Contact retrieval error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
);

server.registerTool("send_message",
  {
    title: "Send Message",
    description: "Send a message to a specific user by their MID",
    inputSchema: {
      mid: z.string().describe("The MID of the user to send message to"),
      message: z.string().describe("The message content to send")
    }
  },
  async ({ mid, message }) => {
    try {
      if (!client) {
        return {
          content: [{
            type: "text",
            text: "Error: Please login first using the login tool"
          }],
          isError: true
        };
      }

      await client.base.talk.sendMessage({
        to: mid,
        text: message
      });

      return {
        content: [{
          type: "text",
          text: `Message sent successfully!\nTo: ${mid}\nMessage: ${message}`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Message send error: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);