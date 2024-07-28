import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FacebookLogin from "./components/FbLogin";
import Home from "./components/Home";
import PageDetails from "./components/PageDetails";
import Pages from "./components/pages/pages";
import './App.css';
import Cc from "./components/createCapm/cc";
import Sidebar from "./components/sidebar/sidebar";
import Posts from "./components/pages/pagePost";
import CreateAd from "./components/createadd/cd";

import CropImage from "./components/Img/views/CropImage";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="app-container">
          <Sidebar/>
          <div className="content-container">
            <Routes>
              <Route path="/" element={<FacebookLogin />} />
              <Route path="home" element={<Home />} />
              <Route path="pages" element={<Pages />} />
              <Route path="cc" element={<Cc />} />
              <Route path="page/:pageId" element={<PageDetails />} />
              <Route path="page/:pageId/posts" element={<Posts />} />
              <Route path="ads" element={<CreateAd />} />            
              <Route path="assets" element={<CropImage />} />            
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
