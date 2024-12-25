import './App.css';
import LoginPage from './app/login/page';
import {BrowserRouter, Routes, Route} from 'react-router';
import HomePage from './app/home/page';
import CarsPage from './app/cars-buy/page';

function App() {

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/users/login' element={<LoginPage/>}></Route>
        <Route path='/home' element={<HomePage/>}/>
        <Route path='/cars' element={<CarsPage/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  )
};

export default App;
