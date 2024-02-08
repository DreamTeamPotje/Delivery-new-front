'use client'
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import {steps} from '../status';
import api from '@/services/api';
import Layout from "@/components/Layout";
import useAppAuth from '@/data/hook/useAppAuth';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Chip from '@mui/material/Chip';
import formatDate from '@/app/functions/formatDate';
import formatMoney from '@/app/functions/formatMoney';
import { Button } from '@mui/material';

type pedido = {
    id: number,
    idUsuario: number,
    formaPagamento: string,
    momentoPedido: string,
    nomeUsuario: string,
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
};

export default function Pedido({ params }: { params: { pedido: number } }) {
    const [pedido, setPedido] = useState<pedido>();
    const { login } = useAppAuth();
    // const steps = ['PENDENTE', 'ACEITO', 'PREPARANDO', 'ENTREGA', 'FINALIZADO'];

    const getPedido = useCallback(async () => {
        await api.get<pedido>(`/pedido/findById/${params.pedido}`, {
            headers: {
                Authorization: `Bearer ${login?.access_token}`
            }
        })
            .then((res) => {
                setPedido(res.data);
            })
            .catch((err) => {
                toast.error('Não foi possível obter os dados do pedido.')
            });
    }, [params.pedido, login]);

    useEffect(() => {
        getPedido();
    }, [getPedido]);

    return (
        <Layout>
            <Grid container xs={12} padding={1}>
                <Grid container xs={12} component={Paper} elevation={6} padding={1} marginBottom={3}>
                    <Grid xs={12}>
                        <Typography variant='h5' display={'flex'}>
                            Pedido Nº {pedido ? pedido.id : (<Skeleton width={200} sx={{ marginLeft: '5px' }} />)}
                        </Typography>
                    </Grid>
                    <Grid container xs={12} marginTop={5} marginBottom={5}>
                        <Stepper activeStep={pedido ? pedido.status : undefined} alternativeLabel sx={{ width: '100%' }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Grid>
                    <Grid xs={12} sm={6}>
                        <Typography variant='subtitle1' display={'flex'}>
                            Realizado em {pedido ? formatDate(pedido.momentoPedido) : (<Skeleton width={200} sx={{ marginLeft: '5px' }} />)}
                        </Typography>
                    </Grid>
                    <Grid xs={12}>
                        <Typography variant='subtitle1' display={'flex'}>Cliente: {pedido ? pedido.nomeUsuario : (<Skeleton width={200} sx={{ marginLeft: '5px' }} />)}</Typography>
                    </Grid>
                    <Stack direction={'row'} spacing={4}>
                        <Typography variant='body1' display={'flex'}>Valor: {pedido ? formatMoney(pedido.valorPedido) : (<Skeleton width={200} sx={{ marginLeft: '5px' }} />)}</Typography>
                        <Typography variant='body1' display={'flex'}>Troco: {pedido ? formatMoney(pedido.troco) : (<Skeleton width={200} sx={{ marginLeft: '5px' }} />)}</Typography>
                        <Typography variant='body1' display={'flex'}>Forma de Pagamento: {pedido ? pedido.formaPagamento : (<Skeleton width={200} sx={{ marginLeft: '5px' }} />)}</Typography>
                    </Stack>
                    <Grid xs={12} marginTop={3}>
                        <Stack direction={'row'} spacing={2}>
                            <Button variant='text' color='success'>Próximo</Button>
                            <Button variant='text' color='error'>Cancelar</Button>
                        </Stack>
                    </Grid>
                </Grid>
                <Grid container xs={12} padding={1} marginBottom={3}>
                    <Grid xs={12} marginBottom={1}>
                        <Typography variant='subtitle2'>Produto(s):</Typography>
                    </Grid>
                    <Stack direction={'row'} spacing={2} whiteSpace={'balance'}>
                        {pedido?.produtos.map((item, index) => (
                            <Grid key={index} xs={4} component={Paper} elevation={5} padding={1} minWidth={'150px'}>
                                <Typography><b>Código</b>: {item.id}</Typography>
                                <Typography><b>Item</b>: {item.nome}</Typography>
                                <Typography><b>Preço</b>: {formatMoney(item.preco)}</Typography>
                                <Typography><b>Quantidade</b>: {item.quantProdutoCompra}</Typography>
                                <Typography><b>Total</b>: {formatMoney(item.preco * item.quantProdutoCompra)}</Typography>
                            </Grid>
                        ))}
                    </Stack>
                </Grid>
            </Grid>

        </Layout>
    );
}