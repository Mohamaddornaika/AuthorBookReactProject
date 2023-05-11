import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Avatar, Box, Grid } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import defaultBook from '../defaultBook.jpg';
import { getCurrentUser } from '../firebaseFunctions/auth';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  getAuthorByEmail,
  setBook,
  getDocumentById,
} from '../firebaseFunctions/fireStore';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
const AddBooks = () => {
  const { id, statusParam } = useParams();

  const [authorId, setAuthorId] = useState('');
  const [userId, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [titleHasError, setTitleHasError] = useState(false);
  const [brief, setBrief] = useState('');
  const [briefHasError, setBriefHasError] = useState(false);
  const [coverImageSrc, setCoverImageSrc] = useState(defaultBook);
  const [coverImage, setCoverImage] = useState(null);
  const [authorName, setAuthorName] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [status, setStatus] = useState(statusParam);
  const [publishDate, setPublishDate] = useState('');
  const [publishDateHasError, setPublishDateHasError] = useState(false);
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };
  const navigate = useNavigate();
  const handleBriefChange = (event) => {
    setBrief(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handlePublishDateChange = (value) => {
    setPublishDate(value);
  };
  const handleAvatarChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        // const blobUrl = URL.createObjectURL(blob);
        setCoverImage(event.target.files[0]);
        setCoverImageSrc(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    let con = true;
    if (title === '') {
      con = false;
      setTitleHasError(true);
    }
    if (brief === '') {
      con = false;
      setBriefHasError(true);
    }
    if (publishDate === '') {
      con = false;
      setPublishDateHasError(true);
    }
    if (con) {
      setBook(
        title,
        brief,
        coverImage,
        status,
        publishDate.toDate(),
        authorId,
        authorName,
        id,
        coverImageSrc
      );

      navigate('/');
    }
  };
  useEffect(() => {
    getDocumentById(id, statusParam).then((bookData) => {
      console.log(bookData);
      setTitle(bookData.title);
      setBrief(bookData.brief);
      if (bookData.coverImage) {
        setCoverImageSrc(bookData.coverImage);
      }
      if (statusParam !== 'published') {
        setStatus(bookData.status);
      } else {
        setStatus(bookData.status);
        setIsLocked(true);
      }
      setPublishDate(dayjs(bookData.publishDate.toDate()));
      getCurrentUser()
        .then((currentUserData) => {
          setUserId(currentUserData.uid);
        })
        .catch((error) => {
          setUserId('');
        });
    });
  }, []);
  return (
    <div sx={{ flexGrow: 1, padding: 2 }}>
      <Grid
        container
        spacing={3}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        }}
      >
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
          }}
        >
          <form
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <label htmlFor="avatar-input">
                <Avatar
                  sx={{
                    width: { xs: 150, sm: 200 },
                    height: { xs: 150, sm: 200 },
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8,
                    },
                  }}
                  // helperText={'passwordHelperText'}
                  //error={}
                  src={coverImageSrc}
                />
              </label>
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
            </Box>
            <TextField
              label="Title"
              variant="outlined"
              sx={{ margin: 1, width: '100%' }}
              value={title}
              onChange={handleTitleChange}
              error={titleHasError}
              helperText={titleHasError ? 'This field can not be empty' : ''}
            />
            <TextField
              label="Brief"
              variant="outlined"
              sx={{ margin: 1, width: '100%' }}
              value={brief}
              onChange={handleBriefChange}
              multiline
              minRows={4}
              error={briefHasError}
              helperText={briefHasError ? 'This field can not be empty' : ''}
            />
            <FormControl sx={{ margin: 1, width: '100%' }}>
              <InputLabel id="statusLabel">Status</InputLabel>
              <Select
                labelId="statusLabel"
                id="status"
                label="status"
                value={status}
                onChange={handleStatusChange}
                disabled={isLocked}
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="published">Published</MenuItem>
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Publish date"
                variant="outlined"
                value={publishDate}
                disabled={isLocked}
                onChange={handlePublishDateChange}
                sx={{ margin: 1 }}
                slotProps={{
                  textField: { fullWidth: true },
                }}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    disabled={isLocked}
                    {...params}
                    error={publishDateHasError}
                    helperText={
                      publishDateHasError ? 'This field can not be empty' : ''
                    }
                  />
                )}
              />
            </LocalizationProvider>
            <Button
              variant="contained"
              component={Link}
              to={
                userId === 'Zzinj5FaR5XFikn1vXdA0gOaLl03'
                  ? '/AdminZzinj5FaR5XFikn1vXdA0gOaLl03Portal'
                  : '/MyProfile'
              }
              sx={{ margin: 1 }}
            >
              cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ margin: 1 }}
            >
              Submit
            </Button>
          </form>
        </Grid>
      </Grid>
      <div style={{ marginBottom: '10px' }}></div>
    </div>
  );
};

export default AddBooks;
