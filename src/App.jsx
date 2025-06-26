// newsapp//

// import { List, RefreshCcw } from "lucide-react";

// import'./app.css';

// import React, { useState } from 'react';
// import Navbar from './components/Navbar';
// import  News  from './components/news';
// import{BrowserRouter as Router,Routes,Route,}from "react-router-dom";
// import LoadingBar from "react-top-loading-bar";

// const App =()=>{
//   const pageSize = 6;

//   const [progress, setProgress] = useState(0)

//     return(
//       <div>
//         <Router>
//         <Navbar/>
//         <LoadingBar
//         height={3}
//         color="#f11946"
//         progress={progress}
//       />
//         <Routes>
//           <Route exact path="/home" element = {<News setProgress={setProgress}  key="general"  pageSize={pageSize}country="us"category="general"/>}> </Route>
//           <Route exact path="/business" element = {<News setProgress={setProgress}  key="business" pageSize={pageSize}country="us"category="business"/>}> </Route>
//           <Route exact path="/entertainment" element = { <News setProgress={setProgress}  key="entertainment" pageSize={pageSize}country="us"category="entertainment"/>}></Route>
//           <Route exact path="/general" element = {<News setProgress={setProgress}  key="general" pageSize={pageSize}country="us"category="general"/>}> </Route>
//           <Route exact path="/health" element = { <News setProgress={setProgress}  key="health" pageSize={pageSize}country="us"category="health"/>}></Route>
//           <Route exact path="/science" element = {<News setProgress={setProgress}  key="science" pageSize={pageSize}country="us"category="science"/>}> </Route>
//           <Route exact path="/sports" element = {<News setProgress={setProgress}  key="Sports" pageSize={pageSize}country="us"category="Sports"/>}> </Route>
//           <Route exact path="/technology" element = {<News setProgress={setProgress}  key="technology" pageSize={pageSize}country="us"category="technology"/>}> </Route>
//         </Routes>
//         </Router>

//       </div>
//     );
// }

// export default App;

//FASHION ADDA app//

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar1 from "./components/Navbar1";
// import RedClub from "./components/RedClub";
// import TodoList from "./components/TodoList";
// import ProductDetail from "./components/ProductDetail";
// import Cart from "./components/New Cart";

// const App = () => {
//   return (
//     <Router>
//       <Navbar1 />
//       <Routes>
//         <Route path="/t-shirt" element={<RedClub category="t-shirt" />} />
//         <Route path="/shirt" element={<RedClub category="shirt" />} />
//         <Route path="/forml" element={<RedClub category="forml" />} />
//         <Route path="/hudi" element={<RedClub category="hudi" />} />
//         <Route path="/Home" element={<TodoList />} />
//         <Route path="/product/:id/:index" element={<ProductDetail />} />
//         <Route path="/cart" element={<Cart />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

// import './app.css';
// import Navbar2 from './components/Navbar2';
// import Clock from './components/Clock';
// import { useState } from 'react';

// const App = () => {
//   const [country, setCountry] = useState("India");

//   return (
//     <div>
//       <Navbar2 setCountry={setCountry} />
//       <Clock country={country} />
//     </div>
//   );
// };

// export default App;

// import { RefreshCcw } from 'lucide-react';
// import './app.css';
// import Insta from './components/insta';

// function App() {
//   return (
//     <div>
//      <Insta  />
//     </div>
//   )
// }

// export default App;

// import React from 'react'
// import SendEmailForm from './components/SendEmailForm'

// function App() {
//   return (
//     <div>
//         <SendEmailForm/>

//     </div>
//   )
// }

// export default App

// import React from 'react'
// import TodoApp from './components/TodoList'
// import LikeDislike from './components/LikeDislike'

// function App() {
//   return (
//     <div>

//       <LikeDislike/>
//       <TodoApp/>
//     </div>
//   )
// }

// export default App

// import React, { useState } from 'react';
// import Login from './components/login';
// import Register from './components/Register';

// function App() {
//   const [page, setPage] = useState('register');

//   const [Data, setData] = useState({
//   firstName: '',
//   lastName: '',
//   address: '',
//   mobile: '',
//   username: '',
//   email: '',
//   password: ''
// });

//   return (
//     <div>
//       {page === 'register' ? (
//         <Register

//           Data={Data}
//           setData={setData}
//           goToLogin={() => setPage('login')}
//         />
//       ) : (
//         <Login
//           Data={Data}
//           setData={setData}
//           goToRegister={() => setPage('register')}
//         />
//       )}
//     </div>
//   );
// }

// export default App;

// import React from "react";
// // import Quiz from './components/Quiz'
// // import My from'./components/My'

// import UseRef from "./components/useref";
// import UseContex from "./components/usecontex";
// import { ColorProvider } from "./components/usecontex";

// function App() {
//   return (
//     <div>
//       {/* <Quiz/> */}
//       {/* <My/> */}
//       <UseRef />

//       <ColorProvider>
//         <UseContex />
//       </ColorProvider>
//     </div>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

import MovieNav from "./components/MovieNav";
import Movie from "./components/movie";
import Home from "./components/Home";
import MovieDetail from "./components/MovieDetail";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <MovieNav />
          <main className="pt-20 pb-10">
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/bollywood" element={<Movie category="Bollywood" />} />
              <Route path="/hollywood" element={<Movie category="Hollywood" />} />
              <Route path="/gujarati" element={<Movie category="Gujarati" />} />
              <Route path="/web-series" element={<Movie category="Web-Series" />} />
              <Route path="/movie/:category/:id" element={<MovieDetail />} />
            </Routes>
          </main>
          <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto text-center">
            <p>© 2025 MovieHub. All rights reserved.</p>
          </div>
        </footer>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
