# Changelog

## [1.0.1] - 2025-11-06

### 🎉 Major Feature Release: Complete Google Photos API Coverage

This release provides comprehensive coverage of the Google Photos Library API v1, transforming the node from basic functionality to a complete automation solution for Google Photos workflows.

---

### ✨ New Features

#### 🔗 Shared Album Management
- **New Resource:** Added "Shared Album" resource with full operation support
- **Get Shared Album:** Retrieve shared album details using share token
- **List Shared Albums:** Browse all shared albums with pagination support
- **Join Shared Album:** Automatically join shared albums via share token
- **Leave Shared Album:** Remove shared albums from your library

#### 📤 Album Sharing & Collaboration
- **Share Albums:** Enable sharing for albums with customizable options
  - Configure collaborative mode (allow others to add photos)
  - Configure commentable mode (allow others to comment)
- **Unshare Albums:** Disable sharing and revoke access
- **Add Media Items to Album:** Batch add up to 50 media items to albums
- **Remove Media Items from Album:** Batch remove up to 50 media items from albums

#### 📸 Enhanced Media Item Operations
- **Batch Get:** Retrieve up to 50 media items in a single request
- **Update Media Items:** Modify media item descriptions
- **Create with Auto-Upload:** Upload and create media items in one seamless operation
  - Automatic binary file upload to Google Photos
  - Automatic upload token management
  - Support for optional description and album placement
- **Batch Create with Auto-Upload:** Upload and create up to 50 media items simultaneously
  - Parallel file processing
  - Individual descriptions per item
  - Bulk album placement

#### 🔍 Advanced Search Filters

**Date Filters:**
- Search by specific dates (year, month, day)
- Search by date ranges with start and end dates
- Flexible date precision (year-only, year-month, or full date)

**Feature Filters:**
- Filter by favorites
- Include or exclude archived media
- Combine multiple feature criteria

**Enhanced Content Filters:**
- 21 content categories (Animals, Birthdays, Cityscapes, Documents, Fashion, Food, Gardens, Landmarks, Landscapes, Night, People, Performances, Pets, Receipts, Screenshots, Selfies, Sport, Travel, Utility, Weddings, Whiteboards)
- Include or exclude specific categories
- Media type filtering (Photos, Videos, or All)

---

### 🚀 Improvements

#### Performance & Reliability
- **Consistent Pagination:** Unified pagination handling across all list operations
  - Albums: Up to 50 items per page
  - Media Items: Up to 100 items per page
  - Shared Albums: Up to 50 items per page
- **Smart Batch Processing:** Automatic validation for batch size limits (max 50 items)
- **Efficient Token Management:** Automatic upload token handling eliminates manual workflow steps

#### Developer Experience
- **Improved Error Messages:** Clear, actionable error messages for common issues
  - Authentication and permission errors (401/403)
  - Invalid parameter errors (400)
  - Resource not found errors (404)
  - Batch size limit violations
- **Better Parameter Organization:** Logical grouping of parameters
  - Required fields appear first
  - Optional fields grouped by function
  - Filters organized in collections
- **Smart Parameter Visibility:** Context-aware parameter display based on selected resource and operation

#### API Coverage
- **Complete REST API Parity:** Full implementation of Google Photos Library API v1
- **All Resources Supported:** Albums, Media Items, and Shared Albums
- **18 Total Operations:** Comprehensive operation coverage across all resources

---

### 📋 Complete Operation List

#### Album Operations (7)
1. Create - Create new albums
2. Get - Retrieve album details
3. List - Browse all albums with pagination
4. Share - Enable album sharing with options
5. Unshare - Disable album sharing
6. Add Media Items - Batch add media to albums (max 50)
7. Remove Media Items - Batch remove media from albums (max 50)

#### Media Item Operations (7)
1. Get - Retrieve single media item
2. List - Browse media items with pagination
3. Search - Advanced search with multiple filter types
4. Batch Get - Retrieve multiple media items (max 50)
5. Create - Upload and create single media item
6. Batch Create - Upload and create multiple media items (max 50)
7. Update - Modify media item descriptions

#### Shared Album Operations (4)
1. Get - Retrieve shared album by token
2. List - Browse shared albums with pagination
3. Join - Join shared albums
4. Leave - Leave shared albums

---

### 🔧 Technical Improvements

- **TypeScript 5.5+:** Full type safety with strict mode enabled
- **Declarative REST API:** Leverages n8n's declarative routing for cleaner code
- **Pre-Send Hooks:** Sophisticated request preprocessing for complex operations
- **Validation Logic:** Client-side validation prevents invalid API requests
- **Error Handling:** Comprehensive error mapping and user-friendly messages

---

### 📦 What's Changed

**Before (v1.0.0):**
- Basic album operations (create, get, list)
- Basic media item operations (get, list, search)
- Limited search filters
- Manual upload token management required

**After (v1.0.1):**
- ✅ Complete album management including sharing and batch operations
- ✅ Full media item lifecycle (create, read, update, batch operations)
- ✅ Shared album support for collaboration workflows
- ✅ Advanced search with date, feature, and content filters
- ✅ Automatic upload handling - no manual token management
- ✅ Batch operations for efficient processing
- ✅ Comprehensive error handling and validation

---

### 🎯 Use Cases Enabled

This release enables powerful automation workflows:

- **Photo Backup Automation:** Automatically upload photos from various sources to Google Photos
- **Album Organization:** Batch organize photos into albums based on dates, content, or metadata
- **Collaboration Workflows:** Automatically share albums with team members or clients
- **Content Curation:** Search and filter photos by content type, date, or features for automated curation
- **Shared Album Management:** Join, monitor, and leave shared albums programmatically
- **Bulk Operations:** Process hundreds of photos efficiently with batch operations
- **Photo Metadata Management:** Update descriptions and organize media at scale

---

### 📚 Documentation

All operations include:
- Clear descriptions and action labels
- Required vs optional parameter indicators
- Inline help text
- Validation messages
- Example use cases

---

### 🙏 Acknowledgments

This release represents a complete implementation of the Google Photos Library API v1, providing n8n users with professional-grade photo automation capabilities.

---

### 🔗 Links

- **Repository:** https://github.com/hmphu/n8n-nodes-google-photos
- **npm Package:** [@hmphu/n8n-nodes-google-photos](https://www.npmjs.com/package/@hmphu/n8n-nodes-google-photos)
- **Google Photos API Documentation:** https://developers.google.com/photos/library/reference/rest

---

### 📝 Installation

```bash
# Install via n8n Community Nodes
# Settings → Community Nodes → Install
# Package name: @hmphu/n8n-nodes-google-photos
```

Or via npm:

```bash
npm install @hmphu/n8n-nodes-google-photos
```

---

**Full Changelog:** https://github.com/hmphu/n8n-nodes-google-photos/compare/v1.0.0...v1.0.1
