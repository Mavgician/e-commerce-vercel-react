'use client'

import Image from 'next/image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'

import { faLongArrowLeft } from '@fortawesome/free-solid-svg-icons'

import { useSignInWithGoogle, useSignInWithFacebook, useSignOut, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import {
  Button,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
} from 'reactstrap'

import { auth, db } from '@/scripts/firebase'

import { useRouter } from 'next/navigation';

import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { useState } from 'react';

export default function Page() {
  const [signInWithGoogle, user_Google, loading_Google, error_Google] = useSignInWithGoogle(auth)
  const [
    signInWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invalid, setInvalid] = useState(false);

  const router = useRouter()
  const social = { height: 50, aspectRatio: 1, borderRadius: '50%' }

  function signUp() {
    return router.push('/sign-up')
  }

  async function googleLogin() {
    let user = await signInWithGoogle()

    if ((await getDoc(doc(db, 'user', user.user.uid))).exists()) return router.back()

    await setDoc(doc(db, 'user', user.user.uid), {
      d_name: user.user.displayName,
      email: user.user.email,
      account_type: 'user',
      account_image: user.user.photoURL,
      orders: [],
      created_at: serverTimestamp()
    })

    return router.push(`/account-setup/${user.user.uid}`)
  }

  async function normalSignIn() {
    let user = await signInWithEmailAndPassword(email, password)

    if (user) return router.push('/')
    setInvalid(true)
  }

  return (
    <main className='p-0 position-relative bg-white'>
      <Row className='p-0 m-0 vh-100'>
        <Col md={6} sm={12} className='d-flex justify-content-center align-items-center'>
          <div className='w-25'>
            <center className='text-dark'>
              <h1 className='mb-4'>Sign In</h1>
              <Button className='mx-1' style={social} outline={true} color='primary' onClick={googleLogin}>
                <FontAwesomeIcon icon={faGoogle} />
              </Button>
              <p className='text-muted mt-3'>or use your account</p>
              <FormGroup floating>
                <Input
                  placeholder='Email'
                  type='email'
                  value={email}
                  invalid={invalid}
                  onChange={e => setEmail(e.target.value)}
                />
                <Label>
                  Email
                </Label>
              </FormGroup>
              <FormGroup floating>
                <Input
                  placeholder='Password'
                  type='password'
                  value={password}
                  invalid={invalid}
                  onChange={e => setPassword(e.target.value)}
                />
                <Label>
                  Password
                </Label>
              </FormGroup>
              <div className='my-3'>
                <Button block onClick={normalSignIn}>
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
            <Button block onClick={signUp}>
              Sign Up
            </Button>
          </div>
        </Col>
      </Row>
    </main>
  )
}