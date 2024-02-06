'use client'

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import DeliveryImage from '@/../public/images/delivery.png';
import useAppAuth from '@/data/hook/useAppAuth';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const { signed, login, signIn, loadingAuth } = useAppAuth();

  const enviar = (e: React.SyntheticEvent) => {
    e.preventDefault();
    signIn?.(username, senha);
    setUsername('');
    setSenha('');
  }

  useEffect(() => {
    if (signed && login && !loadingAuth) {
      redirect('/');
    }
  }, [login, signed, signIn, loadingAuth]);

  return (
    <form onSubmit={(e) => enviar(e)}>
      <Grid container marginY={5} padding={1} display={'flex'} spacing={2} direction={'column'} justifyContent={'center'} alignItems={'center'}>
        <Grid container xs={12} sm={6} md={6} lg={6}>
          <Grid container xs={12} sm={12} padding={2}>
            <Image src={DeliveryImage} width={200} height={110} alt={'Logo Delidery'} />
          </Grid>
          <Grid xs={12} sm={12}>
            <TextField
              fullWidth
              required
              label="Login"
              variant="outlined"
              name='login'
              placeholder='Login'
              value={username}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setUsername(e.target.value)}
            />
          </Grid>
          <Grid xs={12} sm={12}>
            <TextField
              fullWidth
              required
              label="Senha"
              variant="outlined"
              name='Senha'
              placeholder='Senha'
              type='password'
              value={senha}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setSenha(e.target.value)}
            />
          </Grid>
          <Grid sm={12}>
            {loadingAuth ?
              (<Button variant='contained' size='large' endIcon={<CircularProgress size={1}/>}>Aguarde</Button>)
              :
              (<Button variant='contained' size='large' type="submit" >Entrar</Button>)}
          </Grid>
        </Grid>
      </Grid>
    </form>
  )
}
