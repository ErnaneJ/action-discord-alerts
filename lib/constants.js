// https://discord.com/developers/docs/resources/channel#embed-object-embed-limits
// https://discord.com/developers/docs/resources/webhook#execute-webhook

export const MAX_TITLE_LENGTH = 256
export const MAX_DESCRIPTION_LENGTH = 2048
export const MAX_FIELD_NAME_LENGTH = 256
export const MAX_FIELD_VALUE_LENGTH = 1024
export const MAX_WEBHOOK_LENGTH = 2000

export const STATUS_OPTIONS = {
  success: {
    status: 'Successful action run',
    color: 0x28A745
  },
  failure: {
    status: 'Failed action run',
    color: 0xCB2431
  },
  cancelled: {
    status: 'Canceled action run',
    color: 0xDBAB09
  }
}

export const DEFAULT_VALUES = {
  status: 'success',
  username: 'GitHub Actions',
  avatar_url: 'https://github.com/github.png',
  thumbnail: 'https://github.com/github.png'
}

export const INPUTS =  ['webhook', 'status', 'content', 
                        'title', 'description', 'image', 'thumbnail', 'color', 
                        'username', 'avatar_url', 'event_info', 'timestamp', 
                        'verbose', 'custom_fields', 'hide_default_fields']