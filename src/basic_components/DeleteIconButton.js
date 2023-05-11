import React, { useState } from 'react';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from '@mui/material/colors';
import { deleteDocumentById } from '../firebaseFunctions/fireStore';
const DeleteButton = ({ bookId, status, setBooks, books }) => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    deleteDocumentById(bookId, status);
    setBooks(books.filter((book) => book.id !== bookId));
    setOpen(false);
  };

  return (
    <>
      <IconButton
        sx={{ '&:hover': { color: red[700] } }}
        onClick={handleClickOpen}
      >
        <DeleteIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose} sx={{ minWidth: '300px' }}>
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>
          <div>Are you sure you want to delete this item?</div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleDelete} sx={{ color: red[700] }}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteButton;
