document.addEventListener('DOMContentLoaded', () => {
    // تأثيرات المؤشر
    const cursor = document.querySelector('.cursor-effect');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    document.addEventListener('mousedown', () => {
        cursor.classList.add('active');
    });
    
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('active');
    });
    
    // عناصر اللعبة
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const playerSpan = document.getElementById('player');
    const restartBtn = document.getElementById('restartBtn');
    
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // صفوف
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // أعمدة
        [0, 4, 8], [2, 4, 6]             // أقطار
    ];
    
    // تهيئة اللعبة
    function initGame() {
        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
            cell.addEventListener('mouseenter', handleCellHover);
            cell.addEventListener('mouseleave', handleCellHoverOut);
        });
        
        restartBtn.addEventListener('click', restartGame);
        
        // تأثيرات دخول وخروج الماوس من الخلايا
        function handleCellHover(e) {
            if (gameActive && e.target.textContent === '') {
                e.target.style.transform = 'translateY(-5px) scale(1.05)';
                e.target.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
                cursor.style.width = '40px';
                cursor.style.height = '40px';
            }
        }
        
        function handleCellHoverOut(e) {
            e.target.style.transform = '';
            e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            cursor.style.width = '20px';
            cursor.style.height = '20px';
        }
    }
    
    // التعامل مع نقرات الخلايا
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }
        
        // click effect
        clickedCell.style.transform = 'scale(0.9)';
        setTimeout(() => {
            clickedCell.style.transform = 'scale(1)';
        }, 100);
        
        // تحديث حالة اللعبة
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer === 'X' ? 'x-symbol' : 'o-symbol');
        
        // التحقق من النتيجة
        checkResult();
    }
    
    // التحقق من الفوز أو التعادل
    function checkResult() {
        let roundWon = false;
        
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
                continue;
            }
            
            if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
                roundWon = true;
                
                // إضافة تأثير الفوز للخلايا الفائزة
                cells[a].classList.add('win');
                cells[b].classList.add('win');
                cells[c].classList.add('win');
                
                break;
            }
        }
        
        if (roundWon) {
            status.innerHTML = `فاز لاعب <span style="color:${currentPlayer === 'X' ? 'var(--x-color)' : 'var(--o-color)'}">${currentPlayer}</span>!`;
            gameActive = false;
            createConfetti();
            return;
        }
        
        if (!gameState.includes('')) {
            status.textContent = 'تعادل!';
            gameActive = false;
            return;
        }
        
        // تغيير اللاعب
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerSpan.textContent = currentPlayer;
        playerSpan.style.color = currentPlayer === 'X' ? 'var(--x-color)' : 'var(--o-color)';
        
        // تأثير تغيير الدور
        status.classList.remove('active');
        setTimeout(() => {
            status.classList.add('active');
        }, 10);
    }
    
    // إعادة اللعبة
    function restartGame() {
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        
        playerSpan.textContent = currentPlayer;
        playerSpan.style.color = 'var(--x-color)';
        status.innerHTML = 'دور لاعب: <span id="player">X</span>';
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x-symbol', 'o-symbol', 'win');
            cell.style.transform = '';
            cell.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });
        
        // تأثير النقر على زر الإعادة
        restartBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            restartBtn.style.transform = '';
        }, 150);
    }
    
    // تأثير الكونفيتي عند الفوز
    function createConfetti() {
        const colors = ['var(--x-color)', 'var(--o-color)', 'var(--primary)', 'var(--secondary)'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = -10 + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            
            document.body.appendChild(confetti);
            
            // تأثير سقوط الكونفيتي
            setTimeout(() => {
                confetti.style.opacity = '1';
                confetti.style.top = '100vh';
                confetti.style.left = parseFloat(confetti.style.left) + (Math.random() - 0.5) * 100 + 'px';
                confetti.style.transition = `top ${Math.random() * 3 + 2}s linear, left ${Math.random() * 3 + 2}s linear`;
                
                // إزالة الكونفيتي بعد السقوط
                setTimeout(() => {
                    confetti.remove();
                }, 5000);
            }, i * 30);
        }
    }
    
    // بدء اللعبة
    initGame();
});