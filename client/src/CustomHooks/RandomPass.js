const CreateKey = () => {
    const array = new Uint8Array(32); // 64 bits = 8 bytes
    window.crypto.getRandomValues(array); // Fill array with cryptographically secure random numbers

    // Convert to a hexadecimal string
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

const GenerateRandomPass=(UserName)=>{
    let val=localStorage.getItem("RandomPass");
    if(val!=null){
        console.log("Key already Found......");
        return val;
    }

    const RandomKey=CreateKey(UserName);
    console.log(RandomKey);
    localStorage.setItem('RandomPass',RandomKey);
    return RandomKey;
}

export default {GenerateRandomPass};