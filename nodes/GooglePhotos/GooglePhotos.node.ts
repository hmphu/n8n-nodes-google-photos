import type {
	DeclarativeRestApiSettings,
	IDataObject,
	IExecutePaginationFunctions,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IExecuteFunctions,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export class GooglePhotos implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Google Photos',
		icon: 'file:google.svg',
		name: 'googlePhotos',
		group: ['transform'],
		version: 1,
		description: 'Access and manage Google Photos library',
		defaults: {
			name: 'Google Photos',
		},
		inputs: ['main'],
		outputs: ['main'],
		// @ts-ignore - usableAsTool is supported at runtime but not in older type definitions
		usableAsTool: true,
		credentials: [
			{
				name: 'googlePhotosOAuth2Api',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://photoslibrary.googleapis.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Album',
						value: 'album',
					},
					{
						name: 'Media Item',
						value: 'mediaItem',
					},
					{
						name: 'Shared Album',
						value: 'sharedAlbum',
					},
				],
				default: 'mediaItem',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['album'],
					},
				},
				options: [
					{
						name: 'Add Media Items',
						value: 'addMediaItems',
						description: 'Add media items to an album',
						action: 'Add media items to an album',
						routing: {
							request: {
								method: 'POST',
								url: '=/v1/albums/{{$parameter.albumId}}:batchAddMediaItems',
							},
						},
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new album',
						action: 'Create an album',
						routing: {
							request: {
								method: 'POST',
								url: '/v1/albums',
							},
						},
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an album by ID',
						action: 'Get an album',
						routing: {
							request: {
								method: 'GET',
								url: '=/v1/albums/{{$parameter.albumId}}',
							},
						},
					},
					{
						name: 'List',
						value: 'list',
						description: 'List all albums',
						action: 'List albums',
						routing: {
							request: {
								method: 'GET',
								url: '/v1/albums',
							},
							send: {
								paginate: true,
							},
							operations: {
								pagination: handleAlbumPagination,
							},
						},
					},
					{
						name: 'Remove Media Items',
						value: 'removeMediaItems',
						description: 'Remove media items from an album',
						action: 'Remove media items from an album',
						routing: {
							request: {
								method: 'POST',
								url: '=/v1/albums/{{$parameter.albumId}}:batchRemoveMediaItems',
							},
						},
					},
					{
						name: 'Share',
						value: 'share',
						description: 'Share an album',
						action: 'Share an album',
						routing: {
							request: {
								method: 'POST',
								url: '=/v1/albums/{{$parameter.albumId}}:share',
							},
						},
					},
					{
						name: 'Unshare',
						value: 'unshare',
						description: 'Unshare an album',
						action: 'Unshare an album',
						routing: {
							request: {
								method: 'POST',
								url: '=/v1/albums/{{$parameter.albumId}}:unshare',
							},
						},
					},
				],
				default: 'list',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['mediaItem'],
					},
				},
				options: [
					{
						name: 'Batch Create',
						value: 'batchCreate',
						description: 'Upload and create multiple media items',
						action: 'Batch create media items',
					},
					{
						name: 'Batch Get',
						value: 'batchGet',
						description: 'Get multiple media items by IDs',
						action: 'Batch get media items',
						routing: {
							request: {
								method: 'GET',
								url: '/v1/mediaItems:batchGet',
							},
						},
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Upload and create a media item',
						action: 'Create a media item',
						routing: {
							request: {
								method: 'POST',
								url: '/v1/mediaItems:batchCreate',
							},
							send: {
								preSend: [handleMediaItemUploadAndCreate],
							},
						},
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a media item by ID',
						action: 'Get a media item',
						routing: {
							request: {
								method: 'GET',
								url: '=/v1/mediaItems/{{$parameter.mediaItemId}}',
							},
						},
					},
					{
						name: 'List',
						value: 'list',
						description: 'List media items',
						action: 'List media items',
						routing: {
							request: {
								method: 'GET',
								url: '/v1/mediaItems',
							},
							send: {
								paginate: true,
							},
							operations: {
								pagination: handleMediaItemPagination,
							},
						},
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search for media items',
						action: 'Search media items',
						routing: {
							request: {
								method: 'POST',
								url: '/v1/mediaItems:search',
							},
							send: {
								paginate: true,
							},
							operations: {
								pagination: handleMediaItemSearchPagination,
							},
						},
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a media item',
						action: 'Update a media item',
						routing: {
							request: {
								method: 'PATCH',
								url: '=/v1/mediaItems/{{$parameter.mediaItemId}}',
								qs: {
									updateMask: 'description',
								},
							},
						},
					},
				],
				default: 'list',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['sharedAlbum'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a shared album by share token',
						action: 'Get a shared album',
						routing: {
							request: {
								method: 'GET',
								url: '=/v1/sharedAlbums/{{$parameter.shareToken}}',
							},
						},
					},
					{
						name: 'Join',
						value: 'join',
						description: 'Join a shared album',
						action: 'Join a shared album',
						routing: {
							request: {
								method: 'POST',
								url: '/v1/sharedAlbums:join',
							},
						},
					},
					{
						name: 'Leave',
						value: 'leave',
						description: 'Leave a shared album',
						action: 'Leave a shared album',
						routing: {
							request: {
								method: 'POST',
								url: '/v1/sharedAlbums:leave',
							},
						},
					},
					{
						name: 'List',
						value: 'list',
						description: 'List all shared albums',
						action: 'List shared albums',
						routing: {
							request: {
								method: 'GET',
								url: '/v1/sharedAlbums',
							},
							send: {
								paginate: true,
							},
							operations: {
								pagination: handleSharedAlbumPagination,
							},
						},
					},
				],
				default: 'list',
			},
			// Album fields
			{
				displayName: 'Album ID',
				name: 'albumId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['album'],
						operation: ['get', 'share', 'unshare', 'addMediaItems', 'removeMediaItems'],
					},
				},
				default: '',
				description: 'The ID of the album',
			},
			{
				displayName: 'Media Item IDs',
				name: 'mediaItemIds',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['album'],
						operation: ['addMediaItems', 'removeMediaItems'],
					},
				},
				default: '',
				description: 'Comma-separated list of media item IDs (maximum 50 items)',
				routing: {
					request: {
						body: {
							mediaItemIds: '={{ $value.split(",").map(id => id.trim()) }}',
						},
					},
					send: {
						preSend: [
							async function (this, requestOptions) {
								const mediaItemIds = this.getNodeParameter('mediaItemIds') as string;
								const idsArray = mediaItemIds.split(',').map((id) => id.trim()).filter((id) => id);

								if (idsArray.length === 0) {
									throw new NodeOperationError(this.getNode(), 'At least one media item ID is required');
								}

								if (idsArray.length > 50) {
									throw new NodeOperationError(this.getNode(), 'Maximum 50 media item IDs allowed per batch operation');
								}

								requestOptions.body = {
									...requestOptions.body,
									mediaItemIds: idsArray,
								};

								return requestOptions;
							},
						],
					},
				},
			},
			{
				displayName: 'Share Token',
				name: 'shareToken',
				type: 'string',
				typeOptions: { password: true },
				required: true,
				displayOptions: {
					show: {
						resource: ['sharedAlbum'],
						operation: ['get', 'join', 'leave'],
					},
				},
				default: '',
				description: 'The share token of the shared album',
				routing: {
					request: {
						body: {
							shareToken: '={{ $value }}',
						},
					},
					send: {
						preSend: [
							async function (this, requestOptions) {
								// For GET operation, shareToken is in URL, not body
								if (this.getNodeParameter('operation') === 'get') {
									delete requestOptions.body?.shareToken;
								}
								return requestOptions;
							},
						],
					},
				},
			},
			{
				displayName: 'Album Title',
				name: 'title',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['album'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'Title of the album to create',
				routing: {
					request: {
						body: {
							album: {
								title: '={{ $value }}',
							},
						},
					},
				},
			},
			{
				displayName: 'Share Options',
				name: 'shareOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['album'],
						operation: ['share'],
					},
				},
				options: [
					{
						displayName: 'Is Collaborative',
						name: 'isCollaborative',
						type: 'boolean',
						default: false,
						description: 'Whether the shared album allows collaborators to add media items',
						routing: {
							request: {
								body: {
									sharedAlbumOptions: {
										isCollaborative: '={{ $value }}',
									},
								},
							},
						},
					},
					{
						displayName: 'Is Commentable',
						name: 'isCommentable',
						type: 'boolean',
						default: false,
						description: 'Whether the shared album allows collaborators to add comments',
						routing: {
							request: {
								body: {
									sharedAlbumOptions: {
										isCommentable: '={{ $value }}',
									},
								},
							},
						},
					},
				],
			},
			// Media Item fields
			{
				displayName: 'Media Item ID',
				name: 'mediaItemId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['mediaItem'],
						operation: ['get', 'update'],
					},
				},
				default: '',
				description: 'The ID of the media item to retrieve',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['mediaItem'],
						operation: ['create', 'batchCreate'],
					},
				},
				default: 'data',
				description: 'Name of the binary property containing the file(s) to upload. For Batch Create, supports: (1) Multiple items each with a single binary file, or (2) Single item with an array of binary files.',
				hint: 'For Batch Create: Provide multiple input items OR a single item with binary array. Maximum 50 files total per batch.',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['mediaItem'],
						operation: ['create', 'batchCreate'],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						description: 'Description for the media item. For Batch Create, this applies to all items unless individual items have a "description" field in their JSON data.',
					},
					{
						displayName: 'Album ID',
						name: 'albumId',
						type: 'string',
						default: '',
						description: 'ID of the album to add the media item(s) to. For Batch Create, all items will be added to this album.',
					},
				],
			},
			{
				displayName: 'Media Item IDs',
				name: 'mediaItemIds',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['mediaItem'],
						operation: ['batchGet'],
					},
				},
				default: '',
				description: 'Comma-separated list of media item IDs to retrieve (maximum 50 items)',
				routing: {
					send: {
						preSend: [
							async function (this, requestOptions) {
								const mediaItemIds = this.getNodeParameter('mediaItemIds') as string;
								const idsArray = mediaItemIds.split(',').map((id) => id.trim()).filter((id) => id);

								if (idsArray.length === 0) {
									throw new NodeOperationError(this.getNode(), 'At least one media item ID is required');
								}

								if (idsArray.length > 50) {
									throw new NodeOperationError(this.getNode(), 'Maximum 50 media item IDs allowed per batch get operation');
								}

								// Build query string with multiple mediaItemIds parameters
								const queryParams = idsArray.map((id) => `mediaItemIds=${encodeURIComponent(id)}`).join('&');
								requestOptions.url = `${requestOptions.url}?${queryParams}`;

								return requestOptions;
							},
						],
					},
				},
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['mediaItem'],
						operation: ['update'],
					},
				},
				default: '',
				description: 'The new description for the media item',
				routing: {
					request: {
						body: {
							description: '={{ $value }}',
						},
					},
				},
			},
			{
				displayName: 'Return All',
				description: 'Whether to return all results or only up to a given limit',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['list', 'search'],
						resource: ['album', 'mediaItem', 'sharedAlbum'],
					},
				},
				default: false,
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['list', 'search'],
						returnAll: [false],
					},
				},
				default: 50,
				description: 'Max number of results to return',
				typeOptions: {
					minValue: 1,
				},
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['mediaItem'],
						operation: ['search'],
					},
				},
				options: [
					{
						displayName: 'Album ID',
						name: 'albumId',
						type: 'string',
						default: '',
						description: 'Search for media items in a specific album',
						routing: {
							request: {
								body: {
									albumId: '={{ $value }}',
								},
							},
						},
					},
					{
						displayName: 'Media Type',
						name: 'mediaTypeFilter',
						type: 'options',
						options: [
							{
								name: 'All Media',
								value: 'ALL_MEDIA',
							},
							{
								name: 'Photos Only',
								value: 'PHOTO',
							},
							{
								name: 'Videos Only',
								value: 'VIDEO',
							},
						],
						default: 'ALL_MEDIA',
						routing: {
							request: {
								body: {
									filters: {
										mediaTypeFilter: {
											mediaTypes: '={{ [$value] }}',
										},
									},
								},
							},
						},
					},
					{
						displayName: 'Content Category',
						name: 'contentCategory',
						type: 'multiOptions',
						options: [
							{ name: 'Animals', value: 'ANIMALS' },
							{ name: 'Birthdays', value: 'BIRTHDAYS' },
							{ name: 'Cityscapes', value: 'CITYSCAPES' },
							{ name: 'Documents', value: 'DOCUMENTS' },
							{ name: 'Fashion', value: 'FASHION' },
							{ name: 'Food', value: 'FOOD' },
							{ name: 'Gardens', value: 'GARDENS' },
							{ name: 'Landmarks', value: 'LANDMARKS' },
							{ name: 'Landscapes', value: 'LANDSCAPES' },
							{ name: 'Night', value: 'NIGHT' },
							{ name: 'People', value: 'PEOPLE' },
							{ name: 'Performances', value: 'PERFORMANCES' },
							{ name: 'Pets', value: 'PETS' },
							{ name: 'Receipts', value: 'RECEIPTS' },
							{ name: 'Screenshots', value: 'SCREENSHOTS' },
							{ name: 'Selfies', value: 'SELFIES' },
							{ name: 'Sport', value: 'SPORT' },
							{ name: 'Travel', value: 'TRAVEL' },
							{ name: 'Utility', value: 'UTILITY' },
							{ name: 'Weddings', value: 'WEDDINGS' },
							{ name: 'Whiteboards', value: 'WHITEBOARDS' },
						],
						default: [],
						routing: {
							request: {
								body: {
									filters: {
										contentFilter: {
											includedContentCategories: '={{ $value }}',
										},
									},
								},
							},
						},
					},
					{
						displayName: 'Exclude Content Category',
						name: 'excludeContentCategory',
						type: 'multiOptions',
						options: [
							{ name: 'Animals', value: 'ANIMALS' },
							{ name: 'Birthdays', value: 'BIRTHDAYS' },
							{ name: 'Cityscapes', value: 'CITYSCAPES' },
							{ name: 'Documents', value: 'DOCUMENTS' },
							{ name: 'Fashion', value: 'FASHION' },
							{ name: 'Food', value: 'FOOD' },
							{ name: 'Gardens', value: 'GARDENS' },
							{ name: 'Landmarks', value: 'LANDMARKS' },
							{ name: 'Landscapes', value: 'LANDSCAPES' },
							{ name: 'Night', value: 'NIGHT' },
							{ name: 'People', value: 'PEOPLE' },
							{ name: 'Performances', value: 'PERFORMANCES' },
							{ name: 'Pets', value: 'PETS' },
							{ name: 'Receipts', value: 'RECEIPTS' },
							{ name: 'Screenshots', value: 'SCREENSHOTS' },
							{ name: 'Selfies', value: 'SELFIES' },
							{ name: 'Sport', value: 'SPORT' },
							{ name: 'Travel', value: 'TRAVEL' },
							{ name: 'Utility', value: 'UTILITY' },
							{ name: 'Weddings', value: 'WEDDINGS' },
							{ name: 'Whiteboards', value: 'WHITEBOARDS' },
						],
						default: [],
						routing: {
							request: {
								body: {
									filters: {
										contentFilter: {
											excludedContentCategories: '={{ $value }}',
										},
									},
								},
							},
						},
					},
					{
						displayName: 'Include Archived',
						name: 'includeArchivedMedia',
						type: 'boolean',
						default: false,
						description: 'Whether to include archived media items in results',
						routing: {
							request: {
								body: {
									filters: {
										includeArchivedMedia: '={{ $value }}',
										},
								},
							},
						},
					},
					{
						displayName: 'Exclude Non-App Created',
						name: 'excludeNonAppCreatedData',
						type: 'boolean',
						default: false,
						description: 'Whether to exclude media items not created by this app',
						routing: {
							request: {
								body: {
									filters: {
										excludeNonAppCreatedData: '={{ $value }}',
									},
								},
							},
						},
					},
					{
						displayName: 'Date Filter',
						name: 'dateFilter',
						type: 'fixedCollection',
						placeholder: 'Add Date Filter',
						default: {},
						description: 'Filter media items by date',
						typeOptions: {
							multipleValues: false,
						},
						options: [
							{
								name: 'dates',
								displayName: 'Specific Dates',
								values: [
									{
										displayName: 'Year',
										name: 'year',
										type: 'number',
										default: new Date().getFullYear(),
										required: true,
										description: 'Year of the date',
										typeOptions: {
											minValue: 1900,
											maxValue: 2100,
										},
									},
									{
										displayName: 'Month',
										name: 'month',
										type: 'number',
										default: 1,
										description: 'Month of the date (1-12)',
										typeOptions: {
											minValue: 1,
											maxValue: 12,
										},
									},
									{
										displayName: 'Day',
										name: 'day',
										type: 'number',
										default: 1,
										description: 'Day of the date (1-31)',
										typeOptions: {
											minValue: 1,
											maxValue: 31,
										},
									},
								],
							},
							{
								name: 'ranges',
								displayName: 'Date Ranges',
								values: [
									{
										displayName: 'Start Date',
										name: 'startDate',
										type: 'dateTime',
										default: '',
										required: true,
										description: 'Start date of the range',
									},
									{
										displayName: 'End Date',
										name: 'endDate',
										type: 'dateTime',
										default: '',
										required: true,
										description: 'End date of the range',
									},
								],
							},
						],
						routing: {
							send: {
								preSend: [
									async function (this, requestOptions) {
										const filters = this.getNodeParameter('filters', {}) as IDataObject;
										const dateFilter = filters.dateFilter as IDataObject | undefined;

										if (!dateFilter) {
											return requestOptions;
										}

										// Initialize filters.dateFilter in request body if not exists
										if (!requestOptions.body) {
											requestOptions.body = {};
										}
										const body = requestOptions.body as IDataObject;
										if (!body.filters) {
											body.filters = {};
										}
										const bodyFilters = body.filters as IDataObject;
										bodyFilters.dateFilter = {};
										const bodyDateFilter = bodyFilters.dateFilter as IDataObject;

										// Handle specific dates
										if (dateFilter.dates) {
											const datesArray = Array.isArray(dateFilter.dates) ? dateFilter.dates : [dateFilter.dates];
											bodyDateFilter.dates = datesArray.map((date: IDataObject) => {
												const dateObj: IDataObject = {
													year: date.year,
												};
												if (date.month !== undefined && date.month !== null) {
													dateObj.month = date.month;
												}
												if (date.day !== undefined && date.day !== null) {
													dateObj.day = date.day;
												}
												return dateObj;
											});
										}

										// Handle date ranges
										if (dateFilter.ranges) {
											const rangesArray = Array.isArray(dateFilter.ranges) ? dateFilter.ranges : [dateFilter.ranges];
											bodyDateFilter.ranges = rangesArray.map((range: IDataObject) => {
												// Parse startDate
												const startDate = new Date(range.startDate as string);
												const endDate = new Date(range.endDate as string);

												return {
													startDate: {
														year: startDate.getFullYear(),
														month: startDate.getMonth() + 1, // JavaScript months are 0-indexed
														day: startDate.getDate(),
													},
													endDate: {
														year: endDate.getFullYear(),
														month: endDate.getMonth() + 1,
														day: endDate.getDate(),
													},
												};
											});
										}

										return requestOptions;
									},
								],
							},
						},
					},
					{
						displayName: 'Feature Filter',
						name: 'featureFilter',
						type: 'fixedCollection',
						placeholder: 'Add Feature Filter',
						default: {},
						description: 'Filter media items by features like favorites or archived status',
						typeOptions: {
							multipleValues: false,
						},
						options: [
							{
								name: 'includedFeatures',
								displayName: 'Include Features',
								values: [
									{
										displayName: 'Features',
										name: 'features',
										type: 'multiOptions',
										default: [],
										description: 'Features to include in search results',
										options: [
											{
												name: 'Favorites',
												value: 'FAVORITES',
											},
											{
												name: 'Archived',
												value: 'ARCHIVED',
											},
										],
									},
								],
							},
							{
								name: 'excludedFeatures',
								displayName: 'Exclude Features',
								values: [
									{
										displayName: 'Features',
										name: 'features',
										type: 'multiOptions',
										default: [],
										description: 'Features to exclude from search results',
										options: [
											{
												name: 'Favorites',
												value: 'FAVORITES',
											},
											{
												name: 'Archived',
												value: 'ARCHIVED',
											},
										],
									},
								],
							},
						],
						routing: {
							send: {
								preSend: [
									async function (this, requestOptions) {
										const filters = this.getNodeParameter('filters', {}) as IDataObject;
										const featureFilter = filters.featureFilter as IDataObject | undefined;

										if (!featureFilter) {
											return requestOptions;
										}

										// Initialize filters.featureFilter in request body if not exists
										if (!requestOptions.body) {
											requestOptions.body = {};
										}
										const body = requestOptions.body as IDataObject;
										if (!body.filters) {
											body.filters = {};
										}
										const bodyFilters = body.filters as IDataObject;
										bodyFilters.featureFilter = {};
										const bodyFeatureFilter = bodyFilters.featureFilter as IDataObject;

										// Handle included features
										if (featureFilter.includedFeatures) {
											const includedFeaturesData = featureFilter.includedFeatures as IDataObject;
											if (includedFeaturesData.features && Array.isArray(includedFeaturesData.features) && includedFeaturesData.features.length > 0) {
												bodyFeatureFilter.includedFeatures = includedFeaturesData.features;
											}
										}

										// Handle excluded features
										if (featureFilter.excludedFeatures) {
											const excludedFeaturesData = featureFilter.excludedFeatures as IDataObject;
											if (excludedFeaturesData.features && Array.isArray(excludedFeaturesData.features) && excludedFeaturesData.features.length > 0) {
												bodyFeatureFilter.excludedFeatures = excludedFeaturesData.features;
											}
										}

										return requestOptions;
									},
								],
							},
						},
					},
				],
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['album'],
						operation: ['list'],
					},
				},
				options: [
					{
						displayName: 'Exclude Non-App Created Albums',
						name: 'excludeNonAppCreatedData',
						type: 'boolean',
						default: false,
						description: 'Whether to exclude albums not created by this app',
						routing: {
							request: {
								qs: {
									excludeNonAppCreatedData: '={{ $value }}',
								},
							},
						},
					},
				],
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['sharedAlbum'],
						operation: ['list'],
					},
				},
				options: [
					{
						displayName: 'Exclude Non-App Created Data',
						name: 'excludeNonAppCreatedData',
						type: 'boolean',
						default: false,
						description: 'Whether to exclude shared albums not created by this app',
						routing: {
							request: {
								qs: {
									excludeNonAppCreatedData: '={{ $value }}',
								},
							},
						},
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Handle batch create operation manually
		if (resource === 'mediaItem' && operation === 'batchCreate') {
			return [await handleMediaItemBatchUploadAndCreate.call(this)];
		}

		// For all other operations, return empty (they're handled by declarative routing)
		return [[]];
	}
}

