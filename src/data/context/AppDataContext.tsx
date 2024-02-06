'use client';
import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import api from '@/services/api';

interface ContextProps {
    children: React.ReactNode
}

type Data = {
    access_token: string,
    token_type: string,
    refresh_token: string,
    expires_in: number,
    scope: string
}


interface AppContextType {
    signed?: boolean
    login?: Data | null,
    resp?:boolean,
    signIn?: (username: string, password: string) => Promise<void>,
    signOut?: () => Promise<void>,
    loadingAuth?: boolean,
    setLoadingAuth?: React.Dispatch<React.SetStateAction<boolean>>
}

const client = "delivery";
const secret = 123;

const AppContext = createContext<AppContextType>({});
export function AppProvider(props: ContextProps) {
    const [login, setLogin] = useState<Data | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(false);

    function storageUser(data: {}) {
        Cookies.set('SistemUser', JSON.stringify(data), { secure: true, sameSite: 'Lax', expires: 1 });
    }

    useEffect(() => {
        if (Cookies.get('SistemUser')) {
            let data: any = Cookies.get('SistemUser');
            setLogin(JSON.parse(data));
        }
    }, [])

    // async function signIn(login: string, senha: string) {
    //     setLoadingAuth(true);
    //     await api.post<Data>('/login', {
    //         login: login,
    //         password: senha
    //     })
    //         .then((res) => {
    //             storageUser(res.data)
    //             setUser(res.data);
    //             setLoadingAuth(false);
    //             toast.success(`Bem vindo ${res.data.user.login}`);
    //         })
    //         .catch((err) => {
    //             setLoadingAuth(false);
    //             toast.error("Erro ao tentar logar no sistema");
    //         });
    // }

    async function signIn(username: string, password: string) {
        setLoadingAuth(true);
        await api
          .post<Data>(
            "/oauth/token",
            new URLSearchParams({
              username: username,
              password: password,
              grant_type: "password",
            }),
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
              },
              auth: {
                username: client,
                password: `${secret}`,
              },
            }
          )
          .then((res) => {
            storageUser(res.data);
            setLogin(res.data);
            toast.info(`Bem vindo, ${username}`);
            setLoadingAuth(false);
          })
          .catch((err) => {
            if (err.code === "ERR_NETWORK") {
              toast.error(
                "Verifique sua conexão de rede, ou servidor está offline."
              );
            }
            console.log(err.code);
            setLoadingAuth(false);
          });
      }

    async function signOut() {
        setLoadingAuth(true);
        await api.delete('/logout', {
            headers: {
                'Authorization': `Bearer ${login}`
            }
        })
            .then((res) => {
                setLogin(null);
                Cookies.remove('SistemUser', { secure: true, sameSite: 'Lax' });
                setLoadingAuth(false);
            })
            .catch((error) => {
                setLogin(null);
                Cookies.remove('SistemUser', { secure: true, sameSite: 'Lax' });
                setLoadingAuth(false);
            })
    }
    return (
        <AppContext.Provider value={{
            signed: !!login,
            login,
            signIn,
            signOut,
            loadingAuth,
            setLoadingAuth,
        }}>
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContext;
export const AppConsumer = AppContext.Provider;