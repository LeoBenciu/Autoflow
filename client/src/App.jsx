import './App.css';
import LoginPage from './app/login/page';
import {BrowserRouter, Routes, Route} from 'react-router';
import HomePage from './app/home/page';
import CarsPage from './app/cars-buy/page';
import CarPage from './app/car/page';
import PrincipalPage from './app/principal/page';
import MyPostsPage from './app/posts/page';
import ConversationsPage from './app/conversations/page';
import SettingsPage from './app/settings/page';
import FavoritesPage from './app/favorites/page';
import AboutUsPage from '../src/app/about-us/page';
import CreatePostPage from './app/create-post/page';


function App() {

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/users/login' element={<LoginPage/>}></Route>
        <Route path='/' element={<PrincipalPage/>}>
          <Route path='/posts' element={<MyPostsPage/>}></Route>
          <Route path='/conversations' element={<ConversationsPage/>}></Route>
          <Route path='/settings' element={<SettingsPage/>}></Route>
          <Route path='/home' index element={<HomePage/>}/>
          <Route path='/cars' element={<CarsPage/>}/>
          <Route path='/cars/id' element={<CarPage/>}/>
          <Route path='/cars/favorites' element={<FavoritesPage/>}/>
          <Route path='/about-us' element={<AboutUsPage/>}/>
          <Route path='/posts/create' element={<CreatePostPage/>}/>
        </Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
};

export default App;