async function handleAlbumPagination(
	this: IExecutePaginationFunctions,
	resultOptions: DeclarativeRestApiSettings.ResultOptions,
): Promise<INodeExecutionData[]> {
	const aggregatedResult: IDataObject[] = [];
	let nextPageToken: string | undefined;
	const returnAll = this.getNodeParameter('returnAll') as boolean;
	let limit = 0;
	if (!returnAll) {
		limit = this.getNodeParameter('limit') as number;
	}

	do {
		if (nextPageToken) {
			resultOptions.options.qs = { ...resultOptions.options.qs, pageToken: nextPageToken };
		}
		if (!returnAll) {
			resultOptions.options.qs = {
				...resultOptions.options.qs,
				pageSize: Math.min(50, limit - aggregatedResult.length),
			};
		} else {
			resultOptions.options.qs = { ...resultOptions.options.qs, pageSize: 50 };
		}

		const responseData = await this.makeRoutingRequest(resultOptions);

		for (const page of responseData) {
			if (page.json.albums) {
				const currentData = page.json.albums as IDataObject[];
				aggregatedResult.push(...currentData);
			}

			nextPageToken = page.json.nextPageToken as string | undefined;

			if (!returnAll && aggregatedResult.length >= limit) {
				return aggregatedResult.slice(0, limit).map((item) => ({ json: item }));
			}
		}
	} while (nextPageToken && (returnAll || aggregatedResult.length < limit));

	return aggregatedResult.map((item) => ({ json: item }));
}

