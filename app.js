// Register service worker for offline support
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(err => {
        console.log('Service Worker registration failed:', err);
    });
}

// Install prompt handling
let deferredPrompt;
const installPrompt = document.getElementById('installPrompt');
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installPrompt.classList.add('show');
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            deferredPrompt = null;
            installPrompt.classList.remove('show');
        }
    });
}

window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    installPrompt.classList.remove('show');
});

// Plate planner logic
const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const cols = 12;

const colorMap = {
    none: '#E8E6F0',
    control: '#7F77DD',
    treatment1: '#1D9E75',
    treatment2: '#D85A30',
    treatment3: '#D4537E',
    blank: '#888780',
    standard: '#378ADD',
    qc: '#639922'
};

const labelMap = {
    none: 'Empty',
    control: 'Control',
    treatment1: 'Treatment 1',
    treatment2: 'Treatment 2',
    treatment3: 'Treatment 3',
    blank: 'Blank',
    standard: 'Standard',
    qc: 'QC'
};

const plateData = {};

// Initialize plate on page load
document.addEventListener('DOMContentLoaded', () => {
    initPlate();
    loadPlateFromStorage();
});

function initPlate() {
    const tbody = document.getElementById('plateBody');
    rows.forEach(row => {
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = row;
        tr.appendChild(th);
        
        for (let col = 1; col <= cols; col++) {
            const td = document.createElement('td');
            const wellId = `${row}${col}`;
            plateData[wellId] = 'none';
            td.id = wellId;
            td.style.background = colorMap.none;
            td.title = wellId;
            td.addEventListener('click', () => toggleWell(wellId));
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    });
}

function toggleWell(wellId) {
    const sampleType = document.getElementById('sampleType').value;
    if (sampleType === 'none') return;
    
    const td = document.getElementById(wellId);
    if (plateData[wellId] === sampleType) {
        plateData[wellId] = 'none';
        td.style.background = colorMap.none;
    } else {
        plateData[wellId] = sampleType;
        td.style.background = colorMap[sampleType];
    }
    savePlateToStorage();
}

function clearPlate() {
    if (confirm('Clear all wells?')) {
        rows.forEach(row => {
            for (let col = 1; col <= cols; col++) {
                const wellId = `${row}${col}`;
                plateData[wellId] = 'none';
                const td = document.getElementById(wellId);
                td.style.background = colorMap.none;
            }
        });
        savePlateToStorage();
    }
}

function downloadLayout() {
    let textContent = '96-Well Plate Layout\n';
    textContent += '====================\n\n';
    
    rows.forEach(row => {
        for (let col = 1; col <= cols; col++) {
            const wellId = `${row}${col}`;
            const sampleType = plateData[wellId];
            if (sampleType !== 'none') {
                textContent += `${wellId}: ${labelMap[sampleType]}\n`;
            }
        }
    });
    
    textContent += '\n\nExport Summary:\n';
    const summary = getSummary();
    Object.entries(summary).forEach(([type, count]) => {
        if (count > 0) {
            textContent += `${labelMap[type]}: ${count} wells\n`;
        }
    });
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plate-layout.txt';
    a.click();
    URL.revokeObjectURL(url);
}

function printPDF() {
    const element = document.getElementById('printContainer');
    const opt = {
        margin: [5, 5, 5, 5],
        filename: 'plate-layout.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: [] }
    };
    
    html2pdf().set(opt).from(element).save();
}

function getSummary() {
    const summary = {
        none: 0,
        control: 0,
        treatment1: 0,
        treatment2: 0,
        treatment3: 0,
        blank: 0,
        standard: 0,
        qc: 0
    };
    
    rows.forEach(row => {
        for (let col = 1; col <= cols; col++) {
            const wellId = `${row}${col}`;
            const sampleType = plateData[wellId];
            summary[sampleType]++;
        }
    });
    
    return summary;
}

// Local storage functions
function savePlateToStorage() {
    try {
        localStorage.setItem('plateData', JSON.stringify(plateData));
    } catch (e) {
        console.log('Could not save to localStorage:', e);
    }
}

function loadPlateFromStorage() {
    try {
        const saved = localStorage.getItem('plateData');
        if (saved) {
            const loadedData = JSON.parse(saved);
            rows.forEach(row => {
                for (let col = 1; col <= cols; col++) {
                    const wellId = `${row}${col}`;
                    if (loadedData[wellId]) {
                        plateData[wellId] = loadedData[wellId];
                        const td = document.getElementById(wellId);
                        td.style.background = colorMap[loadedData[wellId]];
                    }
                }
            });
        }
    } catch (e) {
        console.log('Could not load from localStorage:', e);
    }
}
