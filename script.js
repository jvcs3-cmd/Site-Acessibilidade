


let currentFontSize = 100; 
const MIN_FONT_SIZE = 80;
const MAX_FONT_SIZE = 150;
const FONT_STEP = 10;


const THEMES = {
    light: 'light-theme',
    dark: 'dark-theme',
    highContrast: 'high-contrast-theme'
};

const STORAGE_KEYS = {
    fontSize: 'edacessivel-font-size',
    theme: 'edacessivel-theme',
    contrast: 'edacessivel-high-contrast',
    spacing: 'edacessivel-spacing',
    dyslexia: 'edacessivel-dyslexia'
};


document.addEventListener('DOMContentLoaded', function() {
    initializeAccessibility();
    setupEventListeners();
    loadUserPreferences();
});


function initializeAccessibility() {
    
    if (!document.body.classList.contains('dark-theme') &&
        !document.body.classList.contains('high-contrast-theme')) {
        document.body.classList.add('light-theme');
    }
    
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        
        const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
        if (!savedTheme) {
            applyTheme('dark');
        }
    }
}

function setupEventListeners() {

    document.getElementById('font-increase-btn').addEventListener('click', increaseFontSize);
    document.getElementById('font-decrease-btn').addEventListener('click', decreaseFontSize);
    document.getElementById('font-reset-btn').addEventListener('click', resetFontSize);
    document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);
    document.getElementById('contrast-toggle-btn').addEventListener('click', toggleContrast);
    document.getElementById('spacing-toggle-btn').addEventListener('click', toggleSpacing);
    document.getElementById('dyslexia-toggle-btn').addEventListener('click', toggleDyslexiaFont);

    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            updateActiveNavLink(this);
        });
    });

    
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    
    document.querySelectorAll('.course-button').forEach(button => {
        button.addEventListener('click', handleCourseEnrollment);
    });

    
    document.addEventListener('keydown', handleKeyboardShortcuts);

    
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem(STORAGE_KEYS.theme)) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}


function increaseFontSize() {
    if (currentFontSize < MAX_FONT_SIZE) {
        currentFontSize += FONT_STEP;
        applyFontSize();
        saveFontSize();
        announceAccessibilityChange(`Tamanho da fonte aumentado para ${currentFontSize}%`);
    }
}

function decreaseFontSize() {
    if (currentFontSize > MIN_FONT_SIZE) {
        currentFontSize -= FONT_STEP;
        applyFontSize();
        saveFontSize();
        announceAccessibilityChange(`Tamanho da fonte diminuído para ${currentFontSize}%`);
    }
}

function resetFontSize() {
    currentFontSize = 100;
    applyFontSize();
    saveFontSize();
    announceAccessibilityChange('Tamanho da fonte redefinido para padrão');
}

function applyFontSize() {
    const percentageMultiplier = currentFontSize / 100;
    document.documentElement.style.fontSize = (16 * percentageMultiplier) + 'px';
}

function saveFontSize() {
    localStorage.setItem(STORAGE_KEYS.fontSize, currentFontSize);
}


function toggleTheme() {
    const currentTheme = getCurrentTheme();
    let newTheme;

    if (currentTheme === 'dark') {
        newTheme = 'light';
    } else if (currentTheme === 'light') {
        newTheme = 'dark';
    } else {
        newTheme = 'light';
    }

    applyTheme(newTheme);
    saveTheme(newTheme);
}

function applyTheme(themeName) {
    
    document.body.classList.remove('light-theme', 'dark-theme', 'high-contrast-theme');
    
    
    if (themeName === 'dark') {
        document.body.classList.add('dark-theme');
        updateThemeButton('🌙');
    } else if (themeName === 'high-contrast') {
        document.body.classList.add('high-contrast-theme');
        updateThemeButton('◐');
    } else {
        document.body.classList.add('light-theme');
        updateThemeButton('☀️');
    }

    const themeName_display = themeName === 'dark' ? 'Tema Escuro' : 
                              themeName === 'high-contrast' ? 'Alto Contraste' : 'Tema Claro';
    announceAccessibilityChange(`${themeName_display} ativado`);
}

function getCurrentTheme() {
    if (document.body.classList.contains('dark-theme')) {
        return 'dark';
    } else if (document.body.classList.contains('high-contrast-theme')) {
        return 'high-contrast';
    } else {
        return 'light';
    }
}