async function handleMediaItemPagination(
	this: IExecutePaginationFunctions,
	resultOptions: DeclarativeRestApiSettings.ResultOptions,
): Promise<INodeExecutionData[]> {
	const aggregatedResult: IDataObject[] = [];
	let nextPageToken: string | undefined;
	const returnAll = this.getNodeParameter('returnAll') as boolean;
	let limit = 0;
	if (!returnAll) {
		limit = this.getNodeParameter('limit') as number;
	}

	do {
		if (nextPageToken) {
			resultOptions.options.qs = { ...resultOptions.options.qs, pageToken: nextPageToken };
		}
		if (!returnAll) {
			resultOptions.options.qs = {
				...resultOptions.options.qs,
				pageSize: Math.min(100, limit - aggregatedResult.length),
			};
		} else {
			resultOptions.options.qs = { ...resultOptions.options.qs, pageSize: 100 };
		}

		const responseData = await this.makeRoutingRequest(resultOptions);

		for (const page of responseData) {
			if (page.json.mediaItems) {
				const currentData = page.json.mediaItems as IDataObject[];
				aggregatedResult.push(...currentData);
			}

			nextPageToken = page.json.nextPageToken as string | undefined;

			if (!returnAll && aggregatedResult.length >= limit) {
				return aggregatedResult.slice(0, limit).map((item) => ({ json: item }));
			}
		}
	} while (nextPageToken && (returnAll || aggregatedResult.length < limit));

	return aggregatedResult.map((item) => ({ json: item }));
}

