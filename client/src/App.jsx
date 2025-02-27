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
import EditPostPage from './app/edit-post/page';
import { ProtectedRoute } from './app/protected-route/page';
import { ResetPasswordPage } from './app/reset-password/page';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <div>
      <BrowserRouter>
      <ToastContainer/>
      <Routes>
        <Route path='/users/login' element={<LoginPage/>}></Route>
        <Route path='/' element={<PrincipalPage/>}>
          <Route path='/home' index element={<HomePage/>}/>
          <Route path='/about-us' element={<AboutUsPage/>}/>
          <Route path='/reset-password' element={<ResetPasswordPage/>}/>

          <Route element={<ProtectedRoute/>}>
            <Route path='/cars' element={<CarsPage/>}/>
            <Route path='/posts' element={<MyPostsPage/>}></Route>
            <Route path='/conversations' element={<ConversationsPage/>}></Route>
            <Route path='/settings' element={<SettingsPage/>}></Route>
            <Route path='/cars/:id' element={<CarPage/>}/>
            <Route path='/cars/favorites' element={<FavoritesPage/>}/>
            <Route path='/posts/create' element={<CreatePostPage/>}/>
            <Route path='/posts/edit/:id' element={<EditPostPage/>}/>
          </Route>
        </Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
};

export default App;
