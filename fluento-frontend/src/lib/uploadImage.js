import toast from 'react-hot-toast';

export async function uploadImage(file) {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    const errorMsg = 'Image upload API key is not configured.';
    toast.error(errorMsg);
    throw new Error(errorMsg);
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });
    
    if (!res.ok) {
      throw new Error(`Upload failed with status code ${res.status}`);
    }

    const result = await res.json();
    if (result && result.data && result.data.url) {
      return result.data.url;
    } else {
      throw new Error('Invalid response structure received from server.');
    }
  } catch (error) {
    const errorMsg = error.message || 'Failed to upload image.';
    toast.error(errorMsg);
    throw error;
  }
}