async function handleMediaItemSearchPagination(
	this: IExecutePaginationFunctions,
	resultOptions: DeclarativeRestApiSettings.ResultOptions,
): Promise<INodeExecutionData[]> {
	const aggregatedResult: IDataObject[] = [];
	let nextPageToken: string | undefined;
	const returnAll = this.getNodeParameter('returnAll') as boolean;
	let limit = 0;
	if (!returnAll) {
		limit = this.getNodeParameter('limit') as number;
	}

	do {
		if (nextPageToken) {
			resultOptions.options.body = { ...resultOptions.options.body, pageToken: nextPageToken };
		}
		if (!returnAll) {
			resultOptions.options.body = {
				...resultOptions.options.body,
				pageSize: Math.min(100, limit - aggregatedResult.length),
			};
		} else {
			resultOptions.options.body = { ...resultOptions.options.body, pageSize: 100 };
		}

		const responseData = await this.makeRoutingRequest(resultOptions);

		for (const page of responseData) {
			if (page.json.mediaItems) {
				const currentData = page.json.mediaItems as IDataObject[];
				aggregatedResult.push(...currentData);
			}

			nextPageToken = page.json.nextPageToken as string | undefined;

			if (!returnAll && aggregatedResult.length >= limit) {
				return aggregatedResult.slice(0, limit).map((item) => ({ json: item }));
			}
		}
	} while (nextPageToken && (returnAll || aggregatedResult.length < limit));

	return aggregatedResult.map((item) => ({ json: item }));
}

