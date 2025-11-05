import * as n8nWorkflow from 'n8n-workflow';

export class GooglePhotosOAuth2Api implements n8nWorkflow.ICredentialType {
	name = 'googlePhotosOAuth2Api';
	displayName = 'Google Photos OAuth2 API';
	documentationUrl = 'https://developers.google.com/photos/library/guides/get-started';
	icon: n8nWorkflow.Icon = 'file:google.svg';
	extends = ['oAuth2Api'];

	properties: n8nWorkflow.INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://accounts.google.com/o/oauth2/v2/auth',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://oauth2.googleapis.com/token',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'https://www.googleapis.com/auth/photoslibrary https://www.googleapis.com/auth/photoslibrary.readonly https://www.googleapis.com/auth/photoslibrary.appendonly https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata https://www.googleapis.com/auth/photoslibrary.edit.appcreateddata https://www.googleapis.com/auth/photoslibrary.sharing',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: 'access_type=offline&prompt=consent',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},
	];

	authenticate: n8nWorkflow.IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.oauthTokenData.access_token}}',
			},
		},
	};

	test: n8nWorkflow.ICredentialTestRequest = {
		request: {
			baseURL: 'https://photoslibrary.googleapis.com',
			url: '/v1/albums',
			method: 'GET',
		},
	};
}
