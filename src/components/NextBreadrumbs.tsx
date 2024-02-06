'use client'
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

type TBreadCrumbProps = {
    separator?: '>' | '|' | '/' | '-'
    homeName: string,
    capitalizeLinks?: boolean
    children?: ReactNode
}

export default function NextBreadrumbs({ homeName, capitalizeLinks, children, separator = '/' }: TBreadCrumbProps) {
    const paths = usePathname();
    const pathNames = paths.split('/').filter(path => path);
    return (
        <Toolbar sx={{ marginTop: '3.5rem', width: '100%' }}>
            <Breadcrumbs separator={separator}>
                {pathNames.length === 0 ?
                    <Typography color="text.primary">
                        {homeName}
                    </Typography> :
                    // <Link href='/' style={{textDecoration: 'none'}}>
                    //     {homeName}
                    // </Link>
                    <Typography color="text.primary">
                        {homeName}
                    </Typography>
                }
                {
                    pathNames.map((link, index) => {
                        let href = `/${pathNames.slice(0, index + 1).join('/')}`
                        let itemLink = capitalizeLinks ? link[0].toUpperCase() + link.slice(1, link.length) : link
                        return (
                            <div key={index}>
                                {
                                    pathNames.length === index + 1 ?
                                        <Typography color="text.primary">
                                            {itemLink}
                                        </Typography>
                                        :
                                        // <Link href={href} style={{ textDecoration: 'none' }}>
                                        //     {itemLink}
                                        // </Link>
                                        <Typography color="text.primary">
                                            {itemLink}
                                        </Typography>
                                }
                                {/* {pathNames.length !== index + 1} */}
                            </div>
                        )
                    })
                }
            </Breadcrumbs>
            {children}
        </Toolbar>
    )
}
