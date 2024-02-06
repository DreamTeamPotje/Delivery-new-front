import { redirect } from 'next/navigation';
import Head from "next/head";
import useAppAuth from '@/data/hook/useAppAuth';
import Loading from "@/components/Loading";

interface forceAuthProps {
    children: React.ReactNode
}

export default function ForceAuth(props: forceAuthProps) {
    const { signed, login, loadingAuth } = useAppAuth();

    const renderizarConteudo = () => {
        return (
            <>
                <Head>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                                if(!document.cookie?.includes("SistemUser")) {
                                    window.location.href = "/"
                                }
                            `
                        }}
                    />
                </Head>
                {props.children}
            </>
        )
    }

    if (signed && login) {
        return renderizarConteudo();
    } else if (loadingAuth) {
        <Loading size={10} />
    } else {
        return redirect('/login');
    }


}