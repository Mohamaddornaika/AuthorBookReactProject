import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#f4f4f4', py: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="textSecondary" align="center">
          © {new Date().getFullYear()} My App. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
