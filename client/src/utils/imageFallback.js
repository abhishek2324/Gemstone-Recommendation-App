export const getGemstoneImageFallback = (name, size = 128) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'G')}&background=7e22ce&color=fff&size=${size}`;

export const handleImageError = (event, name, size = 128) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = getGemstoneImageFallback(name, size);
};
