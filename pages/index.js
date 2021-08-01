import {useEffect, useState} from "react";
import QRCode from "react-qr-code";
import Editor from "react-simple-code-editor";
import {highlight, languages} from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import {setQueryParam, useQueryParams, useWindowSize} from "../utils";
import Head from "next/head";
import {useRouter} from 'next/router';

export default function App() {

    let ssr = typeof window === 'undefined';
    const query = useSSRQueryParams();
    let imageText = query.text ? query.text : '';
    let [text, setText] = useState(``);
    let [width] = useWindowSize(ssr);
    let queryParams = useQueryParams();

    useEffect(() => {
        let defaultText = 'Enter your text here...';
        let queryParam = queryParams['text'];
        if (queryParam) defaultText = decodeURIComponent(queryParam);
        setText(defaultText);
    }, []);

    useEffect(() => {
        setQueryParam('text', text);
    }, [text]);


    function handleChangeInput(text) {
        setText(text);
    }

    return (
        <div className="App">
            <Head>
                <title>QR Generator</title>
                <meta name="description" content="Simple QR Generator"/>
                <meta property="twitter:card" content="summary_large_image"/>
                <meta property="twitter:site" content="QR Generator"/>
                <meta property="twitter:title" content="QR Generator"/>
                <meta property="twitter:description" content="Crea Códigos QR de manera simple"/>
                <meta property="twitter:image"
                      content={`https://ssr-qr-generator.vercel.app/api/image?text=${imageText}`}/>

                <meta property="og:image" content={`https://ssr-qr-generator.vercel.app/api/image?text=${imageText}`}/>
                <meta property="og:title" content="QR Generator"/>
                <meta property="og:type" content="website"/>
                <meta property="og:url" content="https://simple-qr-generator.web.app/"/>
                <meta property="og:description" content="Crea Códigos QR de manera simple"/>
                <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png"/>
                <meta name="keywords" content="QR, code, simple, reactjs"/>
                <meta name="author" content="Andrés Gardiol"/>
                <link href="https://fonts.googleapis.com/css?family=Fira+Mono" rel="stylesheet"/>
            </Head>
            <QRCode className="qr" value={text} size={getSize(width)} level="M"/>
            <Editor className="editor"
                    value={text}
                    onValueChange={handleChangeInput}
                    highlight={(code) => highlight(code, {}, languages.json)}
                    padding={10}
                    style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        fontSize: 12,
                    }}
            />
        </div>
    );
}

function useSSRQueryParams() {
    const router = useRouter();
    return router.query;
}

function getSize(width) {
    if (!width) return 200;
    if (width > 500) return 500;
    return width - 80;
}
