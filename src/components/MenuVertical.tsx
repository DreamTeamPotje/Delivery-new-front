import Link from 'next/link';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import useAppAuth from '@/data/hook/useAppAuth';

interface MenuVerticalProps {
    titulo: string,
    handleDrawerToggle: () => void,
    mobileOpen: boolean,
    navItems: {
        text: string,
        link: string
    }[]
}

const drawerWidth = 240;

export default function MenuVertical(props: MenuVerticalProps) {
    const { signOut } = useAppAuth();

    const drawer = (
        <Box onClick={props.handleDrawerToggle} sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                {props.titulo}
            </Typography>
            <Divider />
            <List sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <ListItem disablePadding>
                    <ListItemButton sx={{ textAlign: 'center' }}>
                        <ListItemText>
                            <Link href={'/'} style={{ textDecoration: 'none', color: '#000' }}>Home</Link>
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
                {props.navItems.map((item: { text: string, link: string }) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton sx={{ textAlign: 'center' }}>
                            <ListItemText>
                                <Link href={`/${item.link}`} style={{ textDecoration: 'none', color: '#000' }}>{item.text}</Link>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem disablePadding sx={{ flexGrow: '1', alignItems: 'end' }}>
                    <ListItemButton onClick={signOut} sx={{ justifyContent: 'center', color: 'red' }}>
                        <LogoutIcon />
                        <span style={{ marginLeft: '3px' }}>Sair</span>
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Drawer
            variant="temporary"
            open={props.mobileOpen}
            onClose={props.handleDrawerToggle}
            ModalProps={{
                keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
        >
            {drawer}
        </Drawer>
    );
}