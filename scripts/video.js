// Video Data - Only place you need to update video IDs and titles
const videoData = [
    { id: 'xysBn_RJ4ks', title: 'UIU MARS ROVER | AXIOS | ARC 2025 | VIDEO REPORT' },
    { id: 'xgVbjqFUdvA', title: 'UIU MARS ROVER TEAM | AXIOS | URC SAR 2025' },
    { id: 'uKANf94gSFs', title: 'UIU MARS ROVER TEAM | YGGDRASIL | URC SAR 2024' },
    { id: 'paUEfTt5tr4', title: 'UIU MARS ROVER | TELOS | ARC 2023 | VIDEO REPORT' },
    { id: 'w3vRvjVvu4A', title: 'UIU MARS ROVER TEAM | TELOS | ICARUS | URC SAR 2023' },
    { id: 'elEY-_VirTA', title: 'UIU Mars Rover Team | MAVEN | URC SAR 2022' },
    // Add more videos as needed
];

document.addEventListener('DOMContentLoaded', function () {
    const videoGrid = document.querySelector('.video-grid');

    // Generate video cards from the videoData array
    videoData.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
            <a href="video_play.html?id=${video.id}&title=${encodeURIComponent(video.title)}" class="video-link">
                <div class="video-thumbnail">
                    <img src="https://img.youtube.com/vi/${video.id}/maxresdefault.jpg" alt="${video.title}" class="thumbnail-img">
                    <div class="play-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                </div>
                <h3 class="video-title">${video.title}</h3>
            </a>
            <div class="video-actions">
                <button class="share-btn">
                    <i class="fas fa-share-alt"></i> Share
                </button>
                <div class="share-options">
                    <a href="#" class="social-share facebook"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" class="social-share twitter"><i class="fab fa-x-twitter"></i></a>
                    <a href="#" class="social-share linkedin"><i class="fab fa-linkedin-in"></i></a>
                    <a href="#" class="social-share whatsapp"><i class="fab fa-whatsapp"></i></a>
                </div>
            </div>
        `;
        videoGrid.appendChild(videoCard);

        // Set up share links
        const videoUrl = `https://youtube.com/watch?v=${video.id}`;
        const encodedUrl = encodeURIComponent(videoUrl);
        const shareText = encodeURIComponent(`Check out this video: ${video.title}`);

        const shareOptions = videoCard.querySelector('.share-options');
        const shares = shareOptions.querySelectorAll('.social-share');
        shares[0].href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        shares[1].href = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`;
        shares[2].href = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${video.title}`;
        shares[3].href = `https://wa.me/?text=${shareText}%20${encodedUrl}`;
    });
});