import'./app.css';

import Navbar1 from './components/Navbar1';
import RedClub from './components/RedClub';

import{BrowserRouter as Router,Routes,Route,}from "react-router-dom";
import LoadingBar from "react-top-loading-bar";








const App =()=>{
//   const pageSize = 6;

  

//   const [progress, setProgress] = useState(0)
 

  // constructor() {
  //   super();
  //   this.state = {
  //     progress: 0,
  //   };
  // }

  

  
    return(
      <div>
        {/* <Router>
         {/* <Navbar/> */}
        {/* <LoadingBar
        height={3}
        color="#f11946"
        progress={progress}
      />
        <Routes>
          <Route exact path="/home" element = {<News setProgress={setProgress}  key="general"  pageSize={pageSize}country="us"category="general"/>}> </Route>
          <Route exact path="/business" element = {<News setProgress={setProgress}  key="business" pageSize={pageSize}country="us"category="business"/>}> </Route>
          <Route exact path="/entertainment" element = { <News setProgress={setProgress}  key="entertainment" pageSize={pageSize}country="us"category="entertainment"/>}></Route>
          <Route exact path="/general" element = {<News setProgress={setProgress}  key="general" pageSize={pageSize}country="us"category="general"/>}> </Route>
          <Route exact path="/health" element = { <News setProgress={setProgress}  key="health" pageSize={pageSize}country="us"category="health"/>}></Route>
          <Route exact path="/science" element = {<News setProgress={setProgress}  key="science" pageSize={pageSize}country="us"category="science"/>}> </Route>
          <Route exact path="/sports" element = {<News setProgress={setProgress}  key="Sports" pageSize={pageSize}country="us"category="Sports"/>}> </Route>
          <Route exact path="/technology" element = {<News setProgress={setProgress}  key="technology" pageSize={pageSize}country="us"category="technology"/>}> </Route>
        </Routes>
        </Router> */}
        
        <Router>
      <Navbar1 />
      <Routes>
        <Route path="/t-shirt" element={<RedClub category="t-shirt" />} />
        <Route path="/shirt" element={<RedClub category="shirt" />} />
        <Route path="/forml" element={<RedClub category="forml" />} />
        <Route path="/hudi" element={<RedClub category="hudi" />} />
      </Routes>
    </Router>
        
        
      </div>
    );

  
}

export default App;
