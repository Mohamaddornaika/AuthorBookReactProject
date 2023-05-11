import { Avatar, Box, Grid, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../firebaseFunctions/auth';
import { getAuthorByEmail, updateAuthor } from '../firebaseFunctions/fireStore';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import Button from '@mui/material/Button';
import { uploadProfilePicture } from '../firebaseFunctions/storage';
import MiniBooksCards from './MiniBooksCards';
const MyProfile = () => {
  const [changes, setChanges] = useState(false);

  const [srcForUpload, setSrcForUpload] = useState(null);
  const [avatarSrc, setAvatarSrc] = useState('');
  const [id, setId] = useState('');
  const [name, setName] = useState('name');
  const [email, setEmail] = useState('email');
  const [bio, setBio] = useState('bio');
  const [birth, setBirth] = useState('Date');
  const handleAvatarChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        // const blobUrl = URL.createObjectURL(blob);
        setSrcForUpload(event.target.files[0]);
        setAvatarSrc(reader.result);
        setChanges(true);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  const handleSave = () => {
    // Implement your save logic here
    if (srcForUpload) {
      uploadProfilePicture(srcForUpload, id);
    } else {
    }
    updateAuthor(id, { name: name, bio: bio });
    setChanges(false);
  };
  useEffect(() => {
    getCurrentUser().then((currentUserData) => {
      console.log(currentUserData);
      getAuthorByEmail(currentUserData.email).then(async (result) => {
        console.log(result);
        setName(result.name);
        setEmail(currentUserData.email);
        setBio(result.bio);
        setId(result.id);
        const timestamp = result.birth;

        setAvatarSrc(result.profileImageURL);
        // convert timestamp to a Date object
        const date = timestamp.toDate();

        // format the date using dayjs
        dayjs.locale('en'); // set the locale you want to use
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        setBirth(formattedDate);
      });
    });
  }, []);
  return (
    <>
      <Grid container direction="column" alignItems="center" sx={{ mt: 4 }}>
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
              src={avatarSrc}
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
        <Typography
          variant="h4"
          sx={{ mt: 2 }}
          contentEditable
          suppressContentEditableWarning
          onBlur={(event) => {
            setName(event.target.textContent);
            setChanges(true);
          }}
        >
          {name}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {email}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography variant="h6">Bio:</Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mt: 1,
            }}
          >
            <Typography
              variant="body1"
              contentEditable
              suppressContentEditableWarning
              onBlur={(event) => {
                setBio(event.target.textContent);
                setChanges(true);
              }}
            >
              {bio}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">{birth}</Typography>
        </Box>
        {changes ? (
          <Button variant="contained" sx={{ mt: 4 }} onClick={handleSave}>
            Save
          </Button>
        ) : (
          <div></div>
        )}
        <div style={{ marginBottom: '10px' }}></div>
      </Grid>
      <MiniBooksCards id={id} currentUserId={id} />
    </>
  );
};

export default MyProfile;
