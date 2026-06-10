import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const ATLAS_URL = "https://canazachyub.github.io/atlas-anatomico-interactivo/"

const Body: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return (
    <div id="quartz-body">
      {children}

      {/* ── Botón flotante Atlas ─────────────────────────────────── */}
      <button id="atlas-fab" title="Abrir Atlas Anatómico Interactivo" aria-label="Atlas">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
        <span>Atlas</span>
      </button>

      {/* ── Overlay con iframe ───────────────────────────────────── */}
      <div id="atlas-overlay" role="dialog" aria-modal="true" aria-label="Atlas Anatómico">
        <div id="atlas-topbar">
          <span id="atlas-title">🫀 Atlas Anatómico Interactivo</span>
          <div id="atlas-controls">
            <a id="atlas-external" href={ATLAS_URL} target="_blank" rel="noopener" title="Abrir en nueva pestaña">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
            <button id="atlas-close" title="Cerrar (Esc)" aria-label="Cerrar atlas">✕</button>
          </div>
        </div>
        <iframe
          id="atlas-iframe"
          src={ATLAS_URL}
          title="Atlas Anatómico Interactivo"
          allow="fullscreen"
          loading="lazy"
        />
        <div id="atlas-blocked" style="display:none">
          <p>⚠️ El atlas no puede cargarse dentro de esta página.</p>
          <a href={ATLAS_URL} target="_blank" rel="noopener">Abrir en nueva pestaña →</a>
        </div>
      </div>

      {/* ── Estilos ──────────────────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{__html: `
        #atlas-fab {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          z-index: 900;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1.1rem;
          background: var(--secondary, #284b63);
          color: #fff;
          border: none;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          box-shadow: 0 4px 18px rgba(0,0,0,0.25);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        #atlas-fab:hover {
          transform: translateY(-3px);
          box-shadow: 0 7px 22px rgba(0,0,0,0.32);
        }
        #atlas-overlay {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 9999;
          flex-direction: column;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          animation: atlas-fadein 0.2s ease;
        }
        #atlas-overlay.open { display: flex; }
        @keyframes atlas-fadein {
          from { opacity: 0; transform: scale(0.98); }
          to   { opacity: 1; transform: scale(1); }
        }
        #atlas-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.6rem 1.2rem;
          background: var(--secondary, #284b63);
          color: #fff;
          font-size: 0.9rem;
          font-weight: 600;
          flex-shrink: 0;
        }
        #atlas-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        #atlas-external {
          color: #fff;
          opacity: 0.8;
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 4px;
          transition: opacity 0.15s;
        }
        #atlas-external:hover { opacity: 1; }
        #atlas-close {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 1.3rem;
          line-height: 1;
          cursor: pointer;
          padding: 2px 6px;
          border-radius: 4px;
          opacity: 0.8;
          transition: opacity 0.15s, background 0.15s;
        }
        #atlas-close:hover { opacity: 1; background: rgba(255,255,255,0.15); }
        #atlas-iframe {
          flex: 1;
          width: 100%;
          border: none;
          background: #fff;
        }
        #atlas-blocked {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #fff;
          gap: 1rem;
          font-size: 1rem;
        }
        #atlas-blocked a {
          color: var(--tertiary, #84a59d);
          font-weight: 600;
        }
      `}} />

      {/* ── Script ──────────────────────────────────────────────── */}
      <script dangerouslySetInnerHTML={{__html: `
        (function() {
          var fab     = document.getElementById('atlas-fab');
          var overlay = document.getElementById('atlas-overlay');
          var btn     = document.getElementById('atlas-close');
          var iframe  = document.getElementById('atlas-iframe');
          var blocked = document.getElementById('atlas-blocked');

          function openAtlas() {
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
          }
          function closeAtlas() {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
          }

          fab.addEventListener('click', openAtlas);
          btn.addEventListener('click', closeAtlas);

          // Cerrar con Escape
          document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && overlay.classList.contains('open')) closeAtlas();
          });

          // Cerrar click fuera del topbar/iframe
          overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeAtlas();
          });

          // Detectar si el iframe fue bloqueado (X-Frame-Options)
          iframe.addEventListener('load', function() {
            try {
              var doc = iframe.contentDocument || iframe.contentWindow.document;
              if (!doc || doc.title === '') {
                iframe.style.display = 'none';
                blocked.style.display = 'flex';
              }
            } catch(err) {
              // cross-origin: probablemente cargó bien
            }
          });
        })();
      `}} />
    </div>
  )
}

export default (() => Body) satisfies QuartzComponentConstructor
