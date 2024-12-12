import React from 'react';

import { Box } from '@mui/material';
import Sidebar from '../components/dashbaord/Sidebar';

const Layout = ({ children, setIsAuthenticated }) => { // Add setIsAuthenticated as a prop
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: (theme) => theme.palette.background.default,
          p: 3,overflow:"hidden"
        }}
      >
        {/* Pass setIsAuthenticated as needed */}
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { setIsAuthenticated })
        )}
      </Box>
    </Box>
  );
};

export default Layout;

