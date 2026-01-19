document.addEventListener('DOMContentLoaded', function() {
    // Get video parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');
    const encodedTitle = urlParams.get('title');
    
    // Decode the title (handle cases where title might be null)
    const videoTitle = encodedTitle ? decodeURIComponent(encodedTitle) : 'Our Video';

    // Set up the video player
    const player = document.getElementById('yt-player');
    if (videoId) {
        player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else {
        player.innerHTML = '<p>No video selected</p>';
    }

    // Set the video title
    const titleElement = document.getElementById('video-title');
    if (titleElement) {
        titleElement.textContent = videoTitle;
    }

    // Set up share links
    const currentUrl = window.location.href.split('?')[0];
    const shareUrl = `${currentUrl}?id=${videoId}${encodedTitle ? `&title=${encodedTitle}` : ''}`;
    const encodedShareUrl = encodeURIComponent(shareUrl);
    const shareText = encodeURIComponent(`Watch "${videoTitle}" on UMRT`);

    // Update all share buttons
    document.querySelectorAll('.social-share').forEach((share, index) => {
        const platforms = [
            `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`,
            `https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${shareText}`,
            `https://www.linkedin.com/shareArticle?mini=true&url=${encodedShareUrl}&title=${shareText}`,
            `https://wa.me/?text=${shareText}%20${encodedShareUrl}`
        ];
        share.href = platforms[index];
    });
});