function updateThemeButton(emoji) {
    const themeBtn = document.getElementById('theme-toggle-btn');
    themeBtn.querySelector('[aria-hidden="true"]').textContent = emoji;
}

function saveTheme(themeName) {
    localStorage.setItem(STORAGE_KEYS.theme, themeName);
}


function toggleContrast() {
    const contrastBtn = document.getElementById('contrast-toggle-btn');
    const isHighContrast = document.body.classList.contains('high-contrast-theme');

    if (isHighContrast) {
        
        const savedTheme = localStorage.getItem(STORAGE_KEYS.theme) || 'light';
        applyTheme(savedTheme);
        localStorage.removeItem(STORAGE_KEYS.contrast);
        contrastBtn.classList.remove('active');
        announceAccessibilityChange('Alto contraste desativado');
    } else {
        
        applyTheme('high-contrast');
        localStorage.setItem(STORAGE_KEYS.contrast, 'true');
        contrastBtn.classList.add('active');
        announceAccessibilityChange('Alto contraste ativado');
    }
}


function toggleSpacing() {
    const spacingBtn = document.getElementById('spacing-toggle-btn');
    const dyslexiaBtn = document.getElementById('dyslexia-toggle-btn');
    const hasSpacing = document.body.classList.contains('increase-spacing');

    if (hasSpacing) {
        document.body.classList.remove('increase-spacing');
        localStorage.removeItem(STORAGE_KEYS.spacing);
        if (spacingBtn) spacingBtn.classList.remove('active');
        if (dyslexiaBtn) dyslexiaBtn.classList.remove('active');
        announceAccessibilityChange('Espaçamento aumentado desativado');
    } else {
        document.body.classList.add('increase-spacing');
        localStorage.setItem(STORAGE_KEYS.spacing, 'true');
        if (spacingBtn) spacingBtn.classList.add('active');
        if (dyslexiaBtn) dyslexiaBtn.classList.add('active');
        announceAccessibilityChange('Espaçamento aumentado ativado. Melhor para leitura com dislexia');
    }
}


function toggleDyslexiaFont() {
    
    console.log('dyslexia button pressed — delegando para toggleSpacing');
    toggleSpacing();

    
    const dyslexiaBtn = document.getElementById('dyslexia-toggle-btn');
    const spacingBtn = document.getElementById('spacing-toggle-btn');
    if (spacingBtn && dyslexiaBtn) {
        if (spacingBtn.classList.contains('active')) {
            dyslexiaBtn.classList.add('active');
        } else {
            dyslexiaBtn.classList.remove('active');
        }
    }
}


function updateActiveNavLink(clickedLink) {
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    
    clickedLink.classList.add('active');
}


window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - 200 && window.pageYOffset < sectionTop + sectionHeight - 200) {
            currentSection = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === currentSection) {
            link.classList.add('active');
        }
    });
});


function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    const feedback = document.getElementById('form-feedback');

    
    if (!name || !email || !subject || !message) {
        showFormError('Por favor, preencha todos os campos');
        return;
    }

    if (!isValidEmail(email)) {
        showFormError('Por favor, insira um e-mail válido');
        return;
    }

    
    feedback.textContent = 'Enviando mensagem...';
    feedback.classList.remove('error');
    feedback.classList.remove('success');

    setTimeout(() => {
        showFormSuccess('Mensagem enviada com sucesso! Obrigado por entrar em contato.');
        form.reset();
    }, 1500);
}

function showFormError(message) {
    const feedback = document.getElementById('form-feedback');
    feedback.textContent = '❌ ' + message;
    feedback.classList.remove('success');
    feedback.classList.add('error');
    announceAccessibilityChange('Erro: ' + message);
}

