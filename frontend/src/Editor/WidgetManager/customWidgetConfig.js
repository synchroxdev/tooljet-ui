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
    name: 'ConfirmDialog',
    displayName: 'ConfirmDialog',
    description: 'Trigger actions:  alerts ',
    component: 'ConfirmDialog',
    defaultSize: {
      width: 3,
      height: 30,
    },
    others: {
      showOnDesktop: { type: 'toggle', displayName: 'Show on desktop' },
      showOnMobile: { type: 'toggle', displayName: 'Show on mobile' },
    },
    properties: {
      label: {
        type: 'code',
        displayName: 'Label Button',
        validation: {
          schema: { type: 'string' },
        },
      },
      title: {
        type: 'code',
        displayName: 'Title Dialog',
        validation: {
          schema: { type: 'string' },
        },
      },
      description: {
        type: 'code',
        displayName: 'Description Dialog',
        validation: {
          schema: { type: 'string' },
        },
      },
      icon: {
        type: 'select',
        displayName: 'Icon Info',
        options: [
          { name: 'Success', value: 'success' },
          { name: 'Error', value: 'error' },
          { name: 'Information', value: 'info' },
          { name: 'Warning', value: 'warning' },
          { name: 'Question', value: 'question' },
        ],
        validation: {
          schema: { type: 'string' },
        },
      },
      confirmText: {
        type: 'code',
        displayName: 'Botton Confirm Text',
        validation: {
          schema: { type: 'string' },
        },
      },
      denyButton: {
        type: 'toggle',
        displayName: 'Show Deny Button',
        validation: {
          schema: { type: 'boolean' },
        },
      },
      denyText: {
        type: 'code',
        displayName: 'Botton Confirm Text',
        validation: {
          schema: { type: 'string' },
        },
      },
      cancelButton: {
        type: 'toggle',
        displayName: 'Show Cancel Button',
        validation: {
          schema: { type: 'boolean' },
        },
      },
      cancelText: {
        type: 'code',
        displayName: 'Botton Confirm Text',
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
        displayName: 'Background color Button',
        validation: {
          schema: { type: 'string' },
          defaultValue: false,
        },
      },
      textColor: {
        type: 'color',
        displayName: 'Text color Button',
        validation: {
          schema: { type: 'string' },
          defaultValue: false,
        },
      },
      confirmColor: {
        type: 'color',
        displayName: 'Text color Button Confirm',
        validation: {
          schema: { type: 'string' },
          defaultValue: false,
        },
      },
      denyColor: {
        type: 'color',
        displayName: 'Text color Button Deny',
        validation: {
          schema: { type: 'string' },
          defaultValue: false,
        },
      },
      cancelColor: {
        type: 'color',
        displayName: 'Text color Button Cancel',
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
        label: { value: 'Open' },
        title: { value: `Title display` },
        description: { value: 'Description display' },
        icon: { value: 'error' },
        denyButton: { value: true },
        cancelButton: { value: false },
        cancelText: { value: 'Cancelar' },
        denyText: { value: 'No Guardar' },
        confirmText: { value: 'Guardar' },
      },
      events: [],
      styles: {
        backgroundColor: { value: '#375FCF' },
        textColor: { value: '#fff' },
        visibility: { value: '{{true}}' },
        borderRadius: { value: '{{0}}' },
        borderColor: { value: '#375FCF' },
        disabledState: { value: '{{false}}' },
      },
    },
  },
];
