import { Button } from '@mui/material';
import React from 'react';
import Swal from 'sweetalert2';
export const ConfirmDialog = (props) => {
  //   const { title, description, icon, buttons } = props;
  const { height, properties, styles, fireEvent, registerAction, id, dataCy, setExposedVariable } = props;
  const {
    backgroundColor,
    textColor,
    borderRadius,
    disabledState,
    visibility,
    confirmColor,
    denyColor,
    cancelColor,
    boxShadow,
  } = styles;
  const { label, icon, title, description, denyButton, cancelButton, confirmText, denyText, cancelText } = properties;

  const showAlert = () => {
    Swal.fire({
      title,
      text: description,
      icon,
      showDenyButton: denyButton,
      showCancelButton: cancelButton,
      confirmButtonText: confirmText,
      denyButtonText: denyText,
      cancelButtonText: cancelText,
      confirmButtonColor: confirmColor,
      denyButtonColor: denyColor,
      cancelButtonColor: cancelColor,
      target: document.getElementsByClassName('canvas-area')[0],
    }).then((result) => {
      if (result.isConfirmed) {
        // Lógica de confirmación.
      } else if (result.isDenied) {
        // Lógica de cancelar
      }
    });
  };

  return (
    <>
      {visibility ? (
        <Button
          variant="contained"
          disabled={disabledState}
          onClick={showAlert}
          sx={{
            color: textColor,
            backgroundColor: backgroundColor,
            borderRadius: borderRadius,
            width: '100%',
            height,
            boxShadow,
          }}
        >
          {label}
        </Button>
      ) : null}
    </>
  );
};
