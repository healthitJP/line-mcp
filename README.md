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
**Description**: Login to LINE using command line arguments

**Parameters**: None

#### 2. `get_contacts`
**Description**: Get contacts with optional search filter and token limits

**Parameters**:
- `search` (optional, string): Search filter by contact name
- `maxTokens` (optional, number): Token limit for response

#### 3. `send_message`
**Description**: Send message to specified user

**Parameters**:
- `to` (required, string): Recipient's MID
- `message` (required, string): Message to send

## Setup

### Command Line Arguments

The LINE MCP server requires three command line arguments:

1. **EMAIL**: Your LINE account email address
2. **PASSWORD**: Your LINE account password  
3. **STORAGE_PATH**: Directory path where authentication tokens will be stored

**Syntax**: `npx line-mcp <email> <password> <storage_path>`

**Example**: `npx line-mcp user@example.com mypassword ./line_storage`

**Important**: The storage directory must exist before starting the server. If the specified path does not exist or is not accessible, the server will fail to start.

### Claude Desktop Configuration

Add the following configuration to your `claude_desktop_config.json` file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

#### Basic Configuration

```json
{
  "mcpServers": {
    "line-mcp": {
      "command": "npx",
      "args": ["line-mcp", "your_line_email@example.com", "your_line_password", "/path/to/storage/directory"]
    }
  }
}
```

#### Advanced Configuration with Working Directory

You can also specify a working directory (`cwd`) for the MCP server. This is useful when using relative paths or when you want to set a specific base directory for the server's operations:

```json
{
  "mcpServers": {
    "line-mcp": {
      "command": "npx",
      "args": [
        "line-mcp@latest",
        "your_line_email@example.com", 
        "your_line_password",
        "./line_auth_storage"
      ],
      "cwd": "/path/to/your/project/directory"
    }
  }
}
```

**Configuration Options**:
- `command`: The command to execute (usually `npx`)
- `args`: Array of command line arguments including package name, email, password, and storage path
- `cwd` (optional): Working directory for the MCP server execution. When specified, relative paths in the arguments will be resolved relative to this directory.

**Important**: 
- Replace `your_line_email@example.com` and `your_line_password` with your actual LINE account credentials.
- Replace the storage path with the directory or file where authentication tokens will be stored.
- **The storage directory must exist**: If the specified storage path does not exist, the server will fail to start with an error.
- When using `cwd`, you can use relative paths like `./line_auth_storage` for the storage path, which will be resolved relative to the specified working directory.

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
- Check if command line arguments (email and password) are correctly set in Claude Desktop configuration
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

#### 4. Server Fails to Start
**Symptoms**: Server fails to initialize or start
**Solutions**:
- Verify the storage directory path exists and is accessible
- Check directory permissions (read/write access required)
- Ensure all three command line arguments are properly specified in Claude Desktop configuration
- Create the storage directory manually if it doesn't exist

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
1. Command line arguments configuration in Claude Desktop
2. LINE account status
3. Network connection
4. Claude Desktop configuration

For additional support, please create an issue.
