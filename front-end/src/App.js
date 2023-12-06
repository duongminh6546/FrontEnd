import React, { Fragment, useEffect } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {routes} from './routes'
import HeaderComponent from './components/HeaderComponent/HeaderComponent'
import DefaultComponent from './components/DefaulComponent/DefaultComponent'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { isJsonString } from './utils'
import { jwtDecode } from 'jwt-decode';
import  * as UserService from './service/UserService'
import {useDispatch, useSelector} from 'react-redux'
import { updateUser } from './redux/slides/userSlide'
import { useState } from 'react'
import Loading from './components/LoadingComponent/Loading'

function App() {
  const dispatch = useDispatch();
  const [isPending, setIsLoading] = useState(false)
  const user = useSelector((state) => state.user)


  
  useEffect(() =>{
    setIsLoading(true)
    const { storageData, decoded} = handleDecoded()
          if(decoded?.id){
            handleGetDetailsUser(decoded?.id, storageData)
        }
        setIsLoading(false)
    }, [])

  const handleDecoded = () =>{
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    //console.log('storageData',storageData,isJsonString(storageData))
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData)
       decoded = jwtDecode(storageData)
      
    }
      return {decoded, storageData}
  }

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    // Do something before request is sent
    const currentTime = new Date()
    const { decoded } = handleDecoded()
    if (decoded?.exp < currentTime.getTime() / 1000) {
        const data = await UserService.refreshToken()
        config.headers['token'] = `Bearer ${data?.access_token}`
    }
    return config;
  }, (err) => {
    return Promise.reject(err)
  })

  const handleGetDetailsUser = async (id, token) =>{
      const res = await UserService.getDetailsUser(id,token)
      dispatch(updateUser({...res?.data, access_token: token}))
     
    }

return (
    <div>
      <Loading isPending={isPending}>
     <Router>
      <Routes>
        {routes.map((route)=> {   //lấy từ index của route qua 
          const Page = route.page
          const Layout =  route.isShowHeader ? DefaultComponent : Fragment
          return (
            <Route key={route.path} path= {route.path} element={
            <Layout>
            <Page />
            </Layout>
          } />
          )
        })}
      </Routes>
     </Router>
     </Loading>
    </div>
  )
}
export default App