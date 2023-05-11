import * as React from 'react';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@material-ui/core/Grid';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CreateAuthor } from '../firebaseFunctions/auth';
import { useNavigate } from 'react-router-dom';
const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = React.useState('');
  const [nameHasError, setNameHasError] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [emailHasError, setEmailHasError] = React.useState(false);
  const [emailHasErrorActual, setEmailHasErrorActual] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [passwordHasError, setPasswordHasError] = React.useState(false);
  const [passwordHasErrorNotStrong, setPasswordHasErrorNotStrong] =
    React.useState(false);
  const [passwordVerify, setPasswordVerify] = React.useState('');
  const [passwordVerifyHasError, setPasswordVerifyHasError] =
    React.useState(false);
  const [bio, setBio] = React.useState('');
  const [bioHasError, setBioHasError] = React.useState(false);
  const [birth, setBirth] = React.useState('');
  const [birthHasError, setBirthHasError] = React.useState('');
  const [isLoginForm, setIsLoginForm] = React.useState(true);
  const handleToggleForm = () => {
    setIsLoginForm(!isLoginForm);
  };
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  const handleSubmit = (event) => {
    let bool = true;
    if (name === 0) {
      setNameHasError(true);
      bool = false;
    } else {
      setNameHasError(false);
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email) === false) {
      setEmailHasErrorActual(true);
      bool = false;
    } else if (email.length === 0) {
      setEmailHasError(true);
      setEmailHasErrorActual(false);
      bool = false;
    } else {
      setEmailHasErrorActual(false);
      setEmailHasError(false);
    }
    if (birth === null || birth.length === 0) {
      bool = false;
      setBirthHasError(true);
    } else if (!birth.isAfter(dayjs().subtract(120, 'year'))) {
      setBirthHasError(true);
      bool = false;
    } else if (!dayjs(birth).isValid()) {
      setBirthHasError(true);
      bool = false;
    }
    console.log(bool);
    if (password.length < 8) {
      setPasswordHasError(false);
      setPasswordHasErrorNotStrong(true);
      bool = false;
    } else if (password !== passwordVerify) {
      setPasswordHasError(true);
      setPasswordHasErrorNotStrong(false);
      bool = false;
    } else {
      setPasswordHasError(false);
      setPasswordHasErrorNotStrong(false);
      setPasswordVerifyHasError(false);
    }
    if (bio.length === 0) {
      setBioHasError(true);
      bool = false;
    } else {
      setBioHasError(false);
    }
    if (bool) {
      console.log('going to create Author');
      CreateAuthor(email.toLowerCase(), password, name, birth.toDate(), bio);
      navigate(`/`);
    }
  };
  return (
    <div
      sx={{
        flexGrow: 1,
        p: 3,
        mt: 10,
        margin: '20px',
        padding: '20px',
      }}
    >
      <div style={{ padding: 18 }}>
        <Grid container spacing={0}>
          {/* Welcome message and register button */}
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              bgcolor: 'primary.main',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              marginTop: 2,
              marginRight: 3,
            }}
          >
            <div>
              <Typography variant="h3" gutterBottom>
                Register as an Author!
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Register to upload your books!
              </Typography>
            </div>
          </Grid>
          {/* Registration form */}
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              mt: 10,
              pr: 8,
              p: 20,
            }}
          >
            <div>
              <form noValidate autoComplete="off">
                <Typography variant="h5" gutterBottom>
                  Register
                </Typography>

                <div style={{ marginTop: '10px' }}></div>
                <TextField
                  label="Name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (event.target.value.length === 0) {
                      setNameHasError(true);
                    } else {
                      setNameHasError(false);
                    }
                  }}
                  error={nameHasError}
                  helperText={nameHasError ? 'This field can not be empty' : ''}
                  size="small"
                  fullWidth
                />
                <div style={{ marginTop: '10px' }}></div>
                <TextField
                  label="Email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    setEmailHasErrorActual(
                      !emailRegex.test(event.target.value)
                    );
                    if (event.target.value.length === 0) {
                      setEmailHasError(true);
                    } else {
                      setEmailHasError(false);
                    }
                  }}
                  helperText={
                    emailHasErrorActual
                      ? 'this should be a real email'
                      : '' || emailHasError
                      ? 'This field can not be empty'
                      : ''
                  }
                  error={emailHasErrorActual || emailHasError}
                  size="small"
                  fullWidth
                />
                <div style={{ marginTop: '10px' }}></div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date of Birth"
                    value={birth}
                    onChange={(value) => setBirth(value)}
                    slotProps={{
                      textField: { size: 'small', fullWidth: true },
                    }}
                    fullWidth
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={
                          (birth &&
                            birth.isAfter(dayjs().subtract(120, 'year'))) ||
                          birthHasError
                        }
                        helperText={
                          (birth && birth.isAfter(dayjs().subtract(120, 'year'))
                            ? 'Must be at least 18 years ago'
                            : '') ||
                          (birthHasError ? 'This field can not be empty' : '')
                        }
                      />
                    )}
                    minDate={dayjs().subtract(120, 'year')}
                    maxDate={dayjs().subtract(18, 'year')}
                  />
                </LocalizationProvider>

                <div style={{ marginTop: '10px' }}></div>
                <TextField
                  label="Password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (event.target.value.length < 8) {
                      setPasswordHasError(false);
                      setPasswordHasErrorNotStrong(true);
                    } else if (event.target.value !== passwordVerify) {
                      setPasswordHasError(true);
                      setPasswordHasErrorNotStrong(false);
                    } else {
                      setPasswordHasError(false);
                      setPasswordHasErrorNotStrong(false);
                      setPasswordVerifyHasError(false);
                    }
                  }}
                  error={passwordHasError || passwordHasErrorNotStrong}
                  helperText={
                    passwordHasErrorNotStrong
                      ? 'Password must be at least 8 characters'
                      : '' || passwordHasError
                      ? 'Passwords do not match'
                      : ''
                  }
                  size="small"
                  fullWidth
                  type="password"
                />
                <div style={{ marginTop: '10px' }}></div>
                <TextField
                  label="Confirm Password"
                  value={passwordVerify}
                  onChange={(event) => {
                    setPasswordVerify(event.target.value);
                    if (event.target.value !== password) {
                      setPasswordVerifyHasError(true);
                    } else {
                      setPasswordVerifyHasError(false);
                      setPasswordHasError(false);
                    }
                  }}
                  error={passwordVerifyHasError}
                  helperText={
                    passwordVerifyHasError ? 'Passwords do not match' : ''
                  }
                  fullWidth
                  size="small"
                  type="password"
                />
                <div style={{ marginTop: '10px' }}></div>
                <TextField
                  label="Bio"
                  value={bio}
                  onChange={(event) => {
                    setBio(event.target.value);
                    if (event.target.value.length === 0) {
                      setBioHasError(true);
                    } else {
                      setBioHasError(false);
                    }
                  }}
                  error={bioHasError}
                  helperText={bioHasError ? 'This field can not be empty' : ''}
                  size="small"
                  fullWidth
                  multiline
                  rows={3}
                  maxRows={10}
                  placeholder="Tell us about yourself..."
                />
                <div style={{ marginTop: '10px' }}></div>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth={!isSmallScreen}
                    onClick={handleSubmit}
                  >
                    Register
                  </Button>
                </Box>
                <Typography sx={{ mt: 2 }} variant="subtitle1">
                  Already have an account?{' '}
                  <Typography
                    component="span"
                    variant="subtitle1"
                    color="primary"
                    onClick={handleToggleForm}
                    sx={{
                      '&:hover': {
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Login here.
                  </Typography>
                </Typography>
              </form>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Register;