async function handleSharedAlbumPagination(
	this: IExecutePaginationFunctions,
	resultOptions: DeclarativeRestApiSettings.ResultOptions,
): Promise<INodeExecutionData[]> {
	const aggregatedResult: IDataObject[] = [];
	let nextPageToken: string | undefined;
	const returnAll = this.getNodeParameter('returnAll') as boolean;
	let limit = 0;
	if (!returnAll) {
		limit = this.getNodeParameter('limit') as number;
	}

	do {
		if (nextPageToken) {
			resultOptions.options.qs = { ...resultOptions.options.qs, pageToken: nextPageToken };
		}
		if (!returnAll) {
			resultOptions.options.qs = {
				...resultOptions.options.qs,
				pageSize: Math.min(50, limit - aggregatedResult.length),
			};
		} else {
			resultOptions.options.qs = { ...resultOptions.options.qs, pageSize: 50 };
		}

		const responseData = await this.makeRoutingRequest(resultOptions);

		for (const page of responseData) {
			if (page.json.sharedAlbums) {
				const currentData = page.json.sharedAlbums as IDataObject[];
				aggregatedResult.push(...currentData);
			}

			nextPageToken = page.json.nextPageToken as string | undefined;

			if (!returnAll && aggregatedResult.length >= limit) {
				return aggregatedResult.slice(0, limit).map((item) => ({ json: item }));
			}
		}
	} while (nextPageToken && (returnAll || aggregatedResult.length < limit));

	return aggregatedResult.map((item) => ({ json: item }));
}

