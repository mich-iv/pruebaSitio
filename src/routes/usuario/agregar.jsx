import React, { useEffect, useState , useRef } from 'react'

import { useParams, useNavigate } from 'react-router-dom';
import { bd, collection, doc, getDocs } from '../../../firebase.jsx';
import { setDoc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { Editor } from '@tinymce/tinymce-react';

import '../../estilos/Menu.css';

// TinyMCE so the global var exists
/* eslint-disable-next-line no-unused-vars */
import tinymce from 'tinymce/tinymce.min.js';
window.tinymce = tinymce;
// Toolbar icons
import 'tinymce/icons/default';
// Theme
import 'tinymce/themes/silver';
import 'tinymce/models/dom';

// Editor styles
import 'tinymce/skins/ui/oxide/skin.min.css';

// importing the plugin js.
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/accordion';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/table';
import 'tinymce/plugins/help/';
import 'tinymce/plugins/help/plugin.js';
import 'tinymce/plugins/help/index.js';
import 'tinymce/plugins/help/js/i18n/keynav/en.js';
import 'tinymce/plugins/help/js/i18n/keynav/es_MX.js';
import '../../../langs/es_MX.js';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/save';

import '../../estilos/Paginas.css';

import ExtraerTexto from '../../Components/ExtraerDOI.jsx';

export default function Route(){
    var idioma = "es_MX";

    const [initialValue, setInitialValue] = useState(undefined);

    const editorRef = useRef(null);

    //obtenemos la ruta actual del url
    const { ubicacion } = useParams();

    const navigate = useNavigate();

    const [token, setToken] = useState("");
    const [nombre, setNombre] = useState("");

    const sesion = getAuth();
    const horaActual = new Date();

    let id = "10.1117/12.2062348";
    let textoDOI = ExtraerTexto(id);
    var prueba;
    var cueva, tit;
    var resultMap = new Map();
    
    try {
        // console.log(typeof textoDOI);
        // let myMap = new Map(Object.entries(this.props.textoDOI));
        // console.log(myMap.TITLE);

        for (const [key, value] of Object.entries(textoDOI)) {
            // console.log(`${key}: ${value}`);
            for (const [llave, valor] of Object.entries(value)) {
                // console.log(`${llave}: ${valor}`);
                resultMap.set(llave, valor);
            }
        }

        // console.log(resultMap);
       

    } catch (error) {
        console.error(error);
    }

    console.log(
        /*
        Andres Cuevas ; Victor H. Diaz-Ramirez ; Vitaly Kober and Leonardo Trujillo, 
        Facial recognition using composite correlation filters designed with multiobjective 
        combinatorial optimization ", Proc. SPIE 9217, Applications of Digital Image Processing XXXVII, 
        921710 (September 23, 2014); doi:10.1117/12.2062348

        Cuevas, Andres and Diaz-Ramirez, Victor H. and Kober, Vitaly and Trujillo, Leonardo||,
        Facial recognition using composite correlation filters designed with multiobjective combinatorial optimization||,
        SPIE||,
        Applications of Digital Image Processing XXXVII||,
        Facial recognition using composite correlation filters designed with multiobjective combinatorial optimization||, 
        */
        resultMap.get("AUTHOR")+"||, "+
        resultMap.get("TITLE")+"||, "+
        resultMap.get("PUBLISHER")+"||, "+
        resultMap.get("BOOKTITLE")+"||, "+
        resultMap.get("TITLE")+"||, "+
        ""
    );

    // {
    //     "CUEVAS_2014": {
    //         "entryType": "INPROCEEDINGS",
    //         "TITLE": "Facial recognition using composite correlation filters designed with multiobjective combinatorial optimization",
    //         "ISSN": "0277-786X",
    //         "URL": "http://dx.doi.org/10.1117/12.2062348",
    //         "DOI": "10.1117/12.2062348",
    //         "BOOKTITLE": "Applications of Digital Image Processing XXXVII",
    //         "PUBLISHER": "SPIE",
    //         "AUTHOR": "Cuevas, Andres and Diaz-Ramirez, Victor H. and Kober, Vitaly and Trujillo, Leonardo",
    //         "EDITOR": "Tescher, Andrew G.",
    //         "YEAR": "2014",
    //         "MONTH": "September"
    //     }
    // }

    useEffect(() => {
        onAuthStateChanged(sesion, (usuario) => {
        if (usuario) {
            setToken(usuario.accessToken);
            setNombre(usuario.displayName);
        }else{
            navigate("/");
        }
        })
    }, []) 

    const submit = (e) => {
        //traemos los datos del editor
        const textoFinal = editorRef.current.getContent();
        e.preventDefault();
        try{
            /*
            - aquí el truco está en "bd, UBICACION", donde
            ubicación es la ruta que le da el nombre de 
            la colección, para así no generar un .jsx para
            cada sección.
            - Además, el id lo obtenemos de la base para actualizar el mismo registro
            */
            const documento = doc(bd, ubicacion, "0");
                setDoc(documento, {
                    texto : textoFinal,
                    usuario: nombre,
                    hora: horaActual
                    // descripcion: descripcionForm,
                    // url: urlForm,
                    // anio: anioForm
                }).then(() => {
                    alert('Información actualizada')
                    navigate(-1);
                }).catch((error) => {
                    console.error(error);
                });
        }catch (error) {
            console.error(error);
        }
    }

    useEffect (() => {
        async function docSnap(){
            // const response = await firebase.firestore().collection('awards').get();
            var response = await getDocs(collection(bd, ubicacion));
            const docs = response.docs.map((doc) => {
                const data = doc.data();
                data.id = doc.id;
                return data;
            })
            return docs;
        }
        docSnap().then(valor => {
            const temporal = valor;
            if(temporal.length>0){
                // setInitialValue(temporal[0].texto)
                setTimeout(() => setInitialValue(temporal[0].texto), 200);
                // setTimeout(() => setId(temporal[0].id), 200);
            }
        });
    }, []);
    
    return(
        <div>
            <div  className='root'>
                <h1 className='titulos'>
                    Agregar {ubicacion}
                </h1>

                
                <h2>Actualizar información</h2>
                    <Editor className='root'
                        inline={false}
                        tinymceScriptSrc={'tinymce/tinymce.min.js'}
                        onInit={(evt, editor) => editorRef.current = editor}
                        initialValue={initialValue}
                        init={{
                            promotion: false,
                            content_css: "tinymce/skins/content/default/content.min.css, tinymce/skins/ui/oxide/content.min.css",
                            object_resizing: true,
                            image_advtab: true,
                            image_title: true,
                            /* enable automatic uploads of images represented by blob or data URIs*/
                            automatic_uploads: true,
                            /*
                            URL of our upload handler (for more details check: https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_url)
                            images_upload_url: 'postAcceptor.php',
                            here we add custom filepicker only to Image dialog
                            */
                            file_picker_types: 'image',
                            /* and here's our custom image picker*/
                            file_picker_callback: (cb, value, meta) => {
                            const input = document.createElement('input');
                            input.setAttribute('type', 'file');
                            input.setAttribute('accept', 'image/*');
                        
                            input.addEventListener('change', (e) => {
                                const file = e.target.files[0];
                        
                                const reader = new FileReader();
                                reader.addEventListener('load', () => {
                                /*
                                    Note: Now we need to register the blob in TinyMCEs image blob
                                    registry. In the next release this part hopefully won't be
                                    necessary, as we are looking to handle it internally.
                                */
                                const id = 'blobid' + (new Date()).getTime();
                                const blobCache =  tinymce.activeEditor.editorUpload.blobCache;
                                const base64 = reader.result.split(',')[1];
                                const blobInfo = blobCache.create(id, file, base64);
                                blobCache.add(blobInfo);
                        
                                /* call the callback and populate the Title field with the file name */
                                cb(blobInfo.blobUri(), { title: file.name });
                                });
                                reader.readAsDataURL(file);
                            });
                        
                            input.click();
                            },
                            license_key: 'gpl',
                            language: ''+idioma+'',
                            height: 550,
                            menubar: true,
                            plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount', 'accordion' 
                            ],
                            toolbar:[
                                { name: 'Historial', items: [ 'undo', 'redo' ] },
                                { name: 'Formato', items: [ 'styles', 'fontsizeinput', 'bold', 'italic', 'forecolor', 'backcolor' ] },
                                { name: 'Insertar', items: [ 'link', 'image', 'table', 'accordion' ] },
                                { name: 'Alinear', items: [ 'alignleft', 'aligncenter', 'alignright', 'alignjustify' ] },
                                { name: 'Listas', items: [ 'bullist', 'numlist', 'checklist' ] },
                                { name: 'Sangría', items: [ 'outdent', 'indent' ] },
                                { name: 'Opciones', items: [ 'removeformat', 'help' ] }
                            ]
                        }}
                    /> 
                <a className="listo" onMouseUp={submit}><img className="" alt="listo" src="../../listo.svg"/></a>
            </div>
        </div>
    )
}