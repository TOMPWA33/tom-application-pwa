// Simple PWA Application
class SimpleApp {
    constructor() {
        this.installPrompt = null;
        this.isInstalled = false;
        this.db = null;
        this.init();
    }

    async init() {
        console.log('🚀 Initialisation Simple App');
        
        // Initialiser IndexedDB
        await this.initDB();
        
        // Configurer les événements
        this.setupEventListeners();
        
        // Initialiser PWA
        this.setupPWA();
        
        // Vérifier statut installation
        this.checkInstallStatus();
        
        // Enregistrer Service Worker
        this.registerServiceWorker();
        
        // Mettre à jour statut connexion
        this.updateConnectionStatus();
        
        console.log('✅ Simple App initialisée');
    }

    // === IndexedDB Setup ===
    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('SimpleAppDB', 1);
            
            request.onerror = () => {
                console.error('❌ Erreur IndexedDB');
                resolve(); // Continue sans DB
            };
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('✅ IndexedDB initialisé');
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('preferences')) {
                    db.createObjectStore('preferences', { keyPath: 'key' });
                }
                console.log('🔧 IndexedDB mis à jour');
            };
        });
    }

    async saveToDB(key, value) {
        if (!this.db) return false;
        
        try {
            const transaction = this.db.transaction(['preferences'], 'readwrite');
            const store = transaction.objectStore('preferences');
            await store.put({ key, value, timestamp: Date.now() });
            console.log(`💾 Sauvegardé: ${key}`);
            return true;
        } catch (error) {
            console.error('❌ Erreur sauvegarde:', error);
            return false;
        }
    }

    async loadFromDB(key) {
        if (!this.db) return null;
        
        try {
            const transaction = this.db.transaction(['preferences'], 'readonly');
            const store = transaction.objectStore('preferences');
            const request = store.get(key);
            
            return new Promise((resolve) => {
                request.onsuccess = () => {
                    const result = request.result;
                    if (result) {
                        console.log(`📂 Chargé: ${key}`);
                        resolve(result.value);
                    } else {
                        resolve(null);
                    }
                };
                request.onerror = () => resolve(null);
            });
        } catch (error) {
            console.error('❌ Erreur lecture:', error);
            return null;
        }
    }

    // === Event Listeners ===
    setupEventListeners() {
        // Bouton popup
        const popupBtn = document.getElementById('popup-btn');
        if (popupBtn) {
            popupBtn.addEventListener('click', () => this.showPopup());
        }

        // Bouton page 2
        const page2Btn = document.getElementById('page2-btn');
        if (page2Btn) {
            page2Btn.addEventListener('click', () => this.goToPage2());
        }

        // Menu déroulant
        const optionsMenu = document.getElementById('options-menu');
        if (optionsMenu) {
            optionsMenu.addEventListener('change', (e) => this.handleMenuSelection(e.target.value));
        }

        // Bouton installation
        const installBtn = document.getElementById('install-btn');
        if (installBtn) {
            installBtn.addEventListener('click', () => this.installApp());
        }

        // Popup events
        this.setupPopupEvents();

        // PWA events
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.installPrompt = e;
            this.showInstallButton();
            console.log('💾 Installation disponible');
        });

        window.addEventListener('appinstalled', () => {
            this.isInstalled = true;
            this.updateInstallStatus('Application installée');
            this.hideInstallButton();
            console.log('🎉 App installée');
        });

        // Connexion events
        window.addEventListener('online', () => this.updateConnectionStatus());
        window.addEventListener('offline', () => this.updateConnectionStatus());
    }

    setupPopupEvents() {
        const overlay = document.getElementById('popup-overlay');
        const closeBtn = document.getElementById('popup-close');
        const okBtn = document.getElementById('popup-ok');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hidePopup());
        }

        if (okBtn) {
            okBtn.addEventListener('click', () => this.hidePopup());
        }

        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) this.hidePopup();
            });
        }

        // Fermer avec Echap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.hidePopup();
        });
    }

    // === Menu Actions ===
    handleMenuSelection(value) {
        if (!value) return;
        
        console.log('📋 Menu sélectionné:', value);
        
        // Sauvegarder la sélection
        this.saveToDB('lastMenuSelection', value);
        
        // Afficher popup avec contenu dynamique
        let title = 'Information';
        let content = '';
        
        switch (value) {
            case 'data':
                title = 'Gestion des données';
                content = `
                    <p><strong>Fonctionnalités disponibles :</strong></p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li>📊 Visualisation des données</li>
                        <li>📁 Import/Export de fichiers</li>
                        <li>🔍 Recherche avancée</li>
                        <li>📈 Rapports et statistiques</li>
                    </ul>
                `;
                break;
                
            case 'settings':
                title = 'Paramètres';
                content = `
                    <p><strong>Options de configuration :</strong></p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li>🎨 Thème et apparence</li>
                        <li>🔔 Notifications</li>
                        <li>🌐 Langue et région</li>
                        <li>🔒 Sécurité et confidentialité</li>
                    </ul>
                `;
                break;
                
            case 'help':
                title = 'Aide et support';
                content = `
                    <p><strong>Ressources disponibles :</strong></p>
                    <ul style="margin-left: 20px; margin-top: 10px;">
                        <li>📖 Documentation utilisateur</li>
                        <li>❓ FAQ et questions courantes</li>
                        <li>🎥 Tutoriels vidéo</li>
                        <li>📧 Contact support technique</li>
                    </ul>
                `;
                break;
                
            case 'about':
                title = 'À propos';
                content = `
                    <p><strong>Simple App Demo v1.0</strong></p>
                    <p style="margin-top: 10px;">Application Progressive Web App de démonstration.</p>
                    <p style="margin-top: 10px;"><strong>Fonctionnalités :</strong></p>
                    <ul style="margin-left: 20px; margin-top: 5px;">
                        <li>✅ Mode hors ligne</li>
                        <li>✅ Installation sur appareil</li>
                        <li>✅ Interface responsive</li>
                        <li>✅ Stockage local sécurisé</li>
                    </ul>
                `;
                break;
        }
        
        this.showCustomPopup(title, content);
    }

    // === Popup Management ===
    showPopup() {
        const overlay = document.getElementById('popup-overlay');
        if (overlay) {
            overlay.classList.add('active');
            console.log('📝 Popup affiché');
        }
    }

    hidePopup() {
        const overlay = document.getElementById('popup-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            console.log('❌ Popup fermé');
        }
    }

    showCustomPopup(title, content) {
        const popupTitle = document.querySelector('.popup-title');
        const dynamicContent = document.getElementById('popup-dynamic-content');
        
        if (popupTitle) {
            popupTitle.textContent = title;
        }
        
        if (dynamicContent) {
            dynamicContent.innerHTML = content;
        }
        
        this.showPopup();
    }

    // === Navigation ===
    goToPage2() {
        console.log('📄 Navigation vers Page 2');
        window.location.href = 'page2.html';
    }

    // === PWA Functions ===
    setupPWA() {
        console.log('🔧 Configuration PWA');
        
        // Vérifier support Service Worker
        if ('serviceWorker' in navigator) {
            console.log('✅ Service Worker supporté');
        }
        
        // Vérifier mode standalone
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.isInstalled = true;
            console.log('📱 Mode standalone détecté');
        }
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('./sw.js');
                console.log('✅ Service Worker enregistré:', registration.scope);
                
                // Écouter les mises à jour
                registration.addEventListener('updatefound', () => {
                    console.log('🔄 Mise à jour disponible');
                });
                
            } catch (error) {
                console.error('❌ Erreur Service Worker:', error);
            }
        }
    }

    checkInstallStatus() {
        if (this.isInstalled || 
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true) {
            this.updateInstallStatus('App installée');
            this.hideInstallButton();
        } else {
            this.updateInstallStatus('Web App');
        }
    }

    showInstallButton() {
        const installBtn = document.getElementById('install-btn');
        if (installBtn && !this.isInstalled) {
            installBtn.style.display = 'block';
            console.log('📲 Bouton installation affiché');
        }
    }

    hideInstallButton() {
        const installBtn = document.getElementById('install-btn');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    }

    async installApp() {
        if (this.installPrompt) {
            try {
                const result = await this.installPrompt.prompt();
                console.log('👤 Installation:', result.outcome);
                
                if (result.outcome === 'accepted') {
                    console.log('✅ Installation acceptée');
                } else {
                    console.log('❌ Installation refusée');
                }
                
                this.installPrompt = null;
            } catch (error) {
                console.error('❌ Erreur installation:', error);
            }
        } else {
            this.showCustomPopup('Installation', 
                '<p>L\'installation automatique n\'est pas disponible sur ce navigateur.</p>' +
                '<p>Vous pouvez ajouter cette page à votre écran d\'accueil manuellement via les options de votre navigateur.</p>'
            );
        }
    }

    updateInstallStatus(status) {
        const statusElement = document.getElementById('install-status');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }

    updateConnectionStatus() {
        const statusElement = document.getElementById('connection-status');
        if (statusElement) {
            const isOnline = navigator.onLine;
            statusElement.textContent = isOnline ? 'En ligne' : 'Hors ligne';
            statusElement.style.color = isOnline ? 'var(--teal)' : 'var(--red)';
            console.log(`🌐 Statut: ${isOnline ? 'En ligne' : 'Hors ligne'}`);
        }
    }

    // === Utility Functions ===
    async loadUserPreferences() {
        const lastMenu = await this.loadFromDB('lastMenuSelection');
        if (lastMenu) {
            const menuSelect = document.getElementById('options-menu');
            if (menuSelect) {
                menuSelect.value = lastMenu;
            }
        }
    }
}

// === Initialization ===
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🌟 DOM chargé');
    window.simpleApp = new SimpleApp();
    
    // Charger préférences utilisateur
    setTimeout(async () => {
        await window.simpleApp.loadUserPreferences();
    }, 500);
});

// === Error Handling ===
window.addEventListener('error', (event) => {
    console.error('❌ Erreur:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Promise rejetée:', event.reason);
    event.preventDefault();
});

// === Debug Info ===
console.log('🔍 Info navigateur:');
console.log('- User Agent:', navigator.userAgent.substring(0, 50) + '...');
console.log('- Standalone:', window.navigator.standalone);
console.log('- Display Mode:', window.matchMedia('(display-mode: standalone)').matches);
console.log('- Online:', navigator.onLine);
console.log('- Service Worker:', 'serviceWorker' in navigator);
console.log('- IndexedDB:', 'indexedDB' in window);