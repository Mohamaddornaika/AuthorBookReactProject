import { forwardRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { LogOut, LogIn } from '../firebaseFunctions/auth';
import { useNavigate } from 'react-router-dom';
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const LoginDialog = ({ isLoggedInState }) => {
  const [email, setEmail] = useState('');
  const [emailHasError, setEmailHasError] = useState(false);
  const [emailHelperText, setEmailHelperText] = useState('');
  const [password, setPassword] = useState('');
  const [passwordHasError, setPasswordHasError] = useState(false);
  const [passwordHelperText, setPasswordHelperText] = useState('');
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleDialogOpen = () => setIsDialogOpen(true);
  const handleDialogClose = () => setIsDialogOpen(false);
  const handleLogout = () => {
    LogOut();
    console.log('logout');
    navigate('/');
  };
  const handleLogin = () => {
    setEmailHasError(false);
    setEmailHelperText('');
    setPasswordHasError(false);
    setPasswordHelperText('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setEmailHasError(!emailRegex);
    setEmailHelperText(emailRegex ? '' : 'Please enter a valid email address');
    let con = emailRegex;
    if (con) {
      LogIn(email, password)
        .then((result) => {
          // Do something with the result here

          if (result.con) {
            console.log('logged in!');
          } else {
            if (result.errorType === 'email') {
              setEmailHasError(true);
              setEmailHelperText('Wrong Email');
            } else if (result.errorType === 'password') {
              setPasswordHasError(true);
              setPasswordHelperText('Wrong Password');
            } else {
              setEmailHasError(true);
              setEmailHelperText(result.errorMessage);
              setPasswordHasError(true);
              setPasswordHelperText(result.errorMessage);
            }
          }
        })
        .catch((error) => {
          if (error.errorType === 'email') {
            setEmailHasError(true);
            setEmailHelperText('Wrong Email');
          } else if (error.errorType === 'password') {
            setPasswordHasError(true);
            setPasswordHelperText('Wrong Password');
          } else {
            setEmailHasError(true);
            setEmailHelperText(error.errorMessage);
            setPasswordHasError(true);
            setPasswordHelperText(error.errorMessage);
          }
        });
    }
    navigate('/');
  };
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  //   const StyledDialog = memo(
  //     styled(Dialog)(({ theme }) => ({
  //       '& .MuiDialog-paper': {
  //         width: isSmallScreen ? '100%' : '350px',
  //       },
  //     }))
  //   );
  const handleEmailChange = useCallback((event) => {
    setEmail(event.target.value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailHasError(!emailRegex.test(event.target.value));
    setEmailHelperText(
      emailRegex.test(event.target.value)
        ? ''
        : 'Please enter a valid email address'
    );
  }, []);

  const handlePasswordChange = useCallback((event) => {
    setPassword(event.target.value);
    setPasswordHasError(false);
    setPasswordHelperText('');
  }, []);
  return (
    <>
      {isLoggedInState ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: isSmallScreen ? 'flex-end' : 'center',
            alignItems: 'center',
          }}
        >
          {isSmallScreen ? (
            <Button color="inherit" onClick={handleLogout}>
              Log Out
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleLogout}>
              Log Out
            </Button>
          )}
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: isSmallScreen ? 'flex-end' : 'center',
              alignItems: 'center',
            }}
          >
            {isSmallScreen ? (
              <Button color="inherit" onClick={handleDialogOpen}>
                Login
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleDialogOpen}
              >
                Login
              </Button>
            )}
          </Box>
          <Dialog
            open={isDialogOpen}
            onClose={handleDialogClose}
            //  fullWidth
            maxWidth="sm"
            TransitionComponent={Transition}
          >
            <DialogContent
              sx={{ p: isSmallScreen ? '20px' : '40px', maxWidth: '500px' }}
            >
              <>
                <div style={{ marginTop: '20px' }}></div>
                <TextField
                  label="Email"
                  fullWidth
                  value={email}
                  onChange={handleEmailChange}
                  helperText={emailHelperText}
                  error={emailHasError}
                />
                <div style={{ marginTop: '10px' }}></div>
                <TextField
                  label="Password"
                  fullWidth
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  helperText={passwordHelperText}
                  error={passwordHasError}
                  //   onChange={(event) => setPassword(event.target.value)}
                  //   error={passwordHasError}
                  //   helperText={passwordHasError ? 'Wrong Password!' : ''}
                />
                <div style={{ marginTop: '10px' }}></div>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth={!isSmallScreen}
                    onClick={handleLogin}
                  >
                    Login
                  </Button>
                </Box>
                <Typography sx={{ mt: 2 }} variant="subtitle1">
                  Don't have an account yet?{' '}
                  <Typography
                    component={Link}
                    to="/register"
                    variant="subtitle1"
                    color="primary"
                    onClick={handleDialogClose}
                    sx={{
                      '&:hover': {
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Register here.
                  </Typography>
                </Typography>
              </>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
};

export default LoginDialog;
