import { Avatar, Box, Grid, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../firebaseFunctions/auth';
import { getDocumentById } from '../firebaseFunctions/fireStore';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import { useParams } from 'react-router-dom';
import MiniBooksCards from './MiniBooksCards';
const MyProfile = () => {
  const { id } = useParams();
  const [avatarSrc, setAvatarSrc] = useState('');
  const [name, setName] = useState('name');
  const [email, setEmail] = useState('email');
  const [bio, setBio] = useState('bio');
  const [birth, setBirth] = useState('Date');
  const [currentUserId, setCurrentUserId] = useState('');
  useEffect(() => {
    getDocumentById(id, 'users').then(async (result) => {
      console.log(result);
      setName(result.name);
      setEmail(result.email);
      setBio(result.bio);
      const timestamp = result.birth;

      setAvatarSrc(result.profileImageURL);
      // convert timestamp to a Date object
      const date = timestamp.toDate();

      // format the date using dayjs
      dayjs.locale('en'); // set the locale you want to use
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      setBirth(formattedDate);
    });
    getCurrentUser()
      .then((currentUserData) => {
        setCurrentUserId(currentUserData.uid);
      })
      .catch((error) => {
        setCurrentUserId('');
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
        </Box>
        <Typography variant="h4" sx={{ mt: 2 }}>
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
            <Typography variant="body1">{bio}</Typography>
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

        <div style={{ marginBottom: '10px' }}></div>
      </Grid>
      <MiniBooksCards id={id} currentUserId={currentUserId} />
    </>
  );
};

export default MyProfile;
