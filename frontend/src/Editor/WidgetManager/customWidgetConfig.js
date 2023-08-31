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
      iconPosition: {
        type: 'select',
        displayName: 'Icon Position',
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
      textPosition: {
        type: 'select',
        displayName: 'Text Position',
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
        iconPosition: { value: 'left' },
        textPosition: { value: 'left' },
        text: { value: `Button` },
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
];
