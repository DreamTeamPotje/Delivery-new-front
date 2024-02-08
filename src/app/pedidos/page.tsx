'use client'
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import {steps} from './status';
import Link from 'next/link';
import api from '@/services/api';
import Layout from "@/components/Layout";
import useAppAuth from '@/data/hook/useAppAuth';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import formatMoney from "../functions/formatMoney";
import formatDate from '../functions/formatDate';

type pedidos = [{
    id: number,
    idUsuario: number,
    formaPagamento: string,
    momentoPedido: string,
    status: number,
    troco: number,
    valorPedido: number,
    produtos: [
        {
            id: number,
            nome: string,
            preco: number,
            quantProdutoCompra: number
        }
    ],
}];

export default function Pedidos() {
    const [pedidos, setPedidos] = useState<pedidos>();
    const [load, setLoad] = useState(false);
    const { login } = useAppAuth();

    const getPedidos = useCallback(() => {
        setLoad(true);
        api.get('/pedido/all', {
            headers: {
                Authorization: `Bearer ${login?.access_token}`,
            }
        })
            .then((res) => {
                setPedidos(res.data);
                setLoad(false);
            })
            .catch((err) => {
                toast.error('Não foi possível obter os dados dos pedidos.');
                setLoad(false);
            })
    }, [login]);

    useEffect(() => {
        getPedidos();
    }, [getPedidos])

    const renderLoading = () => {
        return (
            <Layout>
                <Grid
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                </Grid>
            </Layout>
        )
    }

    if (load) {
        return renderLoading();
    }
    return (
        <Layout>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 400 }} aria-label="Tabela de dados">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Nº Pedido
                            </TableCell>
                            <TableCell>
                                Data
                            </TableCell>
                            <TableCell>
                                Status
                            </TableCell>
                            <TableCell>
                                Troco
                            </TableCell>
                            <TableCell>
                                Valor
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pedidos?.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Link href={`/pedidos/${item.id}`}>
                                        {item.id}
                                    </Link>
                                </TableCell>
                                <TableCell>{formatDate(item.momentoPedido)}</TableCell>
                                <TableCell>{steps[item.status]}</TableCell>
                                <TableCell>{formatMoney(item.troco)}</TableCell>
                                <TableCell>{formatMoney(item.valorPedido)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Layout>
    );
}