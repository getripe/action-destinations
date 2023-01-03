import type { ActionDefinition } from '@segment/actions-core'
import type { Settings } from '../generated-types'
import type { Payload } from './generated-types'
import { randomUUID } from 'crypto'

const action: ActionDefinition<Settings, Payload> = {
  title: 'Track',
  description: 'Send user events to Ripe',
  defaultSubscription: 'type = "track"',
  fields: {
    anonymousId: {
      type: 'string',
      allowNull: true,
      description: 'The anonymized user id',
      label: 'Anonymous ID',
      default: { '@path': '$.anonymousId' }
    },
    userId: {
      type: 'string',
      required: false,
      description: 'The ID associated with the user',
      label: 'User ID',
      default: { '@path': '$.userId' }
    },
    groupId: {
      type: 'string',
      required: false,
      description: 'The group id',
      label: 'Group ID',
      default: { '@path': '$.context.groupId' }
    },
    event: {
      type: 'string',
      required: true,
      description: 'The event name',
      label: 'Event Name',
      default: { '@path': '$.event' }
    },
    properties: {
      type: 'object',
      required: false,
      description: 'Properties to send with the event',
      label: 'Event properties',
      default: { '@path': '$.properties' }
    },
    timestamp: {
      type: 'datetime',
      required: false,
      description: 'The timestamp of the event',
      label: 'Timestamp',
      default: { '@path': '$.timestamp' }
    }
  },
  perform: (request, { payload }) => {
    return request('https://core-backend-dot-production-365112.ey.r.appspot.com/api/track', {
      method: 'post',
      json: {
        name: payload.event,
        anonymousId: payload.anonymousId,
        userId: payload.userId,
        context: {
          groupId: payload.groupId
        },
        properties: payload.properties,
        event: payload.event,
        messageId: randomUUID(),
        timestamp: payload.timestamp ?? new Date()
      }
    })
  }
}

export default action
