# @hmphu/n8n-nodes-google-photos

This is an n8n community node. It lets you use Google Photos in your n8n workflows.

This node provides programmatic access to Google Photos through its API integration.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

Alternatively:

- Make sure to allow community nodes with `N8N_COMMUNITY_PACKAGES_ENABLED=true`
- Once logged in to your N8N web UI, go to `/settings/community-nodes` and type `@hmphu/n8n-nodes-google-photos`

## Operations

The Google Photos node supports the following operations:

### Albums

- **Create**: Create a new album with title
- **Get**: Retrieve a specific album by ID
- **List**: List all albums in the user's library
- **Add Enrichment**: Add text, location, or map enrichment to an album
- **Share**: Share an album and get shareable link
- **Unshare**: Remove sharing from an album
- **Batch Add Media Items**: Add multiple media items to an album
- **Batch Remove Media Items**: Remove multiple media items from an album

### Media Items

- **Get**: Retrieve a specific media item by ID
- **List**: List media items from the user's library
- **Search**: Search for media items using filters
- **Batch Get**: Retrieve multiple media items by their IDs
- **Batch Create**: Upload and create multiple media items
- **Update**: Update media item description

### Shared Albums

- **Get**: Retrieve a shared album by share token
- **Join**: Join a shared album using share token
- **Leave**: Leave a shared album
- **List**: List all shared albums

### Search Filters

- **Date Filter**: Filter by specific dates or date ranges
- **Content Category**: Filter by categories (landscapes, receipts, cityscapes, landmarks, selfies, people, pets, weddings, birthdays, documents, travel, animals, food, sport, night, performances, whiteboards, screenshots, utility)
- **Media Type**: Filter by all media, photos only, or videos only
- **Feature Filter**: Filter by favorites or archived items
- **Include Archived Media**: Option to include archived items in results
- **Exclude Non-App Created Data**: Exclude media not created by the app

### Upload Operations

- **Upload Media**: Upload bytes to get upload token
- **Create Media Item**: Create media item from upload token
- **Simple Upload**: Upload and create media item in one operation

### Pagination

- **Page Size**: Set number of items per page (1-100)
- **Page Token**: Token for retrieving next page of results
- **Return All**: Automatically paginate through all results

## Credentials

To use this node, you need to authenticate with Google Photos Library API using OAuth 2.0.

### Prerequisites

1. A Google Cloud Platform account
2. A Google Cloud project with Photos Library API enabled

### Setting up credentials

1. **Create a Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select an existing one
   - Note your Project ID

2. **Enable the Photos Library API**:
   - In the Cloud Console, go to **APIs & Services** > **Library**
   - Search for "Photos Library API"
   - Click on it and click **Enable**

3. **Configure OAuth Consent Screen**:
   - Go to **APIs & Services** > **OAuth consent screen**
   - Choose **External** user type (or Internal if using Google Workspace)
   - Fill in the required fields (App name, User support email, Developer contact)
   - Add test users if your app is in testing mode
   - Save and continue

4. **Create OAuth 2.0 Credentials**:
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth client ID**
   - Choose **Web application** as application type
   - Add authorized redirect URIs (your n8n OAuth callback URL)
   - Click **Create**
   - Copy the **Client ID** and **Client Secret**

5. **Configure in n8n**:
   - In n8n, create new Google Photos credentials
   - Enter your Client ID and Client Secret
   - Complete the OAuth flow to authorize access
   - The node will automatically handle token refresh

### Required Scopes

- `https://www.googleapis.com/auth/photoslibrary` - Full access to Google Photos library
- `https://www.googleapis.com/auth/photoslibrary.readonly` - Read-only access (for list and search operations)
- `https://www.googleapis.com/auth/photoslibrary.appendonly` - Add media items only (cannot read existing items)
- `https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata` - Read only media created by the app
- `https://www.googleapis.com/auth/photoslibrary.edit.appcreateddata` - Edit only media created by the app
- `https://www.googleapis.com/auth/photoslibrary.sharing` - Manage album sharing

## Compatibility

- **Minimum n8n version**: Compatible with n8n v0.198.0 and above
- **Node.js version**: Requires Node.js 18.10 or higher
- **n8n API version**: Uses n8n nodes API version 1

This node has been tested with the latest versions of n8n and should work with all current installations.

## Usage

### Listing Media Items

1. Add the Google Photos node to your workflow
2. Configure your OAuth2 credentials
3. Select **Media Item** as the resource
4. Choose **List** operation
5. Set whether to return all results or limit the number
6. Execute the workflow

### Searching Media Items

1. Add the Google Photos node to your workflow
2. Select **Media Item** as the resource
3. Choose **Search** operation
4. Add filters to narrow down results:
   - Filter by album ID
   - Filter by media type (photos, videos, or all)
   - Filter by content categories (landscapes, pets, food, etc.)
   - Include or exclude archived items
5. Execute the workflow

### Working with Albums

**List Albums:**
1. Select **Album** as the resource
2. Choose **List** operation
3. Optionally exclude non-app created albums

**Create Album:**
1. Select **Album** as the resource
2. Choose **Create** operation
3. Enter the album title
4. Execute to create a new album

**Get Album:**
1. Select **Album** as the resource
2. Choose **Get** operation
3. Enter the album ID
4. Execute to retrieve album details

### Pagination

The node supports automatic pagination when "Return All" is enabled, allowing you to retrieve large result sets efficiently. When disabled, you can set a limit (1-100 items).

### Example Use Cases

- **Photo Backup Workflows**: List and download all photos from your library
- **Album Organization**: Search for photos by category and add them to albums
- **Content Curation**: Find photos with specific content (pets, food, landscapes) for social media
- **Photo Analysis**: Retrieve media items and analyze metadata (date, location, camera info)
- **Automated Sharing**: Create albums and share them programmatically
- **Media Management**: Search for archived or favorited items for organization

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Google Photos API documentation](https://developers.google.com/photos/library/guides/get-started-library)
- [Google Cloud Console](https://console.cloud.google.com)

## License

[MIT](./LICENSE.md)
