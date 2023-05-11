import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Avatar, Box, Grid } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import defaultBook from '../defaultBook.jpg';
import { getCurrentUser } from '../firebaseFunctions/auth';
import { getAuthorByEmail, addBook } from '../firebaseFunctions/fireStore';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
const AddBooks = () => {
  const navigate = useNavigate();
  const [authorId, setAuthorId] = useState('');
  const [title, setTitle] = useState('');
  const [titleHasError, setTitleHasError] = useState(false);
  const [brief, setBrief] = useState('');
  const [briefHasError, setBriefHasError] = useState(false);
  const [coverImageSrc, setCoverImageSrc] = useState(defaultBook);
  const [coverImage, setCoverImage] = useState(null);
  const [authorName, setAuthorName] = useState(false);

  const [status, setStatus] = useState('draft');
  const [publishDate, setPublishDate] = useState('');
  const [publishDateHasError, setPublishDateHasError] = useState(false);
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

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
      addBook(
        title,
        brief,
        coverImage,
        status,
        publishDate.toDate(),
        authorId,
        authorName
      );
    }
  };
  useEffect(() => {
    getCurrentUser()
      .then((currentUserData) => {
        setAuthorId(currentUserData.uid);
        getAuthorByEmail(currentUserData.email).then(async (result) => {
          console.log(result);
          setAuthorName(result.name);
        });
      })
      .catch((error) => {
        navigate(`/`);
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
                onChange={handlePublishDateChange}
                sx={{ margin: 1 }}
                slotProps={{
                  textField: { fullWidth: true },
                }}
                fullWidth
                renderInput={(params) => (
                  <TextField
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
              color="primary"
              type="submit"
              sx={{ margin: 1 }}
            >
              Submit
            </Button>
          </form>
        </Grid>
      </Grid>

      {/* <Avatar
        sx={{
          width: { xs: 150, sm: 200 },
          height: { xs: 150, sm: 200 },
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.8,
          },
        }}
        onClick={() => {
          // add code to upload picture here
        }}
      /> */}
      <div style={{ marginBottom: '10px' }}></div>
    </div>
  );
};

export default AddBooks;
