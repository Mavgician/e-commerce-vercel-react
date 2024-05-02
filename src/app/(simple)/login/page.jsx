'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'

import { faLongArrowLeft } from '@fortawesome/free-solid-svg-icons'

import { useSignInWithGoogle, useSignInWithFacebook, useSignOut } from 'react-firebase-hooks/auth'
import {
  Button,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
} from 'reactstrap'

import { auth } from '@/scripts/firebase'

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Page() {
  const [ signInWithGoogle, user_Google, loading_Google, error_Google ] = useSignInWithGoogle(auth)
  const [ signInWithFaceboook, user_Facebook, loading_Facebook, error_Facebook ] = useSignInWithFacebook(auth)
  const [signOut, loading, error] = useSignOut(auth);

  const router = useRouter()

  const social = {height: 50,  aspectRatio: 1, borderRadius: '50%'}

  async function googleLogin() {
    await signInWithGoogle()
    router.back()
  }

  async function logout() {
    await signOut()
    router.push('/')
  }

  return (
    <main className='p-0 position-relative'>
      <Row className='p-0 m-0 vh-100'>
        <Col md={6} sm={12} className='d-flex justify-content-center align-items-center'>
          <div className='w-25'>
            <center>
              <h1 className='mb-4'>Sign In</h1>
              <Button className='mx-1' style={social} outline={true} color='primary' onClick={googleLogin}>
                <FontAwesomeIcon icon={faGoogle} />
              </Button>
              <Button className='mx-1' style={social} outline={true} color='primary' onClick={logout}>
                <FontAwesomeIcon icon={faLongArrowLeft} />
              </Button>
              <p className='text-muted mt-3'>or use your account</p>
              <FormGroup floating>
                <Input
                  placeholder='Email'
                  type='email'
                />
                <Label>
                  Email
                </Label>
              </FormGroup>
              <FormGroup floating>
                <Input
                  placeholder='Password'
                  type='password'
                />
                <Label>
                  Password
                </Label>
              </FormGroup>
              <a href='#'>Forgot your password?</a>
              <div className='my-3'>
                <Button block>
                  Sign In
                </Button>
              </div>
            </center>
          </div>
        </Col>
        <Col md={6} sm={12} className='bg-black d-flex justify-content-center align-items-center text-white'>
          <div>
            <center className='my-4'>
              {/* <img src={logo.src} className='my-2 w-50' /> */}
            </center>
            <h1>ConFlix</h1>
            <p>A ticket reseller.</p>
            <Button block>
              Sign Up
            </Button>
          </div>
        </Col>
      </Row>
    </main>
  )
}