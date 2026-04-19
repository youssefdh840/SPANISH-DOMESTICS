document.addEventListener('DOMContentLoaded', () => {
    const vocab = [
        { id: '1', word: 'una cocina eléctrica', category: 'La Cocina' },
        { id: '2', word: 'un frigorífico', category: 'La Cocina' },
        { id: '3', word: 'un horno', category: 'La Cocina' },
        { id: '4', word: 'un lavavajillas', category: 'La Cocina' },
        { id: '5', word: 'una sartén', category: 'La Cocina' },
        { id: '6', word: 'una tetera', category: 'La Cocina' },
        { id: '7', word: 'un sofá', category: 'El Salón' },
        { id: '8', word: 'un televisor', category: 'El Salón' },
        { id: '9', word: 'una alfombra', category: 'El Salón' },
        { id: '10', word: 'un cuadro', category: 'El Salón' },
        { id: '11', word: 'un sillón', category: 'El Salón' },
        { id: '12', word: 'una chimenea', category: 'El Salón' },
        { id: '13', word: 'una cama', category: 'El Dormitorio' },
        { id: '14', word: 'una almohada', category: 'El Dormitorio' },
        { id: '15', word: 'una lámpara', category: 'El Dormitorio' },
        { id: '16', word: 'un armario', category: 'El Dormitorio' },
        { id: '17', word: 'una cómoda', category: 'El Dormitorio' },
        { id: '18', word: 'un perchero', category: 'El Dormitorio' },
        { id: '19', word: 'un inodoro', category: 'El Cuarto de Baño' },
        { id: '20', word: 'un lavabo', category: 'El Cuarto de Baño' },
        { id: '21', word: 'una bañera', category: 'El Cuarto de Baño' },
        { id: '22', word: 'una ducha', category: 'El Cuarto de Baño' },
        { id: '23', word: 'un espejo', category: 'El Cuarto de Baño' },
        { id: '24', word: 'una toalla', category: 'El Cuarto de Baño' }
    ];

    let selectedItem = null;
    let score = 0;
    let lives = 3;

    function init() {
        const bank = document.getElementById('word-bank');
        if (!bank) return;
        bank.innerHTML = '';
        const shuffled = [...vocab].sort(() => Math.random() - 0.5);
        
        shuffled.forEach(item => {
            const div = document.createElement('div');
            div.className = 'word-node';
            div.textContent = item.word;
            div.dataset.id = item.id;
            
            div.addEventListener('click', () => {
                if (score === vocab.length || lives === 0) return;
                
                if (selectedItem && selectedItem.id === item.id) {
                    div.classList.remove('active');
                    selectedItem = null;
                } else {
                    document.querySelectorAll('.word-node').forEach(n => n.classList.remove('active'));
                    div.classList.add('active');
                    selectedItem = item;
                }
            });
            
            bank.appendChild(div);
        });

        updateLives();
    }

    function updateLives() {
        const hearts = document.getElementById('lives-display');
        if (!hearts) return;
        hearts.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const heart = document.createElement('span');
            heart.textContent = '❤️';
            heart.style.opacity = i < lives ? '1' : '0.2';
            heart.style.marginRight = '5px';
            hearts.appendChild(heart);
        }
    }

    document.querySelectorAll('.room').forEach(room => {
        room.addEventListener('click', () => {
            if (!selectedItem || lives === 0) return;
            
            if (selectedItem.category === room.dataset.category) {
                // Correct
                score++;
                document.getElementById('score').textContent = `${score} / ${vocab.length}`;
                
                const placed = document.createElement('div');
                placed.className = 'placed-word';
                placed.textContent = selectedItem.word;
                room.querySelector('.placed-container').appendChild(placed);
                
                const el = document.querySelector(`[data-id="${selectedItem.id}"]`);
                if (el) el.remove();
                selectedItem = null;
                
                if (score === vocab.length) {
                    showWin();
                }
            } else {
                // Wrong
                lives--;
                updateLives();
                const el = document.querySelector(`[data-id="${selectedItem.id}"]`);
                if (el) {
                    el.classList.add('error');
                    
                    if (lives === 0) {
                        showGameOver();
                    } else {
                        setTimeout(() => {
                            el.classList.remove('error');
                            el.classList.remove('active');
                            selectedItem = null;
                        }, 500);
                    }
                }
            }
        });
    });

    function showWin() {
        const modal = document.getElementById('win-modal');
        if (!modal) return;
        const content = modal.querySelector('.modal-content');
        content.innerHTML = `
            <span class="trophy">🏆</span>
            <h2>¡FELICIDADES!</h2>
            <p>ERES UN EXPERTO DEL HOGAR.</p>
            <button onclick="location.reload()">JUGAR DE NUEVO</button>
        `;
        modal.classList.remove('hidden');
        startConfetti();
    }

    function showGameOver() {
        const modal = document.getElementById('win-modal');
        if (!modal) return;
        const content = modal.querySelector('.modal-content');
        content.className = 'modal-content game-over-style';
        content.innerHTML = `
            <span class="skull" style="font-size: 6rem;">💀</span>
            <h2 style="color: #ff5252;">GAME OVER</h2>
            <p>TE HAS QUEDADO SIN VIDAS.</p>
            <button onclick="location.reload()" style="background: #ff5252; color: white;">REINTENTAR</button>
        `;
        modal.classList.remove('hidden');
    }

    function startConfetti() {
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = ['#ffeb3b', '#ffffff', '#a1a1aa'][Math.floor(Math.random() * 3)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.zIndex = '1001';
            document.body.appendChild(confetti);
            
            const duration = Math.random() * 3 + 2;
            confetti.animate([
                { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
                { transform: `translateY(100vh) rotate(360deg)`, opacity: 0 }
            ], {
                duration: duration * 1000,
                easing: 'linear'
            }).onfinish = () => confetti.remove();
        }
    }

    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) resetBtn.addEventListener('click', () => location.reload());

    init();
});
