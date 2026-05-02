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

// Color palette for groups
const colorPalette = [
    '#7F77DD', // Purple
    '#1D9E75', // Green
    '#D85A30', // Orange
    '#D4537E', // Pink
    '#378ADD', // Blue
    '#639922', // Olive
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#FFE66D', // Yellow
    '#95E1D3', // Mint
    '#F38181', // Coral
    '#AA96DA', // Lavender
    '#FCBAD3', // Light Pink
    '#A8D8EA', // Light Blue
    '#FF9671', // Peach
];

const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const cols = 12;

const plateData = {}; // stores group names
const wellNames = {}; // stores well labels
const groupColors = {}; // stores assigned colors for each group
let currentWell = null;
let colorIndex = 0; // track next color to assign

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
            plateData[wellId] = ''; // empty string for no group
            wellNames[wellId] = '';
            td.id = wellId;
            td.style.background = '#E8E6F0'; // light gray for empty
            td.title = wellId;
            td.style.position = 'relative';
            td.innerHTML = '<div class="well-name"></div>';
            td.addEventListener('click', () => openWellModal(wellId));
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    });
}

function getColorForGroup(groupName) {
    if (!groupName || groupName.trim() === '') {
        return '#E8E6F0'; // empty/light gray
    }
    
    if (groupColors[groupName]) {
        return groupColors[groupName];
    }
    
    // Assign new color
    const color = colorPalette[colorIndex % colorPalette.length];
    groupColors[groupName] = color;
    colorIndex++;
    return color;
}

function openWellModal(wellId) {
    currentWell = wellId;
    document.getElementById('wellId').textContent = wellId;
    document.getElementById('groupNameInput').value = plateData[wellId] || '';
    document.getElementById('wellNameInput').value = wellNames[wellId] || '';
    document.getElementById('wellModal').classList.add('show');
    document.getElementById('groupNameInput').focus();
}

function closeWellModal() {
    document.getElementById('wellModal').classList.remove('show');
    currentWell = null;
}

function saveWellData() {
    if (!currentWell) return;
    
    const groupName = document.getElementById('groupNameInput').value;
    const wellName = document.getElementById('wellNameInput').value;
    
    plateData[currentWell] = groupName;
    wellNames[currentWell] = wellName;
    
    // Update the visual
    const td = document.getElementById(currentWell);
    const color = getColorForGroup(groupName);
    td.style.background = color;
    
    // Update well name display
    const nameDiv = td.querySelector('.well-name');
    nameDiv.textContent = wellName || '';
    
    savePlateToStorage();
    closeWellModal();
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('wellModal');
    if (event.target === modal) {
        closeWellModal();
    }
}

function clearPlate() {
    if (confirm('Clear all wells?')) {
        rows.forEach(row => {
            for (let col = 1; col <= cols; col++) {
                const wellId = `${row}${col}`;
                plateData[wellId] = '';
                wellNames[wellId] = '';
                const td = document.getElementById(wellId);
                td.style.background = '#E8E6F0';
                const nameDiv = td.querySelector('.well-name');
                nameDiv.textContent = '';
            }
        });
        groupColors = {};
        colorIndex = 0;
        savePlateToStorage();
    }
}

function downloadLayout() {
    let textContent = '96-Well Plate Layout\n';
    textContent += '====================\n\n';
    
    rows.forEach(row => {
        for (let col = 1; col <= cols; col++) {
            const wellId = `${row}${col}`;
            const groupName = plateData[wellId];
            const wellName = wellNames[wellId];
            
            if (groupName && groupName.trim() !== '') {
                if (wellName) {
                    textContent += `${wellId} (${wellName}): ${groupName}\n`;
                } else {
                    textContent += `${wellId}: ${groupName}\n`;
                }
            }
        }
    });
    
    textContent += '\n\nGroup Summary:\n';
    const summary = getSummary();
    Object.entries(summary).forEach(([groupName, count]) => {
        if (groupName.trim() !== '') {
            textContent += `${groupName}: ${count} wells\n`;
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
    const summary = {};
    
    rows.forEach(row => {
        for (let col = 1; col <= cols; col++) {
            const wellId = `${row}${col}`;
            const groupName = plateData[wellId];
            if (groupName && groupName.trim() !== '') {
                summary[groupName] = (summary[groupName] || 0) + 1;
            }
        }
    });
    
    return summary;
}

// Local storage functions
function savePlateToStorage() {
    try {
        localStorage.setItem('plateData', JSON.stringify(plateData));
        localStorage.setItem('wellNames', JSON.stringify(wellNames));
        localStorage.setItem('groupColors', JSON.stringify(groupColors));
        localStorage.setItem('colorIndex', colorIndex.toString());
    } catch (e) {
        console.log('Could not save to localStorage:', e);
    }
}

function loadPlateFromStorage() {
    try {
        const savedPlate = localStorage.getItem('plateData');
        const savedNames = localStorage.getItem('wellNames');
        const savedColors = localStorage.getItem('groupColors');
        const savedColorIndex = localStorage.getItem('colorIndex');
        
        if (savedPlate) {
            const loadedData = JSON.parse(savedPlate);
            rows.forEach(row => {
                for (let col = 1; col <= cols; col++) {
                    const wellId = `${row}${col}`;
                    if (loadedData[wellId]) {
                        plateData[wellId] = loadedData[wellId];
                        const td = document.getElementById(wellId);
                        const color = getColorForGroup(loadedData[wellId]);
                        td.style.background = color;
                    }
                }
            });
        }
        
        if (savedNames) {
            const loadedNames = JSON.parse(savedNames);
            rows.forEach(row => {
                for (let col = 1; col <= cols; col++) {
                    const wellId = `${row}${col}`;
                    if (loadedNames[wellId]) {
                        wellNames[wellId] = loadedNames[wellId];
                        const td = document.getElementById(wellId);
                        const nameDiv = td.querySelector('.well-name');
                        nameDiv.textContent = loadedNames[wellId];
                    }
                }
            });
        }
        
        if (savedColors) {
            Object.assign(groupColors, JSON.parse(savedColors));
        }
        
        if (savedColorIndex) {
            colorIndex = parseInt(savedColorIndex);
        }
    } catch (e) {
        console.log('Could not load from localStorage:', e);
    }
}
