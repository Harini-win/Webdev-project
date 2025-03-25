

    function createFoodEmoji(x, y) {
        const emojiList = ["🍕", "🍔", "🍣", "🍩", "🍉", "🍪", "🥑", "🍟", "🍎", "🌮"];
        const foodEmoji = document.createElement("div");
        foodEmoji.classList.add("food-emoji");
        foodEmoji.textContent = emojiList[Math.floor(Math.random() * emojiList.length)];

        foodEmoji.style.left = `${x}px`;
        foodEmoji.style.top = `${y}px`;

        const randomX = (Math.random() - 0.5) * 100; // Random horizontal movement
        const randomY = Math.random() * 100 + 50; // Random fall distance
        foodEmoji.style.setProperty("--x", `${randomX}px`);
        foodEmoji.style.setProperty("--y", `${randomY}px`);

        document.body.appendChild(foodEmoji);

        setTimeout(() => {
            foodEmoji.remove(); // Remove emoji after animation
        }, 1000);
    }