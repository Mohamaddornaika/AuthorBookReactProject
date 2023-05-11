import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { searchForAuthor, getAllAuthors } from '../firebaseFunctions/fireStore';
import defaultProfile from '../defaultProfile.jpg';
import { useNavigate } from 'react-router-dom';
const AuthorCards = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;
  const startIndex = (page - 1) * itemsPerPage;

  const navigate = useNavigate();
  const endIndex = startIndex + itemsPerPage;
  useEffect(() => {
    getAllAuthors().then((result) => {
      console.log(result);
      setUsers(result.slice(startIndex, endIndex));
      setTotalPages(Math.ceil(result.length / itemsPerPage));
    });
  }, [page]);
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  //const [authorQuery, setAuthorQuery] = useState('');
  // const handleAuthorSearch = (event) => {
  //   setAuthorQuery(event.target.value);
  // };
  const handleClick = (id) => {
    navigate(`/Author/${id}`);
  };
  const handleAuthorSearch = async (e) => {
    searchForAuthor(e.target.value).then((result) => {
      if (result) {
        setUsers(result.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(result.length / itemsPerPage));
      } else {
        getAllAuthors().then((result) => {
          setUsers(result.slice(startIndex, endIndex));
          setTotalPages(Math.ceil(result.length / itemsPerPage));
        });
      }
    });
  };
  return (
    <div>
      {/* <div styles={{ margin: '20px' }}></div> */}
      {users ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
          }}
        >
          <div
            sx={{
              display: 'flex',

              alignItems: 'center',
              marginBottom: 2,
              mx: 'auto',
            }}
          >
            <TextField
              label="Search authors"
              // value={authorQuery}
              onChange={handleAuthorSearch}
              variant="outlined"
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary' }} />,
              }}
              sx={{ mx: 'auto' }}
            />
          </div>
          <div style={{ padding: 18 }}></div>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            {users.map((user) => (
              <Grid
                justifyContent="center"
                alignItems="center"
                item
                key={user.id}
                xs={10}
                sm={6}
                md={4}
                lg={3}
              >
                <Card
                  sx={{ maxWidth: 500 }}
                  xs={2}
                  onClick={() => handleClick(user.id)}
                >
                  <CardMedia
                    component="img"
                    image={user.profPic ? user.profPic : defaultProfile}
                    alt={user.name}
                    sx={{ objectFit: 'cover', height: '250px' }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {user.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      component="div"
                    >
                      Bio:{user.bio}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
            />
          </Box>
        </Box>
      ) : (
        <div>
          <Typography variant="h3" gutterBottom>
            No Data
          </Typography>
        </div>
      )}
    </div>
  );
};

export default AuthorCards;
