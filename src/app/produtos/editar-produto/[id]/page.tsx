'use client'
import { useState, useEffect, useCallback } from "react";
import { styled } from '@mui/material/styles';
import { toast } from "react-toastify";
import { NumericFormat } from "react-number-format";
import Image from "next/image";
import Layout from "@/components/Layout";
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import convertBase64 from "@/app/functions/convertBase64";
import formatBytes from "@/app/functions/formatBytes";
import api from "@/services/api";
import useAppAuth from '@/data/hook/useAppAuth';
import imageCompression from 'browser-image-compression';
import CircularProgress from '@mui/material/CircularProgress';

interface fileImagem {
    base64?: string,
    size: string | number,
    name: string,
}

interface inputsValues {
    nome_produto: string,
    descricao_produto: string,
    [key: string]: string | number
}

type produto = {
    categoriaEnum: string,
    descricao: string,
    id: number,
    imgBase64: string,
    nome: string,
    preco: number,
    produtoAtivo: boolean,
}

const first_values = {
    nome_produto: '',
    descricao_produto: ''
}

export default function EditarProduto({ params }: { params: { id: string } }) {
    const [select, setSelect] = useState('');
    const [imagem, setImagem] = useState<fileImagem | null>(null);
    const [checked, setChecked] = useState(false);
    const [categorias, setCategorias] = useState([{ id: 0, nameCategoria: 'Carregando...' }]);
    const [valueInput, setValue] = useState<inputsValues>(first_values);
    const [preco, setPreco] = useState(0);
    const [produto, setProduto] = useState<produto>({
        categoriaEnum: '',
        descricao: '',
        id: 0,
        imgBase64: '',
        nome: '',
        preco: 0,
        produtoAtivo: false,
    });
    const [load, setLoad] = useState(true);
    const { login } = useAppAuth();

    const changeSelect = (event: SelectChangeEvent) => {
        setSelect(event.target.value as string);
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    const changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const auxValues: inputsValues = { ...valueInput };
        auxValues[e.target.name] = e.target.value;
        setValue(auxValues);
    };

    const cleanInputs = () => {
        setChecked(produto.produtoAtivo);
        setPreco(produto.preco);
        setImagem({ base64: produto.imgBase64, size: '', name: '' });
        setSelect(produto.categoriaEnum);
        setValue({
            nome_produto: produto.nome,
            descricao_produto: produto.descricao
        });
    }

    const handleFileRead = async (event: React.SyntheticEvent<EventTarget>) => {
        const file = (event.target as HTMLFormElement).files[0];

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1000,
            useWebWorker: true,
        }
        try {
            const compressedFile: fileImagem = await imageCompression(file, options);
            const base64: any = await convertBase64(compressedFile);
            setImagem({
                base64: base64,
                size: formatBytes(compressedFile.size as number),
                name: file.name
            });

        } catch (error) {
            toast.error('Erro ao realizar upload da imagem.', { position: "bottom-center" });
        }
    }

    const getCategorias = useCallback(() => {
        setLoad(true);
        api.get('/categoria/all', {
          headers: {
            Authorization: `Bearer ${login?.access_token}`,
          }
        })
          .then((res) => {
            setCategorias(res.data);
            setLoad(false);
          })
          .catch((err) => {
            toast.error('Não foi possivel obter os dados dos produtos.')
          })
      },[login])

    const getProdutos = useCallback(()=>{
        setLoad(true);
        api.get<produto>(`/produto/findById/${params.id}`, {
            headers: {
                Authorization: `Bearer ${login?.access_token}`,
            }
        })
            .then((res) => {
                let result: produto = res.data;
                setChecked(result.produtoAtivo);
                setPreco(result.preco);
                setImagem({ base64: result.imgBase64, size: '', name: '' });
                setSelect(result.categoriaEnum);
                setValue({
                    nome_produto: result.nome,
                    descricao_produto: result.descricao
                });
                setProduto(result);
                setLoad(false);
            })
            .catch((err) => {
                toast.error('Erro ao obter dados do produto.');
                setLoad(false);
            })
    },[login, params.id])

    useEffect(() => {
        getCategorias();
        getProdutos();
    },[getProdutos, getCategorias])

    // função para cadastro de formulário
    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        await api
            .post(
                "/produto/replace",
                {
                    id: params.id,
                    produtoAtivo: checked,
                    nome: valueInput.nome_produto,
                    categoriaEnum: select,
                    preco: preco,
                    imgBase64: imagem?.base64,
                    descricao: valueInput.descricao_produto,
                },
                {
                    headers: {
                        Authorization: `Bearer ${login?.access_token}`,
                    },
                }
            )
            .then((res) => {
                toast.success("Dados do produto alterado com sucesso.");
                getProdutos();
            })
            .catch((err) => {
                toast.error("Não foi possível gravar os dados.");
            });
    }

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const renderImage = () => {
        if (!imagem?.base64) {
            return (
                <Grid component={Paper} height={148} variant="outlined" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="overline">Imagem</Typography>
                </Grid>
            )
        } else {
            return (
                <Grid component={Paper} height={148} variant="outlined" sx={{ display: 'flex', alignItems: 'start', justifyContent: 'start', padding: '5px' }}>
                    <Image src={imagem.base64} width={200} height={135} alt="Imagem do produto." />
                    <Grid marginLeft={1}>
                        <Typography component={'p'} variant="subtitle1">Arquivo:</Typography>
                        <Typography component={'p'} variant="caption" whiteSpace={'discard'}>{imagem?.name}</Typography>
                        <Typography component={'p'} variant="subtitle1">Tamanho:</Typography>
                        <Typography component={'p'} variant="caption">{imagem?.size}</Typography>
                    </Grid>
                </Grid>
            )
        }
    }

    if (load) {
        return (
            <Layout>
                <Grid
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                </Grid>
            </Layout>
        )
    }

    return (
        <Layout>
            <Grid component={'form'} container xs={12} padding={2} onSubmit={handleSubmit} name="form_produto">
                <Grid container component={Paper} elevation={3} xs={12} padding={1} spacing={2}>
                    <Grid container xs={12} direction={'row'} spacing={2}>
                        <Grid direction={'column'} xs={12} sm={2}>
                            <Typography variant="h6">Habilitado</Typography>
                            <Stack direction={'row'} alignItems={'center'}>
                                <Typography>Não</Typography>
                                <Switch name="checked" checked={checked} onChange={handleChange} />
                                <Typography>Sim</Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                    <Grid container xs={12} direction={'row'} spacing={2}>
                        <Grid direction={'column'} xs={12} sm={6}>
                            <Typography variant="h6" sx={{ marginBottom: '5px' }}>Nome</Typography>
                            <TextField fullWidth name="nome_produto" label="Nome" value={valueInput.nome_produto} onChange={changeValue} required />
                        </Grid>
                        <Grid direction={'column'} xs={12} sm={3}>
                            <Typography variant="h6" sx={{ marginBottom: '5px' }}>Categoria</Typography>
                            <FormControl fullWidth>
                                <InputLabel id="select-label">Categoria</InputLabel>
                                <Select
                                    labelId="select-label"
                                    id="select-label"
                                    autoWidth
                                    value={select}
                                    label="Categoria"
                                    onChange={changeSelect}
                                    required
                                >
                                    <MenuItem value=""><em>Selecione</em></MenuItem>
                                    {categorias?.map((item: { id: number, nameCategoria: string }) => (
                                        <MenuItem key={item.id} value={item.nameCategoria}>{item.nameCategoria}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid direction={'column'} xs={12} sm={3}>
                            <Typography variant="h6" sx={{ marginBottom: '5px' }}>Preço</Typography>
                            <NumericFormat
                                name="preco_produto"
                                value={preco}
                                onValueChange={(values) => {
                                    setPreco(values.floatValue ? values.floatValue : 0);
                                }}
                                prefix="R$ "
                                decimalScale={2}
                                decimalSeparator=","
                                customInput={TextField}
                            />
                        </Grid>
                    </Grid>
                    <Grid container xs={12} direction={'row'} spacing={2}>
                        <Grid direction={'column'} xs={12} sm={6}>
                            <Typography variant="h6" sx={{ marginBottom: '12px' }}>Descrição</Typography>
                            <TextField
                                required
                                fullWidth
                                name="descricao_produto"
                                label="Descrição"
                                multiline
                                value={valueInput.descricao_produto}
                                onChange={changeValue}
                                rows={5} />
                        </Grid>
                        <Grid direction={'column'} xs={12} sm={6} >
                            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} sx={{ marginBottom: '7px' }}>
                                Enviar Imagem
                                <VisuallyHiddenInput
                                    id="imagemProduto"
                                    accept="image/png, image/jpeg, capture=camera"
                                    name="imagemProduto"
                                    onChange={e => handleFileRead(e)}
                                    type="file"
                                />
                            </Button>
                            {renderImage()}
                        </Grid>
                    </Grid>
                    <Grid container xs={12} direction={'row'} spacing={2}>
                        <Grid direction={'column'} xs={12} sx={{ display: 'flex', justifyContent: 'end' }}>
                            <Stack direction={'row'} spacing={2}>
                                <Button variant="contained" color="error" type="button" onClick={cleanInputs}>Cancelar</Button>
                                <Button variant="contained" color="success" type="submit">Gravar</Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Layout>
    );
}