async function handleMediaItemUploadAndCreate(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const binaryPropertyName = this.getNodeParameter('binaryPropertyName') as string;
	const additionalFields = this.getNodeParameter('additionalFields', {}) as IDataObject;

	// Get the item to access binary metadata
	const item = this.getInputData();
	const binaryItem = item.binary?.[binaryPropertyName];

	if (!binaryItem) {
		throw new NodeOperationError(
			this.getNode(),
			`Binary property "${binaryPropertyName}" not found in input data`,
		);
	}

	const mimeType = binaryItem.mimeType || 'application/octet-stream';
	const fileName = binaryItem.fileName || 'file';

	// Get binary data buffer (propertyName, inputIndex)
	const binaryDataBuffer = await this.helpers.getBinaryDataBuffer(binaryPropertyName, 0);

	if (!binaryDataBuffer) {
		throw new NodeOperationError(
			this.getNode(),
			`No binary data found for property "${binaryPropertyName}"`,
		);
	}

	// Step 1: Upload the file to get uploadToken
	let uploadToken: string;
	try {
		const uploadResponse = await this.helpers.httpRequest({
			method: 'POST',
			url: 'https://photoslibrary.googleapis.com/v1/uploads',
			body: binaryDataBuffer,
			headers: {
				'Content-Type': 'application/octet-stream',
				'X-Goog-Upload-Content-Type': mimeType,
				'X-Goog-Upload-Protocol': 'raw',
			},
			returnFullResponse: false,
		});

		uploadToken = uploadResponse as string;

		if (!uploadToken) {
			throw new NodeOperationError(
				this.getNode(),
				'Failed to obtain upload token from Google Photos. The upload may have succeeded but no token was returned.',
			);
		}
	} catch (error) {
		if (error instanceof NodeOperationError) {
			throw error;
		}
		// Handle API errors with better context
		const statusCode = error.statusCode || error.response?.statusCode;
		let errorMessage = 'Failed to upload media file to Google Photos';

		if (statusCode === 401 || statusCode === 403) {
			errorMessage += ': Authentication or permission error. Please verify your OAuth credentials and scopes.';
		} else if (statusCode === 400) {
			errorMessage += ': Invalid file or request. Please check the file format and size.';
		} else if (error.message) {
			errorMessage += `: ${error.message}`;
		}

		throw new NodeOperationError(this.getNode(), errorMessage);
	}

	// Step 2: Build the newMediaItems array with the uploadToken
	const newMediaItem: IDataObject = {
		simpleMediaItem: {
			uploadToken,
			fileName,
		},
	};

	// Add optional description if provided
	if (additionalFields.description) {
		newMediaItem.description = additionalFields.description;
	}

	// Step 3: Modify request body to include newMediaItems array
	requestOptions.body = {
		newMediaItems: [newMediaItem],
	};

	// Add optional albumId if provided
	if (additionalFields.albumId) {
		(requestOptions.body as IDataObject).albumId = additionalFields.albumId;
	}

	return requestOptions;
}

