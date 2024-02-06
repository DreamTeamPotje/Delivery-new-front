import { toast } from "react-toastify";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import api from '@/services/api';
import useAppAuth from '@/data/hook/useAppAuth';

interface cofirmProps {
  produto: {id: number, nome: string}
  open: boolean,
  handleClose: () => void,
  getProdutos: () => void
}

export default function AlertDelProd(props: cofirmProps) {
  const { login } = useAppAuth();

  const delProduto = async () => {
    await api.delete(`/produto/delete/${props?.produto.id}`, {
      headers: {
        Authorization: `Bearer ${login?.access_token}`,
      }
    })
      .then((res) => {
        toast.success('Produto excluido com sucesso.')
        props.getProdutos();
      })
      .catch((err) => {
        toast.error('Não foi excluir o produto.')
      })
    props.handleClose()
  }

  return (
    <>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Deseja realmente excluir o produto?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`${props?.produto.nome}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Cancelar</Button>
          <Button onClick={delProduto} autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}