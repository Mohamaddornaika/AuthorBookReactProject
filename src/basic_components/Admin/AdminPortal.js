import React, { useState, useEffect } from 'react';

import AdminAuthor from './AdminAuthor';
import AdminBooks from './AdminBook';
const AdminPortal = () => {
  return (
    <div>
      <AdminAuthor />
      <AdminBooks />
    </div>
  );
};

export default AdminPortal;
