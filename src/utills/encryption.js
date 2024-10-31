export function toBase64(data) {
    // Convert the data to a string if it's not already one
    const stringData = typeof data === 'string' ? data : JSON.stringify(data);

    // Use TextEncoder to encode the string to a Uint8Array
    const encoder = new TextEncoder();
    const byteArray = encoder.encode(stringData);

    // Convert the byte array to Base64
    return btoa(String.fromCharCode(...byteArray));
}

// Function to convert Base64 back to data
export function fromBase64(base64) {
    // Decode the Base64 string to a byte array
    const byteCharacters = atob(base64);
    const byteNumbers = new Uint8Array(byteCharacters.length);

    // Convert the byte string back to a byte array
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    // Use TextDecoder to decode the byte array back to a string
    const decoder = new TextDecoder();
    const decodedString = decoder.decode(byteNumbers);

    // Parse the string back to its original format (JSON or string)
    try {
        return JSON.parse(decodedString);
    } catch (e) {
        return decodedString; // Return as string if parsing fails
    }
}