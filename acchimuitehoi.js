const directions = ['上', '下', '左', '右'];
const jankenHands = ['グー', 'チョキ', 'パー'];
let playerWon = false;
let totalWins = 0;
let totalLosses = 0;

// DOMContentLoadedイベントで初期設定を行う
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startButton').addEventListener('click', startGame);
    document.querySelectorAll('.janken-button').forEach(button => {
        button.addEventListener('click', () => janken(button.dataset.hand));
    });
    document.querySelectorAll('.dir-btn').forEach(button => {
        button.addEventListener('click', () => playGame(button.id));
    });
    document.getElementById('restartButton').addEventListener('click', restartGame);
});

// ゲーム開始時に呼ばれる関数
function startGame() {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    resetGame();
}

// じゃんけんの処理を行う関数
function janken(playerHand) {
    if (totalWins >= 3 || totalLosses >= 3) {
        return; // 3勝か3敗している場合は何もしない
    }

    const resultElement = document.getElementById('result');
    resetBackgroundAndStars(); // 背景と星のリセット

    const computerHand = jankenHands[Math.floor(Math.random() * jankenHands.length)];
    let resultMessage = `あなた: ${playerHand} 　 コンピュータ: ${computerHand}<br>`;

    if (playerHand === computerHand) {
        resultMessage += "引き分けです。<br>もう一度じゃんけんをしてください。";
        resultElement.innerHTML = resultMessage;
        resultElement.style.color = 'black';
        return;
    }

    if ((playerHand === 'グー' && computerHand === 'チョキ') ||
        (playerHand === 'チョキ' && computerHand === 'パー') ||
        (playerHand === 'パー' && computerHand === 'グー')) {
        playerWon = true;
        resultMessage += "あなたの勝ちです！<br>指をさす方向を選んでください。<br><strong class='acchi-muite-hoi'>あっち向いてホイ！</strong>";
        resultElement.style.color = 'blue';
    } else {
        playerWon = false;
        resultMessage += "あなたの負けです。<br>顔を向ける方向を選んでください。<br><strong class='acchi-muite-hoi'>あっち向いてホイ！</strong>";
        resultElement.style.color = 'red';
    }

    resultElement.innerHTML = resultMessage;
    toggleJankenAndDirectionButtons(); // ボタンの表示切り替え
}

// あっち向いてホイの処理を行う関数
function playGame(playerDirection) {
    if (totalWins >= 3 || totalLosses >= 3) {
        return; // 3勝か3敗している場合は何もしない
    }

    const resultElement = document.getElementById('result');
    const computerDirection = directions[Math.floor(Math.random() * directions.length)];
    let resultMessage = `あなた: ${playerDirection}　　　 コンピュータ: ${computerDirection}<br>`;

    if (playerWon) {
        if (playerDirection === computerDirection) {
            resultMessage += "<b><span class='large-text'>あなたの勝ちです！<br>おめでとうございます！</span></b>";
            document.body.classList.add('win-background');
            totalWins++;
            triggerStarAnimation(); // 勝利時の星のアニメーションを実行
        } else {
            resultMessage += "引き分けです。<br>もう一度じゃんけんをしてください。";
            document.body.classList.add('tie-background');
        }
    } else {
        if (playerDirection === computerDirection) {
            resultMessage += "<b><span class='large-text'>あなたの負けです…</span></b>";
            document.body.classList.add('lose-background');
            totalLosses++;
        } else {
            resultMessage += "引き分けです。<br>もう一度じゃんけんをしてください。";
            document.body.classList.add('tie-background');
        }
    }

    resultElement.innerHTML = resultMessage;
    updateScore(); // スコアの更新

    // ゲームオーバーの処理
    if (totalWins >= 3 || totalLosses >= 3) {
        resultElement.innerHTML += "<br><span class='large-text game-over-text'>★GAME OVER★</span>";
        document.querySelectorAll('button').forEach(button => button.classList.add('game-over'));
        document.getElementById('restartButton').classList.add('restart-button');
        document.getElementById('restartButton').style.display = 'block';
    }

    toggleJankenAndDirectionButtons(); // ボタンの表示切り替え
}

// ゲームの再スタート時に呼ばれる関数
function restartGame() {
    totalWins = 0;
    totalLosses = 0;
    playerWon = false;
    document.querySelectorAll('button').forEach(button => button.classList.remove('game-over'));
    document.getElementById('restartButton').classList.remove('restart-button');
    document.getElementById('result').innerHTML = '';
    document.getElementById('restartButton').style.display = 'none';
    document.getElementById('startScreen').style.display = 'block';
    document.getElementById('game').style.display = 'none';
    resetBackgroundAndStars(); // 背景と星のリセット
    updateScore();
}

// スコアを更新する関数
function updateScore() {
    document.getElementById('winCount').innerText = totalWins;
    document.getElementById('loseCount').innerText = totalLosses;
    document.getElementById('score').style.display = 'block';
}

// すべての星を削除する関数
function removeAllStars() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => star.remove());
}

// ランダムな位置に星を生成する関数
function createRandomStar() {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}vw`;
    star.style.animationDelay = `${Math.random() * 5}s`;
    star.style.animationDuration = `${3 + Math.random() * 2}s`;
    document.body.appendChild(star);

    // 星が画面外に出たら削除
    setTimeout(() => {
        star.remove();
    }, 5000);
}

// 勝利時に星のアニメーションを実行する関数
function triggerStarAnimation() {
    for (let i = 0; i < 10; i++) {
        createRandomStar();
    }
}

// 背景と星をリセットする関数
function resetBackgroundAndStars() {
    removeAllStars();
    document.body.classList.remove('tie-background', 'win-background', 'lose-background');
}

// じゃんけんとあっち向いてホイのボタン表示を切り替える関数
function toggleJankenAndDirectionButtons() {
    const jankenButtons = document.getElementById('jankenButtons');
    const directionButtons = document.getElementById('directionButtons');
    const boldText = document.querySelector('.bold-text');
    jankenButtons.style.display = jankenButtons.style.display === 'none' ? 'block' : 'none';
    directionButtons.style.display = directionButtons.style.display === 'none' ? 'block' : 'none';
    boldText.style.display = boldText.style.display === 'none' ? 'block' : 'none';
}

// ゲームをリセットする関数
function resetGame() {
    totalWins = 0;
    totalLosses = 0;
    updateScore();
    resetBackgroundAndStars();
}
