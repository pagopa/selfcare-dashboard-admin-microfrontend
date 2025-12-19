/* eslint-disable functional/immutable-data */
import { useEffect, useRef } from "react";
import pell from "pell";
import styles from "../utils/contractEditor.module.css";

type Props = {
  productId: string;
};

export const ContractEditor = ({ productId }: Props) => {
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) {
            return;
        }

        const element = document.getElementById('contracteditor');
        if (element) {
            const editor = pell.init({
                element,
                defaultParagraphSeparator: 'p',
                actions: [
                    'bold',
                    'italic',
                    'underline',
                    'ulist',
                    'link'
                ],
                onChange: html => html
            });
            editor.content.innerHTML = ``;
            editor.content.focus();

            const actionBar = document.querySelector('.pell-actionbar');
            if (actionBar) {
                const handleSelctChange = (e: Event) => {
                    const select = e.target as HTMLSelectElement;
                    const value = select.value;
                    editor.content.focus();
                    pell.exec('insertHTML', value);
                    select.selectedIndex = 0;
                };

                const placeholderSelect = document.createElement('select');
                placeholderSelect.id = 'placeholder';
                placeholderSelect.innerHTML =
                `
                    <option value="" disabled selected>Inserisci segnaposto</option>
                    <option value="\${taxCode}">Codice fiscale</option>
                    <option value="\${institutionName}">Nome ente</option>
                    <option value="\${firstName}">Nome</option>
                    <option value="\${lastName}">Cognome</option>
                `;
                placeholderSelect.onchange = (e) => handleSelctChange(e);

                const headingSelect = document.createElement('select');
                headingSelect.id = 'placeholder';
                headingSelect.innerHTML =
                `
                    <option value="" disabled selected>Inserisci titolo</option>
                    <option value="<h1>Titolo 1</h1>">Titolo 1</option>
                    <option value="<h2>Titolo 2</h2>">Titolo 2</option>
                    <option value="<h3>Titolo 3</h3>">Titolo 3</option>
                    <option value="<h4>Titolo 4</h4>">Titolo 4</option>
                    <option value="<h5>Titolo 5</h5>">Titolo 5</option>
                    <option value="<h6>Titolo 6</h6>">Titolo 6</option>
                `;
                headingSelect.onchange = (e) => handleSelctChange(e);

                actionBar.appendChild(headingSelect);
                actionBar.appendChild(placeholderSelect);
            }

            initialized.current = true;
        }
    }, []);

    return (
        <div className={styles.contractEditorContainer}>
            <div style={{overflow: 'auto'}}>
                <img className={styles.pagopaHeaderLogo} src="https://selfcare.pagopa.it/assets/logo_pagopacorp.png"/>
                <img className={styles.productHeaderLogo} src={`https://selfcare.pagopa.it/resources/products/${productId}/logo.png`}/>
            </div>
            <div>
                <div id="contracteditor" className={styles.contractEditor}/>
            </div>
            <div>
                <p className={styles.pagopaFooterInfo}>
                    PagoPA S.p.A.<br />
                    società per azioni con socio unico<br />
                    capitale sociale di euro 1,000,000 interamente versato<br />
                    sede legale in Roma, Piazza Colonna 370, CAP 00187<br />
                    n. di iscrizione a Registro Imprese di Roma, CF e P.IVA 15376371009<br />
                </p>
                <img className={styles.pagopaFooterLogo} src="https://selfcare.pagopa.it/assets/icon_pagopacorp_rounded_primary.png" />
            </div>
        </div>
    );
};
