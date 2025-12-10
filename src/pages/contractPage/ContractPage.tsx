import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

const ContractPage = (): JSX.Element => {
  const theme = {
  };

  const onError = (error: Error) => {
    console.error('Lexical error:', error);
  };

  const initialConfig = {
    namespace: 'ContractEditor',
    theme,
    onError,
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '32px 16px',
        backgroundColor: '#f3f4f6',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        <header style={{ marginBottom: '24px' }}>
          <h1
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: 600,
              color: '#111827',
            }}
          >
            Contract Editor
          </h1>
          <p
            style={{
              margin: '8px 0 0',
              color: '#6b7280',
              fontSize: '14px',
            }}
          >
            Compila o modifica il testo del contratto qui sotto.
          </p>
        </header>

        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '20px 24px',
            boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
            border: '1px solid #e5e7eb',
          }}
        >
          <div
            style={{
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#111827',
                }}
              >
                Testo contratto
              </h2>
              <p
                style={{
                  margin: '4px 0 0',
                  fontSize: '12px',
                  color: '#9ca3af',
                }}
              >
                Usa l’editor per inserire clausole, condizioni e dettagli.
              </p>
            </div>

            {/* Placeholder per future azioni tipo “Salva bozza”, ecc. */}
            <button
              type="button"
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                border: '1px solid #d1d5db',
                background: '#ffffff',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Salva bozza
            </button>
          </div>

          <LexicalComposer initialConfig={initialConfig}>
            {/* Wrapper per gestire placeholder e bordi dell’editor */}
            <div
              style={{
                position: 'relative',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                padding: '8px 0',
              }}
            >
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    style={{
                      minHeight: '200px',
                      padding: '8px 16px 16px',
                      outline: 'none',
                      fontSize: '14px',
                      lineHeight: 1.6,
                      color: '#111827',
                      whiteSpace: 'pre-wrap',
                    }}
                  />
                }
                placeholder={
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '16px',
                      fontSize: '14px',
                      color: '#9ca3af',
                      pointerEvents: 'none',
                    }}
                  >
                    Scrivi qui il testo del contratto...
                  </div>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <AutoFocusPlugin />
            </div>
          </LexicalComposer>
        </div>
      </div>
    </div>
  );
};

export default ContractPage;
