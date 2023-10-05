import config from 'config';

export const customWidgets = [
  {
    name: 'IconButton',
    displayName: 'IconButton',
    description: 'Trigger actions: queries, alerts etc',
    component: 'IconButton',
    defaultSize: {
      width: 3,
      height: 30,
    },
    others: {
      showOnDesktop: { type: 'toggle', displayName: 'Show on desktop' },
      showOnMobile: { type: 'toggle', displayName: 'Show on mobile' },
    },
    properties: {
      icon: {
        type: 'iconPicker',
        displayName: 'Icon',
        validation: {
          schema: { type: 'string' },
        },
      },
      alignIcon: {
        type: 'select',
        displayName: 'Align Icon',
        options: [
          { name: 'Left', value: 'left' },
          { name: 'Center', value: 'middle' },
          { name: 'Right', value: 'right' },
        ],
        validation: {
          schema: { type: 'string' },
        },
      },
      text: {
        type: 'code',
        displayName: 'Button Text',
        validation: {
          schema: { type: 'string' },
        },
      },
      alignText: {
        type: 'select',
        displayName: 'Align Text',
        options: [
          { name: 'Left', value: 'left' },
          { name: 'Center', value: 'middle' },
          { name: 'Right', value: 'right' },
        ],
        validation: {
          schema: { type: 'string' },
        },
      },
    },
    events: {
      onClick: { displayName: 'On click' },
      onHover: { displayName: 'On hover' },
    },
    styles: {
      backgroundColor: {
        type: 'color',
        displayName: 'Background color',
        validation: {
          schema: { type: 'string' },
          defaultValue: false,
        },
      },
      iconColor: {
        type: 'color',
        displayName: 'Icon Color',
        validation: {
          schema: { type: 'string' },
        },
      },
      textColor: {
        type: 'color',
        displayName: 'Text color',
        validation: {
          schema: { type: 'string' },
          defaultValue: false,
        },
      },
      visibility: {
        type: 'toggle',
        displayName: 'Visibility',
        validation: {
          schema: { type: 'boolean' },
          defaultValue: false,
        },
      },
      disabledState: {
        type: 'toggle',
        displayName: 'Disable',
        validation: {
          schema: { type: 'boolean' },
          defaultValue: false,
        },
      },
      borderRadius: {
        type: 'number',
        displayName: 'Border radius',
        validation: {
          schema: { type: 'number' },
          defaultValue: false,
        },
      },
      borderColor: {
        type: 'color',
        displayName: 'Border color',
        validation: {
          schema: { type: 'string' },
          defaultValue: false,
        },
      },
    },
    exposedVariables: {
      buttonText: 'Button',
    },
    actions: [
      {
        handle: 'click',
        displayName: 'Click',
      },
      {
        handle: 'setText',
        displayName: 'Set Text',
        params: [{ handle: 'text', displayName: 'Text', defaultValue: 'New Text' }],
      },
      {
        handle: 'disable',
        displayName: 'Disable',
        params: [{ handle: 'disable', displayName: 'Value', defaultValue: `{{false}}`, type: 'toggle' }],
      },
      {
        handle: 'visibility',
        displayName: 'Visibility',
        params: [{ handle: 'visible', displayName: 'Value', defaultValue: `{{false}}`, type: 'toggle' }],
      },
    ],
    definition: {
      others: {
        showOnDesktop: { value: '{{true}}' },
        showOnMobile: { value: '{{false}}' },
      },
      properties: {
        icon: { value: 'Home' },
        alignIcon: { value: 'left' },
        text: { value: `Button` },
        alignText: { value: 'left' },
      },
      events: [],
      styles: {
        backgroundColor: { value: '#375FCF' },
        iconColor: { value: '#fff' },
        textColor: { value: '#fff' },
        visibility: { value: '{{true}}' },
        borderRadius: { value: '{{0}}' },
        borderColor: { value: '#375FCF' },
        disabledState: { value: '{{false}}' },
      },
    },
  },
  {
    name: 'Alert',
    displayName: 'Alert',
    description: 'Display alert messages',
    component: 'Alert',
    defaultSize: {
      width: 20,
      height: 30,
    },
    others: {
      showOnDesktop: { type: 'toggle', displayName: 'Show on desktop' },
      showOnMobile: { type: 'toggle', displayName: 'Show on mobile' },
    },
    properties: {
      title: {
        type: 'code',
        displayName: 'Title',
        validation: {
          schema: { type: 'string' },
        },
      },
      text: {
        type: 'code',
        displayName: 'Text',
        validation: {
          schema: { type: 'string' },
        },
      },
      severity: {
        type: 'select',
        displayName: 'Severity',
        options: [
          { name: 'Error', value: 'error' },
          { name: 'Info', value: 'info' },
          { name: 'Success', value: 'success' },
          { name: 'Warning', value: 'warning' },
        ],
        validation: {
          schema: { type: 'string' },
        },
      },
      ...(config.UI_LIB === 'mui'
        ? {
            variant: {
              type: 'select',
              displayName: 'Variant',
              options: [
                { name: 'Standard', value: 'standard' },
                { name: 'Filled', value: 'filled' },
                { name: 'Outlined', value: 'outlined' },
              ],
              validation: {
                schema: { type: 'string' },
              },
            },
          }
        : {}),
      visibility: {
        type: 'toggle',
        displayName: 'Visibility',
        validation: {
          schema: { type: 'boolean' },
          defaultValue: false,
        },
      },
    },
    events: {
      onClick: { displayName: 'On click' },
      onHover: { displayName: 'On hover' },
    },
    styles: {},
    exposedVariables: {
      buttonText: 'Button',
    },
    actions: [
      {
        handle: 'click',
        displayName: 'Click',
      },
      {
        handle: 'setText',
        displayName: 'Set Text',
        params: [{ handle: 'text', displayName: 'Text', defaultValue: 'New Text' }],
      },
      {
        handle: 'disable',
        displayName: 'Disable',
        params: [{ handle: 'disable', displayName: 'Value', defaultValue: `{{false}}`, type: 'toggle' }],
      },
      {
        handle: 'visibility',
        displayName: 'Visibility',
        params: [{ handle: 'visible', displayName: 'Value', defaultValue: `{{false}}`, type: 'toggle' }],
      },
    ],
    definition: {
      others: {
        showOnDesktop: { value: '{{true}}' },
        showOnMobile: { value: '{{false}}' },
      },
      properties: {
        text: { value: `Este es un mensaje informativo - revísalo` },
        severity: { value: 'info' },
        ...(config.UI_LIB === 'mui' ? { variant: { value: 'standard' } } : {}),
      },
      events: [],
      styles: {
        visibility: { value: '{{true}}' },
      },
    },
  },
  {
    name: 'Button',
    displayName: 'Button',
    description: 'Trigger actions: queries, alerts etc',
    component: 'Button',
    defaultSize: {
      width: 3,
      height: 30,
    },
    others: {
      showOnDesktop: { type: 'toggle', displayName: 'Show on desktop' },
      showOnMobile: { type: 'toggle', displayName: 'Show on mobile' },
    },
    properties: {
      text: {
        type: 'code',
        displayName: 'Button Text',
        validation: {
          schema: { type: 'string' },
        },
      },
      loadingState: {
        type: 'toggle',
        displayName: 'Loading State',
        validation: {
          schema: { type: 'boolean' },
        },
      },
      type: {
        type: 'select',
        displayName: 'Type',
        options: [
          { name: 'Default', value: 'default' },
          { name: 'Primary', value: 'primary' },
          { name: 'Dashed', value: 'dashed' },
          { name: 'Link', value: 'link' },
          { name: 'Text', value: 'text' },
        ],
        validation: {
          schema: { type: 'string' },
        },
      },
    },
    events: {
      onClick: { displayName: 'On click' },
      onHover: { displayName: 'On hover' },
    },
    styles: {
      backgroundColor: {
        type: 'color',
        displayName: 'Background color',
        validation: {
          schema: { type: 'string' },
          defaultValue: false,
        },
      },
      textColor: {
        type: 'color',
        displayName: 'Text color',
        validation: {
          schema: { type: 'string' },
          defaultValue: false,
        },
      },
      visibility: {
        type: 'toggle',
        displayName: 'Visibility',
        validation: {
          schema: { type: 'boolean' },
          defaultValue: false,
        },
      },
      disabledState: {
        type: 'toggle',
        displayName: 'Disable',
        validation: {
          schema: { type: 'boolean' },
          defaultValue: false,
        },
      },
      borderRadius: {
        type: 'number',
        displayName: 'Border radius',
        validation: {
          schema: { type: 'number' },
          defaultValue: false,
        },
      },
      borderColor: {
        type: 'color',
        displayName: 'Border color',
        validation: {
          schema: { type: 'string' },
          defaultValue: false,
        },
      },
    },
    exposedVariables: {
      buttonText: 'Button',
    },
    actions: [
      {
        handle: 'click',
        displayName: 'Click',
      },
      {
        handle: 'setText',
        displayName: 'Set Text',
        params: [{ handle: 'text', displayName: 'Text', defaultValue: 'New Text' }],
      },
      {
        handle: 'disable',
        displayName: 'Disable',
        params: [{ handle: 'disable', displayName: 'Value', defaultValue: `{{false}}`, type: 'toggle' }],
      },
      {
        handle: 'visibility',
        displayName: 'Visibility',
        params: [{ handle: 'visible', displayName: 'Value', defaultValue: `{{false}}`, type: 'toggle' }],
      },
      {
        handle: 'loading',
        displayName: 'Loading',
        params: [{ handle: 'loading', displayName: 'Value', defaultValue: `{{false}}`, type: 'toggle' }],
      },
    ],
    definition: {
      others: {
        showOnDesktop: { value: '{{true}}' },
        showOnMobile: { value: '{{false}}' },
      },
      properties: {
        text: { value: `Button` },
        loadingState: { value: `{{false}}` },
        type: { value: 'default' },
      },
      events: [],
      styles: {
        visibility: { value: '{{true}}' },
        borderRadius: { value: '{{0}}' },
        disabledState: { value: '{{false}}' },
      },
    },
  },
  {
    name: 'Container',
    displayName: 'Container',
    description: 'Wrapper for multiple components',
    defaultSize: {
      width: 5,
      height: 200,
    },
    component: 'Container',
    others: {
      showOnDesktop: { type: 'toggle', displayName: 'Show on desktop' },
      showOnMobile: { type: 'toggle', displayName: 'Show on mobile' },
    },
    properties: {
      showAsCard: {
        type: 'toggle',
        displayName: 'show as card',
        validation: {
          schema: { type: 'boolean' },
        },
      },
      title: {
        type: 'code',
        displayName: 'card title',
        conditionallyRender: {
          key: 'showAsCard',
          value: false,
        },
        validation: {
          schema: { type: 'string' },
        },
      },
      loadingState: {
        type: 'toggle',
        displayName: 'loading state',
        validation: {
          schema: { type: 'boolean' },
        },
      },
    },
    events: {},
    styles: {
      backgroundColor: {
        type: 'color',
        displayName: 'Background color',
        validation: {
          schema: { type: 'string' },
        },
      },
      borderRadius: {
        type: 'code',
        displayName: 'Border Radius',
        validation: {
          schema: {
            type: 'union',
            schemas: [{ type: 'string' }, { type: 'number' }],
          },
        },
      },
      borderColor: {
        type: 'color',
        displayName: 'Border color',
        validation: {
          schema: { type: 'string' },
        },
      },
      visibility: {
        type: 'toggle',
        displayName: 'Visibility',
        validation: {
          schema: { type: 'boolean' },
        },
      },
      disabledState: {
        type: 'toggle',
        displayName: 'Disable',
        validation: {
          schema: { type: 'boolean' },
        },
      },
    },
    exposedVariables: {},
    definition: {
      others: {
        showOnDesktop: { value: '{{true}}' },
        showOnMobile: { value: '{{false}}' },
      },
      properties: {
        visible: { value: '{{true}}' },
        showAsCard: { value: `{{false}}` },
        loadingState: { value: `{{false}}` },
      },
      events: [],
      styles: {
        backgroundColor: { value: '#fff' },
        borderRadius: { value: '0' },
        borderColor: { value: '#fff' },
        visibility: { value: '{{true}}' },
        disabledState: { value: '{{false}}' },
      },
    },
  },
];