async function handleMediaItemBatchUploadAndCreate(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[]> {
	const binaryPropertyName = this.getNodeParameter('binaryPropertyName', 0) as string;
	const additionalFields = this.getNodeParameter('additionalFields', 0, {}) as IDataObject;

	// Get all input items - for batch operations, we need to access all items
	const items = this.getInputData();

	// Validate batch size
	if (items.length === 0) {
		throw new NodeOperationError(this.getNode(), 'No input items provided for batch create');
	}

	const newMediaItems: IDataObject[] = [];

	// Build a flat list of binary items to upload
	interface BinaryItemToUpload {
		binaryData: Uint8Array;
		mimeType: string;
		fileName: string;
		description?: string;
		itemIndex: number;
	}

	const binaryItemsToUpload: BinaryItemToUpload[] = [];

	// Check if we have multiple items or a single item with array
	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		const binaryData = item.binary?.[binaryPropertyName];

		if (!binaryData) {
			throw new NodeOperationError(
				this.getNode(),
				`Binary property "${binaryPropertyName}" not found in input item ${i + 1}`,
			);
		}

		// Check if binaryData is an array (single item with multiple files)
		if (Array.isArray(binaryData)) {
			// Handle array of binary data
			for (let j = 0; j < binaryData.length; j++) {
				const singleBinary = binaryData[j];
				const buffer = await this.helpers.getBinaryDataBuffer(i, `${binaryPropertyName}[${j}]`);

				if (!buffer) {
					throw new NodeOperationError(
						this.getNode(),
						`No binary data found for property "${binaryPropertyName}[${j}]" in input item ${i + 1}`,
					);
				}

				const descriptions = item.json?.descriptions as string[] | undefined;
				binaryItemsToUpload.push({
					binaryData: buffer,
					mimeType: singleBinary.mimeType || 'application/octet-stream',
					fileName: singleBinary.fileName || `file_${i + 1}_${j + 1}`,
					description: descriptions?.[j],
					itemIndex: i,
				});
			}
		} else {
			// Handle single binary data per item
			const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

			if (!buffer) {
				throw new NodeOperationError(
					this.getNode(),
					`No binary data found for property "${binaryPropertyName}" in input item ${i + 1}`,
				);
			}

			binaryItemsToUpload.push({
				binaryData: buffer,
				mimeType: binaryData.mimeType || 'application/octet-stream',
				fileName: binaryData.fileName || `file_${i + 1}`,
				description: item.json?.description as string | undefined,
				itemIndex: i,
			});
		}
	}

	// Validate total batch size
	if (binaryItemsToUpload.length === 0) {
		throw new NodeOperationError(this.getNode(), 'No binary data found to upload');
	}

	if (binaryItemsToUpload.length > 50) {
		throw new NodeOperationError(
			this.getNode(),
			`Maximum 50 media items allowed per batch create operation. Found ${binaryItemsToUpload.length} items.`,
		);
	}

	// Upload all files
	for (let i = 0; i < binaryItemsToUpload.length; i++) {
		const { binaryData, mimeType, fileName, description } = binaryItemsToUpload[i];

		// Upload the file to get uploadToken
		let uploadToken: string;
		try {
			const uploadResponse = await this.helpers.httpRequestWithAuthentication.call(
				this,
				'googlePhotosOAuth2Api',
				{
					method: 'POST',
					url: 'https://photoslibrary.googleapis.com/v1/uploads',
					body: binaryData,
					headers: {
						'Content-Type': 'application/octet-stream',
						'X-Goog-Upload-Content-Type': mimeType,
						'X-Goog-Upload-Protocol': 'raw',
					},
					returnFullResponse: false,
				},
			);

			uploadToken = uploadResponse as string;

			if (!uploadToken) {
				throw new NodeOperationError(
					this.getNode(),
					`Failed to obtain upload token from Google Photos for file ${i + 1}. The upload may have succeeded but no token was returned.`,
				);
			}
		} catch (error) {
			if (error instanceof NodeOperationError) {
				throw error;
			}
			// Handle API errors with better context
			const statusCode = error.statusCode || error.response?.statusCode;
			let errorMessage = `Failed to upload media file ${i + 1} (${fileName}) to Google Photos`;

			if (statusCode === 401 || statusCode === 403) {
				errorMessage += ': Authentication or permission error. Please verify your OAuth credentials and scopes.';
			} else if (statusCode === 400) {
				errorMessage += ': Invalid file or request. Please check the file format and size.';
			} else if (error.message) {
				errorMessage += `: ${error.message}`;
			}

			throw new NodeOperationError(this.getNode(), errorMessage);
		}

		// Build the media item with uploadToken
		const newMediaItem: IDataObject = {
			simpleMediaItem: {
				uploadToken,
				fileName,
			},
		};

		// Add description if available
		if (description) {
			newMediaItem.description = description;
		} else if (additionalFields.description) {
			newMediaItem.description = additionalFields.description;
		}

		newMediaItems.push(newMediaItem);
	}

	// Build the final request body with all uploaded items
	const requestBody: IDataObject = {
		newMediaItems,
	};

	// Add optional albumId if provided (applies to all items)
	if (additionalFields.albumId) {
		requestBody.albumId = additionalFields.albumId;
	}

	// Make the batch create request
	const response = await this.helpers.httpRequestWithAuthentication.call(
		this,
		'googlePhotosOAuth2Api',
		{
			method: 'POST',
			url: 'https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate',
			body: requestBody,
			json: true,
		},
	);

	// Return the results as node execution data
	const newMediaItemResults = (response as IDataObject).newMediaItemResults as IDataObject[];

	if (!newMediaItemResults || newMediaItemResults.length === 0) {
		return [];
	}

	return newMediaItemResults.map((result) => ({
		json: (result.mediaItem as IDataObject) || result,
	}));
}


