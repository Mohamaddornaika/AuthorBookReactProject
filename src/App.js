import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './basic_components/Navbar';
import Footer from './basic_components/Footer';
import Register from './basic_components/Register';
import AuthorCards from './basic_components/AuthorCards';
import MyProfile from './basic_components/MyProfile';
import AddBook from './basic_components/AddBook';
import BooksCards from './basic_components/BooksCards';
import EditBook from './basic_components/EditBook';
import Author from './basic_components/Author';
import AdminPortal from './basic_components/Admin/AdminPortal';
function App() {
  return (
    <Router>
      <div sx={{ flexGrow: 1, p: 3 }}>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />}></Route>
          <Route
            exact
            path="/"
            element={
              <>
                <AuthorCards />
                <BooksCards />
              </>
            }
          ></Route>
          <Route exact path="/Authors" element={<AuthorCards />}></Route>
          <Route path="/MyProfile" element={<MyProfile />}></Route>
          <Route path="/AddBook" element={<AddBook />}></Route>
          <Route path="/Books" element={<BooksCards />}></Route>
          <Route
            path="/EditBook/:statusParam/:id"
            element={<EditBook />}
          ></Route>
          <Route exact path="/Author/:id" element={<Author />}></Route>
          <Route
            exact
            path="/AdminZzinj5FaR5XFikn1vXdA0gOaLl03Portal"
            element={<AdminPortal />}
          ></Route>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
