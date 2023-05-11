import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Link } from 'react-router-dom';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import LoginDialog from './LoginDialog';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseFunctions/Initialize';
import { user } from '../firebaseFunctions/auth';
const drawerWidth = 240;

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isLoggedInState, setIsLoggedInState] = React.useState(user != null);
  const [userId, setUserId] = React.useState('');
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedInState(user != null);
      if (user != null) setUserId(user.uid);
    });
    return unsubscribe;
  }, []);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      width: drawerWidth,
      backgroundColor: '#333333',
      color: 'white',
    },
  }));

  const StyledList = styled(List)(({ theme }) => ({
    '& .MuiListItem-root': {
      paddingTop: '10px',
      paddingBottom: '10px',
      paddingLeft: '20px',
      paddingRight: '20px',
      '&:hover': {
        backgroundColor: '#444444',
      },
    },
  }));
  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <IconButton
            size="medium"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              color: 'white',
              '&:hover': {
                color: 'black',
              },
              '&:active': {
                color: 'darkslategray',
              },
            }}
            component={Link}
            to="/"
          >
            Books
          </Typography>
          <LoginDialog isLoggedInState={isLoggedInState} />
        </Toolbar>
      </AppBar>
      <StyledDrawer
        anchor="left"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
      >
        <StyledList>
          {isLoggedInState ? (
            userId === 'Zzinj5FaR5XFikn1vXdA0gOaLl03' ? (
              <>
                <ListItem
                  component={Link}
                  to="/AdminZzinj5FaR5XFikn1vXdA0gOaLl03Portal"
                >
                  <ListItemText
                    sx={{
                      color: 'white',
                      '&:hover': {
                        color: 'blue',
                      },
                    }}
                    primary="Admin Portal"
                  />
                </ListItem>
                <ListItem component={Link} to="/AddBook">
                  <ListItemText
                    sx={{
                      color: 'white',
                      '&:hover': {
                        color: 'blue',
                      },
                    }}
                    primary="Add book"
                  />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem component={Link} to="/MyProfile">
                  <ListItemText
                    sx={{
                      color: 'white',
                      '&:hover': {
                        color: 'blue',
                      },
                    }}
                    primary="My Profile"
                  />
                </ListItem>
                <ListItem component={Link} to="/AddBook">
                  <ListItemText
                    sx={{
                      color: 'white',
                      '&:hover': {
                        color: 'blue',
                      },
                    }}
                    primary="Add book"
                  />
                </ListItem>
              </>
            )
          ) : (
            <></>
          )}

          <ListItem component={Link} to="/Authors">
            <ListItemText
              sx={{
                color: 'white',
                '&:hover': {
                  color: 'blue',
                },
              }}
              primary="Authors"
            />
          </ListItem>
          <ListItem component={Link} to="/Books">
            <ListItemText
              sx={{
                color: 'white',
                '&:hover': {
                  color: 'blue',
                },
              }}
              primary="Books"
            />
          </ListItem>
        </StyledList>
      </StyledDrawer>
    </>
  );
};

export default Navbar;
