import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
const VerifiedPage = () => {
  const [verified, setVerified] = useState(false);
  const params = useParams();
  useEffect(() => {
    const VerifyMail = async() => {
try{
  console.log(params.token)
  const url = `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/${params.userid}/verify/${params.token}`;
  await axios.get(url);
  setVerified(true);
} catch(error){
  setVerified(false);
}
    }
    VerifyMail()
  }, [params])
  return (
    <>
      {verified ?
        <div>
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h1 className="text-2xl font-bold text-green-600 mb-4">Email Verified Successfully!</h1>
              <p className="text-gray-600 mb-6">Thank you for verifying your email address. You can now access all features.</p>
              <a
                href="/"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Go to Login
              </a>
            </div>
          </div>
        </div>
        :
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
            <p className="text-lg text-gray-600 mb-6">Oops! The page you are looking for does not exist.</p>
            <a
              href="/"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Go to Homepage
            </a>
          </div>
        </div>
      }
    </>
  )
}

export default VerifiedPage
