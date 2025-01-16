import type { Core } from '@strapi/strapi';

import WebSocketService from './services/websocket';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {},
  bootstrap({ strapi }: { strapi: Core.Strapi } ) {
    WebSocketService.initialize({ strapi });
  },
};
