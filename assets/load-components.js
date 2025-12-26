async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
            
            if (elementId === 'nav-container') {
                adjustNavigationPaths();
            }
        }
    } catch (error) {
        console.error(`Ошибка загрузки компонента ${filePath}:`, error);
    }
}

function adjustNavigationPaths() {
    const currentPath = window.location.pathname;
    const isIndexPage = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === '';
    const isInSubfolder = currentPath.includes('svedeniya-ob-obrazovatelnoy-organizatsii');
    
    const navLinks = document.querySelectorAll('#nav-container .nav-link');
    const dropdownLinks = document.querySelectorAll('#nav-container .dropdown-item');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            if (href.startsWith('index.html#')) {
                if (isIndexPage) {
                    link.setAttribute('href', href.replace('index.html#', '#'));
                } else if (isInSubfolder) {
                    link.setAttribute('href', '../' + href);
                }
            }
            else if (href === 'index.html' || href === '/index.html') {
                if (isInSubfolder) {
                    link.setAttribute('href', '../index.html');
                }
            }
        }
    });
    
    dropdownLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('../')) {
            if (isInSubfolder) {
                if (href.startsWith('svedeniya-ob-obrazovatelnoy-organizatsii/')) {
                    link.setAttribute('href', href.replace('svedeniya-ob-obrazovatelnoy-organizatsii/', ''));
                }
            }
        }
    });
    
    const brandLink = document.querySelector('#nav-container .navbar-brand');
    if (brandLink) {
        if (isIndexPage) {
            brandLink.setAttribute('href', 'index.html');
        } else if (isInSubfolder) {
            brandLink.setAttribute('href', '../index.html');
        }
    }
    
    const logoImg = document.querySelector('#nav-container .navbar-logo');
    if (logoImg) {
        const currentSrc = logoImg.getAttribute('src');
        if (currentSrc && !currentSrc.startsWith('http') && !currentSrc.startsWith('/')) {
            if (isInSubfolder) {
                logoImg.setAttribute('src', '../' + currentSrc);
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const isInSubfolder = currentPath.includes('svedeniya-ob-obrazovatelnoy-organizatsii');
    const componentsPath = isInSubfolder ? '../components/' : 'components/';
    
    if (document.getElementById('nav-container')) {
        loadComponent('nav-container', componentsPath + 'nav.html');
    }
    
    if (document.getElementById('footer-container')) {
        loadComponent('footer-container', componentsPath + 'footer.html');
    }
});