function showFormSuccess(message) {
    const feedback = document.getElementById('form-feedback');
    feedback.textContent = '✅ ' + message;
    feedback.classList.remove('error');
    feedback.classList.add('success');
    announceAccessibilityChange(message);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


function handleCourseEnrollment(e) {
    const button = e.target;
    const courseCard = button.closest('.course-card');
    const courseTitle = courseCard.querySelector('h3').textContent;

    announceAccessibilityChange(`Inscrição iniciada para ${courseTitle}. Por favor, complete seu cadastro para continuar.`);
    
    
}


function handleKeyboardShortcuts(e) {
    
    if (e.altKey && e.key === '1') {
        increaseFontSize();
        e.preventDefault();
    }
    
    else if (e.altKey && e.key === '2') {
        decreaseFontSize();
        e.preventDefault();
    }
    
    else if (e.altKey && e.key === '3') {
        resetFontSize();
        e.preventDefault();
    }
    
    else if (e.altKey && e.key === '4') {
        toggleTheme();
        e.preventDefault();
    }
    
    else if (e.altKey && e.key === '5') {
        toggleContrast();
        e.preventDefault();
    }
    
    else if (e.altKey && e.key === '6') {
        toggleSpacing();
        e.preventDefault();
    }
    
    else if (e.altKey && e.key === '7') {
        toggleDyslexiaFont();
        e.preventDefault();
    }
    
    else if (e.altKey && e.key === '0') {
        document.getElementById('main-content').focus();
        e.preventDefault();
    }
}


function announceAccessibilityChange(message) {
    
    let announcement = document.getElementById('accessibility-announcement');
    
    if (!announcement) {
        announcement = document.createElement('div');
        announcement.id = 'accessibility-announcement';
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        document.body.appendChild(announcement);
    }
    
    announcement.textContent = message;
}


function loadUserPreferences() {
    
    const savedFontSize = localStorage.getItem(STORAGE_KEYS.fontSize);
    if (savedFontSize) {
        currentFontSize = parseInt(savedFontSize);
        applyFontSize();
    }

    
    const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
    if (savedTheme) {
        applyTheme(savedTheme);
    }

    
    const savedContrast = localStorage.getItem(STORAGE_KEYS.contrast);
    if (savedContrast === 'true') {
        const contrastBtn = document.getElementById('contrast-toggle-btn');
        applyTheme('high-contrast');
        contrastBtn.classList.add('active');
    }

    
    const savedSpacing = localStorage.getItem(STORAGE_KEYS.spacing);
    const savedDyslexia = localStorage.getItem(STORAGE_KEYS.dyslexia);
    if (savedSpacing === 'true' || savedDyslexia === 'true') {
        const spacingBtn = document.getElementById('spacing-toggle-btn');
        const dyslexiaBtn = document.getElementById('dyslexia-toggle-btn');
        document.body.classList.add('increase-spacing');
        if (spacingBtn) spacingBtn.classList.add('active');
        if (dyslexiaBtn) dyslexiaBtn.classList.add('active');
    }
}


const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
    document.documentElement.style.scrollBehavior = 'auto';
}


function setupReadingMode() {
    const readingModeBtn = document.createElement('button');
    readingModeBtn.id = 'reading-mode-btn';
    readingModeBtn.className = 'control-btn';
    readingModeBtn.setAttribute('aria-label', 'Modo de leitura');
    readingModeBtn.textContent = '📖';
    
   
}


function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        speechSynthesis.speak(utterance);
    }
}


function addImageDescriptions() {
    const images = document.querySelectorAll('img:not([alt])');
    images.forEach((img, index) => {
        img.setAttribute('alt', `Imagem descritiva ${index + 1}`);
    });
}


function validatePageAccessibility() {
    const issues = [];

    
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        if (!heading.textContent.trim()) {
            issues.push('Heading vazio encontrado');
        }
    });

    
    document.querySelectorAll('a').forEach(link => {
        if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
            issues.push('Link sem texto encontrado');
        }
    });

    
    document.querySelectorAll('button').forEach(button => {
        if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
            issues.push('Botão sem texto encontrado');
        }
    });

    if (issues.length > 0) {
        console.warn('Problemas de acessibilidade encontrados:', issues);
    }
}


if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    validatePageAccessibility();
}


console.log('%c🎯 EduAcessível - Atalhos de Teclado', 'font-size: 16px; font-weight: bold; color: #d4af37;');
console.log('%cAlt + 1: Aumentar fonte', 'font-size: 14px;');
console.log('%cAlt + 2: Diminuir fonte', 'font-size: 14px;');
console.log('%cAlt + 3: Resetar fonte', 'font-size: 14px;');
console.log('%cAlt + 4: Alternar tema', 'font-size: 14px;');
console.log('%cAlt + 5: Alto contraste', 'font-size: 14px;');
console.log('%cAlt + 6: Espaçamento aumentado', 'font-size: 14px;');
console.log('%cAlt + 7: Modo dislexia (fonte otimizada)', 'font-size: 14px;');
console.log('%cAlt + 0: Pular para conteúdo principal', 'font-size: 14px;');
