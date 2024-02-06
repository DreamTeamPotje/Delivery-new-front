'use client'
import { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import MenuVertical from '@/components/MenuVertical';
import MenuHorizontal from '@/components/MenuHorizontal';
import ForceAuth from './ForceAtuth';
import NextBreadrumbs from './NextBreadrumbs';

interface LayoutProps {
    children: React.ReactNode
}



export default function Layout(props: LayoutProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };
    // const navItems: any = login?.acessos.map((item) => {
    //     return {
    //         text: item.modulos_modulo,
    //         link: item.modulos_modulo.toLowerCase()
    //     }
    // });

    const navItems = [{text: 'produtos', link: 'produtos'}, {text: 'usuarios', link:'usuarios'}];

    return (
        <>
            <ForceAuth>
                <Box sx={{ display: 'flex', width: '100%' }}>
                    <CssBaseline />
                    <MenuHorizontal titulo={'Delivery'} navItems={navItems} handleDrawerToggle={handleDrawerToggle} />
                    <nav>
                        <MenuVertical titulo='Delivery' handleDrawerToggle={handleDrawerToggle} mobileOpen={mobileOpen} navItems={navItems} />
                    </nav>
                    <Box component="main" sx={{width: '100%'}}>
                        <NextBreadrumbs separator="|" homeName='Home' capitalizeLinks />
                            {props.children}
                    </Box>
                </Box>
            </ForceAuth>
        </>
    );
}