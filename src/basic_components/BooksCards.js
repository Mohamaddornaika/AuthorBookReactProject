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
import { searchForBook, getAllBooks } from '../firebaseFunctions/fireStore';
import defaultBook from '../defaultBook.jpg';
const BooksCards = () => {
  const [books, setbooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  useEffect(() => {
    getAllBooks().then((result) => {
      setbooks(result.slice(startIndex, endIndex));
      setTotalPages(Math.ceil(result.length / itemsPerPage));
    });
  }, [page]);
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const handleBookSearch = async (e) => {
    searchForBook(e.target.value).then((result) => {
      if (result) {
        setbooks(result.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(result.length / itemsPerPage));
      } else {
        getAllBooks().then((result) => {
          setbooks(result.slice(startIndex, endIndex));
          setTotalPages(Math.ceil(result.length / itemsPerPage));
        });
      }
    });
  };
  return (
    <div>
      {/* <div styles={{ margin: '20px' }}></div> */}
      {books ? (
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
              label="Search Books"
              // value={authorQuery}
              onChange={handleBookSearch}
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
            {books.map((book) => (
              <Grid
                justifyContent="center"
                alignItems="center"
                item
                key={book.id}
                xs={10}
                sm={6}
                md={4}
                lg={3}
              >
                <Card sx={{ maxWidth: 500 }} xs={2}>
                  <CardMedia
                    component="img"
                    image={book.coverImage ? book.coverImage : defaultBook}
                    alt={book.title}
                    sx={{ objectFit: 'cover', height: '250px' }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {book.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      component="div"
                    >
                      {book.brief}
                      <br /> {book.author}
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

export default BooksCards;
