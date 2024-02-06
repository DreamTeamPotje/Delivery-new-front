import Image from "next/image";

interface LoadingImageProps{
    size?: number,
}

const images = ['load.gif', 'load1.gif', 'load2.gif'];

export default function LoadingImage(props:LoadingImageProps){
    const num = Math.floor(Math.random() * images.length);
    const size = props.size === undefined ? 0 : props.size;
    return(
        <>
            <Image src={`http://localhost:3000/images/${images[num]}`} width={size * 10} height={size * 10} alt="Caregando..."/>
        </>
    );
}