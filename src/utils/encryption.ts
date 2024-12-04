// This is a basic encryption implementation. In production, use a proper encryption library
const ENCRYPTION_KEY = 'your-secret-key-must-be-32-bytes-long!!'; // 32 bytes for AES-256

const getKeyMaterial = async () => {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(ENCRYPTION_KEY);
  
  // Ensure the key is exactly 32 bytes (256 bits)
  const paddedKeyData = new Uint8Array(32);
  paddedKeyData.set(keyData.slice(0, 32));
  if (keyData.length < 32) {
    // Pad with zeros if key is too short
    paddedKeyData.fill(0, keyData.length);
  }
  
  return await crypto.subtle.importKey(
    'raw',
    paddedKeyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
};

export const encryptData = async (data: string): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    const key = await getKeyMaterial();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBuffer
    );
    
    const encryptedArray = new Uint8Array(encrypted);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);
    
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption error:', error);
    // Return empty string on encryption error to prevent logout
    return '';
  }
};

export const decryptData = async (encryptedData: string): Promise<string> => {
  try {
    const decoder = new TextDecoder();
    const combined = new Uint8Array(
      atob(encryptedData)
        .split('')
        .map((char) => char.charCodeAt(0))
    );
    
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    
    const key = await getKeyMaterial();
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );
    
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    // Return empty string on decryption error to prevent logout
    return '';
  }
};