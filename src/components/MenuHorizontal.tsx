import { red } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useAppAuth from '@/data/hook/useAppAuth';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

interface MenuHorizontalProps {
    titulo: string,
    handleDrawerToggle: () => void,
    navItems: {
        text: string,
        link: string
    }[]
}

const theme = createTheme({
    palette: {
        primary: red,
    },
});

export default function MenuHorizontal(props: MenuHorizontalProps) {
    const { signOut } = useAppAuth();

    return (
        <ThemeProvider theme={theme}>
            <AppBar component="nav">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={props.handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        {props.titulo}
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Button  sx={{ color: '#fff' }}>
                            <Link href={'/'} style={{ textDecoration: 'none', color: '#fff' }}>
                                Home
                            </Link>
                        </Button>
                        {props.navItems.map((item: { text: string, link: string }) => (
                            <Button key={item.text} sx={{ color: '#fff' }}>
                                <Link href={`/${item.link}`} style={{ textDecoration: 'none', color: '#fff' }}>
                                    {item.text}
                                </Link>
                            </Button>
                        ))}
                        <Chip label="Sair" variant="outlined" onClick={signOut} sx={{color: 'white'}}/>
                    </Box>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
}