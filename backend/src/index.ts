import type { Core } from '@strapi/strapi';
import WebSocketService from './services/websocket';
import { configureUsersPermissions } from './bootstrap/users-permissions';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {},
  
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Configure users permissions
    await configureUsersPermissions({ strapi });
    
    // Initialize WebSocket service
    WebSocketService.initialize({ strapi });
  },
};
