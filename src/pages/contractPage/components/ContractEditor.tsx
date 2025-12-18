import { useEffect, useRef } from "react";
import pell from "pell";
import { contractEditor, contractEditorRoot, pagoPaFooterInfo, pagoPaFooterLogo, pagoPaHeaderLogo, productHeaderLogo } from "../utils/contractEditorStyle";

function ContractEditor() {
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) {
            return;
        }

        const element = document.getElementById('contracteditor');
        if (element) {
            pell.init({
                element,
                defaultParagraphSeparator: 'p',
                actions: [
                    'bold',
                    'italic',
                    'underline',
                    'heading1',
                    'heading2'
                ],
                onChange: html => console.log(html)
            });
            // eslint-disable-next-line functional/immutable-data
            initialized.current = true;
        }
    }, []);

    return (
        <div style={contractEditorRoot}>
            <div>
                <img style={pagoPaHeaderLogo} src="https://selfcare.pagopa.it/assets/logo_pagopacorp.png"/>
                <img style={productHeaderLogo} src="https://selfcare.pagopa.it/resources/products/prod-idpay/logo.png"/>
            </div>
            <div style={{ clear: 'both' }}>
                <div id="contracteditor" style={contractEditor}/>
            </div>
            <div>
                <p style={pagoPaFooterInfo}>
                    PagoPA S.p.A.<br />
                    società per azioni con socio unico<br />
                    capitale sociale di euro 1,000,000 interamente versato<br />
                    sede legale in Roma, Piazza Colonna 370, CAP 00187<br />
                    n. di iscrizione a Registro Imprese di Roma, CF e P.IVA 15376371009<br />
                </p>
                <img style={pagoPaFooterLogo} src="https://selfcare.pagopa.it/assets/icon_pagopacorp_rounded_primary.png" />
            </div>
        </div>
    );
}

export default ContractEditor;
