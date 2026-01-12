import type { Schema, Struct } from '@strapi/strapi';

export interface TestCategoryTest extends Struct.ComponentSchema {
  collectionName: 'components_test_category_tests';
  info: {
    displayName: 'Test';
  };
  attributes: {};
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'test-category.test': TestCategoryTest;
    }
  }
}
