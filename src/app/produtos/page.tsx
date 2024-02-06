'use client'
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "@/components/Layout";
import Grid from '@mui/material/Unstable_Grid2';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Edit from "@mui/icons-material/Edit";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import TextField from '@mui/material/TextField';
import useAppAuth from '@/data/hook/useAppAuth';
import CircularProgress from '@mui/material/CircularProgress';
import api from "@/services/api";
import formatMoney from "../functions/formatMoney";
import capitalizeText from '@/app/functions/capitalizeText';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CategoriaDialog from './CategoriaDialog';
import Link from "next/link";
import AlertDelProd from "./delProduto";


type produto = [{
    categoriaEnum: string,
    descricao: string,
    id: number,
    imgBase64: string,
    nome: string,
    preco: number,
    produtoAtivo: boolean,
    tipoEmbalagem: string
}]

export default function Produtos() {
    const [produtos, setProdutos] = useState<produto | null>(null);
    const [oldState, setOldSate] = useState<produto | null>(null);
    const [openCate, setOpenCate] = useState(false);
    const [openDel, setOpenDel] = useState(false);
    const [idProduto, setIdProduto] = useState({id: -1, nome: ''});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { login } = useAppAuth();

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const searchProducts = (nome: string) => {
        let result = oldState?.filter((item) => {
            return item.nome.toLowerCase().includes(nome.toLowerCase()) ||
                item.categoriaEnum.toLowerCase().includes(nome.toLowerCase()) ||
                `${item.id}`.toLowerCase().includes(nome.toLowerCase())
        }) as produto;
        if (result && nome) {
            setProdutos(result);
        } else {
            setProdutos(oldState);
        }

    }

    const getProdutos = useCallback(()=>{
        setLoading(true);
        api.get('/produto/all', {
            headers: {
                Authorization: `Bearer ${login?.access_token}`,
            }
        })
            .then((res) => {
                setProdutos(res.data);
                setOldSate(res.data);
                setLoading(false);
            })
            .catch((err) => {
                toast.error('Não foi possivel obter os dados dos produtos.')
            })
    },[login])

    useEffect(() => {
        getProdutos()
    },[getProdutos])

    const renderLoading = () => {
        return (
            <Grid
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Grid>
        )
    }

    const dialogOpen = () => {
        setOpenCate(true);
    }

    const dialogClose = () => {
        setOpenCate(false);
    }

    const cofirmDelProd = (id: number, produto: string) =>{
        setIdProduto({id: id, nome: produto});
        setOpenDel(true);
    }

    const dialogDelClose = () => {
        setOpenDel(false);
    }

    const renderTable = () => {
        return (
            <Grid paddingX={2}>
                <CategoriaDialog handleClose={dialogClose} open={openCate} />
                <AlertDelProd open={openDel} produto={idProduto} getProdutos={getProdutos} handleClose={dialogDelClose}/>
                <Grid marginBottom={2} container xs={12} direction={'row'}>
                    <Grid sx={{ display: 'flex', alignItems: 'flex-end', flexGrow: 1 }}>
                        <Stack direction={'row'} spacing={1}>
                            <Chip
                                label="Categoria"
                                color="success"
                                variant="filled"
                                onClick={dialogOpen}
                                icon={<AddCircleOutlineIcon />}
                            />
                            <Link href={'./produtos/novo-produto'}>
                                <Chip
                                    label="Produto"
                                    color="success"
                                    variant="filled"
                                    onClick={() => { }}
                                    icon={<AddCircleOutlineIcon />}
                                />
                            </Link>
                        </Stack>
                    </Grid>
                    <Grid>
                        <TextField id="standard-basic" label="Procurar" variant="standard" onChange={(e) => { searchProducts(e.target.value) }} />
                    </Grid>
                </Grid>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 400 }} aria-label="Tabela de dados">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Código
                                </TableCell>
                                <TableCell>
                                    Nome
                                </TableCell>
                                <TableCell>
                                    Categoria
                                </TableCell>
                                <TableCell>
                                    Descrição
                                </TableCell>
                                <TableCell>
                                    Valor
                                </TableCell>
                                <TableCell>
                                    Habilitado
                                </TableCell>
                                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                    Editar | Excluir
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {produtos?.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{capitalizeText(item.nome)}</TableCell>
                                    <TableCell>{capitalizeText(item.categoriaEnum)}</TableCell>
                                    <TableCell>{capitalizeText(item.descricao)}</TableCell>
                                    <TableCell>{formatMoney(item.preco)}</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>
                                        {
                                            item.produtoAtivo ? (<TaskAltIcon color="success" />) : (<NotInterestedIcon color="error" />)
                                        }
                                    </TableCell>
                                    <TableCell sx={{ alignItems: 'center' }}>
                                        {
                                            <>
                                                <IconButton color={"success"} aria-label="delete">
                                                    <Link href={`/produtos/editar-produto/${item.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                                                        <Edit />
                                                    </Link>
                                                </IconButton>
                                                |
                                                <IconButton color={"error"} aria-label="delete" onClick={()=>{cofirmDelProd(item.id, item.nome)}}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    labelRowsPerPage="Linhas por paginas"
                    count={produtos ? produtos?.length : 0}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Grid>
        );
    }


    return (
        <Layout>
            {loading ? renderLoading() : renderTable()}
        </Layout>
    )

}
