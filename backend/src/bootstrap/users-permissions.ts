export async function configureUsersPermissions({ strapi }) {
  // Find the public role
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  // Update permissions for public role
  const publicPermissions = {
    'plugin::users-permissions.auth': {
      register: { enabled: true },
      login: { enabled: true },
    },
    'api::message.message': {
      find: { enabled: true },
      findOne: { enabled: true },
      create: { enabled: true },
      update: { enabled: true },
    },
  };

  // First, get all permissions for the public role
  const permissions = await strapi
    .query('plugin::users-permissions.permission')
    .findMany({
      where: {
        role: publicRole.id,
      },
    });

  // Disable all permissions first
  for (const permission of permissions) {
    await strapi
      .query('plugin::users-permissions.permission')
      .update({
        where: { id: permission.id },
        data: { enabled: false },
      });
  }

  // Set specific permissions
  for (const controller in publicPermissions) {
    for (const action in publicPermissions[controller]) {
      await strapi
        .query('plugin::users-permissions.permission')
        .update({
          where: {
            role: publicRole.id,
            action: `${controller}.${action}`,
          },
          data: {
            enabled: publicPermissions[controller][action].enabled,
          },
        });
    }
  }

  // Find authenticated role
  const authenticatedRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'authenticated' } });

  // Update permissions for authenticated role
  const authenticatedPermissions = {
    'api::message.message': {
      find: { enabled: true },
      findOne: { enabled: true },
      create: { enabled: true },
      update: { enabled: true },
    },
  };

  // Set authenticated role permissions
  for (const controller in authenticatedPermissions) {
    for (const action in authenticatedPermissions[controller]) {
      await strapi
        .query('plugin::users-permissions.permission')
        .update({
          where: {
            role: authenticatedRole.id,
            action: `${controller}.${action}`,
          },
          data: {
            enabled: authenticatedPermissions[controller][action].enabled,
          },
        });
    }
  }
} 