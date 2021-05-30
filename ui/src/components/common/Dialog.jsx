import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { Button } from 'semantic-ui-react';

export default props => {
  const [open, setOpen] = useState(false);

  const handleInitButton = e => {
    e.preventDefault();
    const hasErrors = props.checkForErrors();
    if (!hasErrors) {
        setOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleSubmitButton = (e) => {
    e.preventDefault();
    handleCloseDialog();
    props.onSubmitHandler(e);
  };

  return (
    <div>
        <Button variant="outlined" color="blue" id="ad-form-button" onClick={handleInitButton}>
            {props.buttonAgree}
        </Button>
        <Dialog
            open={open}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.dialogContent}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} color="red">
                    {props.buttonDisagree}
                </Button>
                <Button onClick={handleSubmitButton} color="green" autoFocus>
                    {props.buttonAgree}
                </Button>
            </DialogActions>
        </Dialog>
    </div>
  );
};
