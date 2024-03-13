import axios from "axios";

const options = {
    method: 'GET',
    url: 'https://dolarapi.com/v1/dolares',
    headers: { Accept: 'application/json' }
};

const getDolars = async () => {
    try {
        const data = await axios.request(options);
        return data.data;
    } catch (error) {
        console.error(error);
    }
}

export default getDolars;
