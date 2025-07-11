# LINE MCP Server

**English** | **[日本語](README_JP.md)**

[![npm version](https://badge.fury.io/js/line-mcp.svg)](https://www.npmjs.com/package/line-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Model Context Protocol (MCP) server for LINE messaging integration with AI assistants.

## Overview

LINE MCP Server is a Model Context Protocol server that integrates LINE messaging services with AI assistants like Claude Desktop. It enables AI assistants to authenticate, manage contacts, and send messages through LINE accounts.

## Key Features

- **LINE Login**: LINE authentication using environment variables
- **Contact Management**: Contact retrieval with search and token optimization features
- **Message Sending**: Send messages to LINE users (via MID)
- **Smart Search**: Response optimization with token limits
- **Login State Management**: Authentication state and error handling

## Target Users

### For General Users
Perfect for those who want to use LINE messaging features with Claude Desktop. AI assistants can help with:

- Searching and managing LINE contacts
- Sending messages to specific people
- Retrieving and organizing contact information

### For AI Assistant Users
This server enables AI assistants to:

- Login to LINE accounts
- Search and filter contact lists
- Send messages to specified contacts
- Check and manage login status

## Technical Specifications

### Available Tools

#### 1. `login`
**Description**: Login to LINE using environment variables

**Parameters**: None

#### 2. `status_login`
**Description**: Check current login status

**Parameters**: None

#### 3. `get_contacts`
**Description**: Get contacts with optional search filter and token limits

**Parameters**:
- `search` (optional, string): Search filter by contact name
- `maxTokens` (optional, number): Token limit for response

#### 4. `send_message`
**Description**: Send message to specified user

**Parameters**:
- `to` (required, string): Recipient's MID
- `message` (required, string): Message to send

## Setup

### Environment Variables

Set the following environment variables:

```bash
LINE_EMAIL=your_line_email@example.com
LINE_PASSWORD=your_line_password
```

### Claude Desktop Configuration

Add the following configuration to your `claude_desktop_config.json` file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`


```json
{
  "mcpServers": {
    "line-mcp": {
      "command": "npx",
      "args": ["line-mcp"],
      "env": {
        "LINE_EMAIL": "your_line_email@example.com",
        "LINE_PASSWORD": "your_line_password"
      }
    }
  }
}
```


## Dependencies

Main dependencies:
- `@evex/linejs`: LINE client library
- `@modelcontextprotocol/sdk`: MCP server development kit
- `tiktoken`: Token counting
- `zod`: Schema validation
- `dotenv`: Environment variable management

## Security Considerations

### Access Control
- This server provides full access to your LINE account
- Use only in trusted environments
- Regularly check your LINE account login history

## Troubleshooting

### Common Issues

#### 1. Cannot Login
**Symptoms**: Error occurs with `login` tool
**Solutions**:
- Check if LINE_EMAIL and LINE_PASSWORD environment variables are set correctly
- Verify LINE account is valid and using correct credentials
- Consider using app password if 2FA is enabled

#### 2. Cannot Get Contacts
**Symptoms**: `get_contacts` tool returns empty results
**Solutions**:
- First check login status with `status_login`
- If not logged in, run `login` tool
- Check if contacts are synced in LINE app

#### 3. Cannot Send Messages
**Symptoms**: Error occurs with `send_message` tool
**Solutions**:
- Verify recipient's MID is correct (can be obtained via `get_contacts`)
- Check login status
- Verify LINE account is not under message sending restrictions

## Limitations

- Currently supports only text message sending (images, files etc. not supported)
- Group chat functionality not implemented
- Use in accordance with LINE's terms of service and API limitations

## License

MIT License

## Contributing

Pull requests and issue reports are welcome.

## Support

If you encounter issues, please check:
1. Environment variable configuration
2. LINE account status
3. Network connection
4. Claude Desktop configuration

For additional support, please create an issue.
