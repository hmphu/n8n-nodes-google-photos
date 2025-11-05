import type {
	DeclarativeRestApiSettings,
	IDataObject,
	IExecutePaginationFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

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
						operation: ['get'],
					},
				},
				default: '',
				description: 'The ID of the album to retrieve',
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
			// Media Item fields
			{
				displayName: 'Media Item ID',
				name: 'mediaItemId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['mediaItem'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'The ID of the media item to retrieve',
			},
			{
				displayName: 'Return All',
				description: 'Whether to return all results or only up to a given limit',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['list', 'search'],
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
		],
	};
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
