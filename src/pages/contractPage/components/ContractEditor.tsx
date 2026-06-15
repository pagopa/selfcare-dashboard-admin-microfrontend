/* eslint-disable functional/immutable-data */
import { useEffect, useRef } from 'react';
import pell from 'pell';
import { ENV } from '../../../utils/env';
import styles from '../utils/contractEditor.module.css';

type Props = {
  productId: string;
  initialHtml?: string;
  onChange: (html: string) => void;
};

const cdnAsset = (path: string): string =>
  ENV.URL_CDN ? `${ENV.URL_CDN.replace(/\/$/, '')}${path}` : path;

export const ContractEditor = ({ productId, initialHtml = '', onChange }: Props) => {
  const initialized = useRef(false);
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    const element = editorRef.current;
    if (element) {
      const editor = pell.init({
        element,
        defaultParagraphSeparator: 'p',
        actions: ['bold', 'italic', 'underline', 'ulist', 'link'],
        onChange,
      });
      editor.content.innerHTML = initialHtml;
      onChange(initialHtml);
      editor.content.focus();

      const actionBar = element.querySelector('.pell-actionbar');
      if (actionBar) {
        const handleSelectChange = (e: Event) => {
          const select = e.target as HTMLSelectElement;
          const value = select.value;
          editor.content.focus();
          pell.exec('insertHTML', value);
          select.selectedIndex = 0;
        };

        const placeholderSelect = document.createElement('select');
        placeholderSelect.id = 'contract-placeholder';
        placeholderSelect.innerHTML = `
                    <option value="" disabled selected>Inserisci segnaposto</option>
                    <option value="\${taxCode}">Codice fiscale</option>
                    <option value="\${institutionName}">Nome ente</option>
                    <option value="\${firstName}">Nome</option>
                    <option value="\${lastName}">Cognome</option>
                `;
        placeholderSelect.onchange = (e) => handleSelectChange(e);

        const headingSelect = document.createElement('select');
        headingSelect.id = 'contract-heading';
        headingSelect.innerHTML = `
                    <option value="" disabled selected>Inserisci titolo</option>
                    <option value="<h1>Titolo 1</h1>">Titolo 1</option>
                    <option value="<h2>Titolo 2</h2>">Titolo 2</option>
                    <option value="<h3>Titolo 3</h3>">Titolo 3</option>
                    <option value="<h4>Titolo 4</h4>">Titolo 4</option>
                    <option value="<h5>Titolo 5</h5>">Titolo 5</option>
                    <option value="<h6>Titolo 6</h6>">Titolo 6</option>
                `;
        headingSelect.onchange = (e) => handleSelectChange(e);

        actionBar.appendChild(headingSelect);
        actionBar.appendChild(placeholderSelect);
      }

      initialized.current = true;
    }
  }, [initialHtml, onChange]);

  const pagopaHeaderLogo = cdnAsset('/assets/logo_pagopacorp.png');
  const pagopaFooterLogo = cdnAsset('/assets/icon_pagopacorp_rounded_primary.png');
  const productLogo = productId
    ? cdnAsset(`/resources/products/${productId}/logo.png`)
    : pagopaFooterLogo;

  return (
    <div className={styles.contractEditorContainer}>
      <div style={{ overflow: 'auto' }}>
        <img
          className={styles.pagopaHeaderLogo}
          src={pagopaHeaderLogo}
          alt="PagoPA"
        />
        <img
          className={styles.productHeaderLogo}
          src={productLogo}
          alt=""
          onError={(e) => {
            (e.target as HTMLImageElement).onerror = null;
            (e.target as HTMLImageElement).src = pagopaFooterLogo;
          }}
        />
      </div>
      <div>
        <div ref={editorRef} className={styles.contractEditor} />
      </div>
      <div>
        <p className={styles.pagopaFooterInfo}>
          PagoPA S.p.A.
          <br />
          società per azioni con socio unico
          <br />
          capitale sociale di euro 1,000,000 interamente versato
          <br />
          sede legale in Roma, Piazza Colonna 370, CAP 00187
          <br />
          n. di iscrizione a Registro Imprese di Roma, CF e P.IVA 15376371009
          <br />
        </p>
        <img
          className={styles.pagopaFooterLogo}
          src={pagopaFooterLogo}
          alt=""
        />
      </div>
    </div>
  );
};
